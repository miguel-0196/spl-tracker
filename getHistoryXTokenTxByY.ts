// How many X token transfer by Y
import * as web3 from '@solana/web3.js';

const limitTxn2View = 10
const walletAddress = 'BRwv49yzZXL5W2dS69KKT9W4t44JmutVhQBb6tFNgWdK'; // Y Token account
const ownerAddress  = 'EXqYZtA1d4Nx2WjYuQ1GvdeujFM8VbvmjfdmJBJj7guc'; // Y address
const tokenAddress  = 'EJPtJEDogxzDbvM8qvAsqYbLmPj5n1vQeqoAzj9Yfv3q'; // X
const solanaConnection = new web3.Connection('XXX');

const getTransactions = async(address: string) => {
  const pubKey = new web3.PublicKey(address);
  let transactionList = await solanaConnection.getSignaturesForAddress(pubKey, { limit: limitTxn2View });
  let signatureList = transactionList.map(transaction=>transaction.signature);

  for await (const sig of signatureList) {
    const txData = await solanaConnection.getParsedTransaction(sig);

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
    console.log(`Refer Url: https://solscan.io/tx/${txData['transaction']['signatures'][0]}`)
    console.log(``)
  }

  console.log(`More info: https://solscan.io/account/${address}#splTransfer`)
}

getTransactions(walletAddress);