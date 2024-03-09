import * as fs from 'fs'
import dotenv from 'dotenv'
import * as readline from 'readline'
import { Connection, GetProgramAccountsFilter, PublicKey } from "@solana/web3.js"

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getTokenAccountsBulk(wallets: string[], solanaConnection: Connection, wantNFT: boolean, tokenAddress: string) {
  for (let i = 0; i < wallets.length; i++) {
    console.log("")
    console.log("##################################", wallets[i], "##################################")
    console.log("")
    await getTokenAccounts(wallets[i], solanaConnection, wantNFT, tokenAddress)
    await sleep(1000)
  }
}

async function getTokenAccounts(wallet: string, solanaConnection: Connection, wantNFT: boolean, tokenAddress: string) {
  const filters:GetProgramAccountsFilter[] = [
    {
      dataSize: 165,    //size of account (bytes)
    },
    {
      memcmp: {
        offset: 32,     //location of our query in the account (bytes)
        bytes: wallet,  //our search criteria, a base58 encoded string
      }
    }
  ];
  const accounts = await solanaConnection.getParsedProgramAccounts(
    new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    {filters: filters}
  );

  let count = 0
  let total = 0
  await accounts.forEach((account, i) => {
      if (count > 40)
        return;

      //Parse the account data
      const parsedAccountInfo:any = account.account.data;
      const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
      const ownerAddress:number = parsedAccountInfo["parsed"]["info"]["owner"];
      const tokenBalance:number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
      const tokenDecimal:number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["decimals"];

      //Log results
      if (tokenAddress == mintAddress) {
        console.log(`Bozo: ${account.pubkey.toString()}\t${mintAddress}\t${tokenBalance}`)
        return true;
      } else if (tokenAddress == '' && tokenBalance > 0 && ( wantNFT == false && tokenDecimal > 0 || wantNFT == true && tokenDecimal == 0)) {
        count = count + 1
        total = total + tokenBalance
        console.log(`${count}: ${account.pubkey.toString()}\t${mintAddress}\t${tokenBalance}`)
      }
  });

  if (tokenAddress == '') {
    console.log(``);
    console.log(`Total: ${total}`);
    console.log(``);
    console.log(`URL: https://solscan.io/account/${wallet}#portfolio`);
    console.log(``);
  }
}

async function getTransactionsBulk(wallets: string[], tokenAddress: string, solanaConnection: Connection, limitTxn2View: number) {
  for (let i = 0; i < wallets.length; i++) {
    console.log("")
    console.log("##################################", wallets[i], "##################################")
    console.log("")

    const _ataAddress = await solanaConnection.getTokenAccountsByOwner(new PublicKey(wallets[i]), {mint: new PublicKey(tokenAddress)});
    const ataAddress = _ataAddress.value[0].pubkey.toString()
    await getTransactions(wallets[i], ataAddress, tokenAddress, solanaConnection, limitTxn2View)
    await sleep(1000)
  }
}

const getTransactions = async(ownerAddress: string, ataAddress: string, tokenAddress: string, solanaConnection: Connection, limitTxn2View: number) => {
    const pubKey = new PublicKey(ataAddress);
    let transactionList = await solanaConnection.getSignaturesForAddress(pubKey, { limit: limitTxn2View });
    let signatureList = transactionList.map(transaction=>transaction.signature);
  
    for await (const sig of signatureList) {
      const txData = await solanaConnection.getParsedTransaction(sig, {maxSupportedTransactionVersion: 0});
  
      if (txData == null || txData['meta'] == null
       || txData['blockTime'] == null
       || txData['meta']['postTokenBalances'] == null
       || txData['meta']['preTokenBalances'] == null
       || txData['transaction']['signatures'].length == 0) {
        console.log('Not SPL Token transaction, so skiped.')
        continue;
      }
  
      let mount1;
      txData['meta']['preTokenBalances'].forEach((el) => {
        if (el['mint'] == tokenAddress
         && el['owner'] == ownerAddress)
         mount1 = el['uiTokenAmount']['uiAmount'];
      });
        
      let mount2;
      txData['meta']['postTokenBalances'].forEach((el) => {
        if (el['mint'] == tokenAddress
        && el['owner'] == ownerAddress)
        mount2 = el['uiTokenAmount']['uiAmount'];
      });
    
      if (mount1 == undefined || mount2 == undefined)
        continue;
  
      const date = new Date(txData['blockTime'] * 1000);
      console.log(date.toString());
      console.log(`Balance Before: ${mount1}`);
      console.log(`Balance After: ${mount2}`);
      console.log(`Change: ${mount2 - mount1}`);
      console.log(`URL: https://solscan.io/tx/${txData['transaction']['signatures'][0]}`)
      console.log(``)
    }
  
    console.log(`SPL Token history for wallet ${ataAddress}.`);
    console.log(`URL: https://solscan.io/account/${ataAddress}#splTransfer`)
}


(async () => {
  console.log(``)
  console.log(`##################################################################################################################`)
  console.log(`#                                                                                                                #`)
  console.log(`#                                         BOZO TOKEN OWNER WALLET TRACKER                                        #`)
  console.log(`#                                                                                                                #`)
  console.log(`##################################################################################################################`)
  console.log(``)

  dotenv.config()
  const rpcNode = process.env.RPC_NODE
  const tokenAddress  = process.env.TOKEN_ADDRESS
  const ownerWallets = process.env.OWNER_WALLETS
  const limitTxn2View = process.env.LIMIT_TXN_2_VIEW
  //const bozoNFT = JSON.parse(fs.readFileSync('bozo-nft.json', 'utf-8'))

  if (rpcNode == undefined) {
      console.log('No RPC Node configuration at .env file. Key = RPC_NODE')
      return
  }

  if (tokenAddress == undefined) {
      console.log('No Token address configuration at .env file. Key = TOKEN_ADDRESS')
      return
  }

  if (ownerWallets == undefined) {
      console.log('No Owner wallets configuration at .env file. Key = OWNER_WALLETS')
      return
  }
  const targetWallets: string[] = ownerWallets.split(' ')

  if (limitTxn2View == undefined) {
      console.log('No LIMIT_TXN_2_VIEW configuration at .env file.')
      return
  }

  console.log('Wallets:', targetWallets)
  console.log('')
  console.log(`1. Get Tokens Balance.`)
  console.log(`2. Get NFTs Balance.`)
  console.log(`3. Get Tokens Transfer History.`)
  console.log(``)
  
  const solanaConnection = new Connection(rpcNode)
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('What do you want: ', (input) => {
    console.log(``)
    switch (input) {
      case '1':
        getTokenAccountsBulk(targetWallets, solanaConnection, false, tokenAddress)
        break;
      case '2':
        getTokenAccountsBulk(targetWallets, solanaConnection, true, '')
        break;
      case '3':
        getTransactionsBulk(targetWallets, tokenAddress, solanaConnection, parseInt(limitTxn2View, 10))
        break;
      default:
        console.log('Wrong input!')
    }
    rl.close()
  })
})()