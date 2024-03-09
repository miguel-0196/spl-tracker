// How to Get All Tokens Held by a Wallet in Solana
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";

const walletToQuery = '133rdpoZ8inrg3itVREZkkLE2C3mgso2auembBbfFCpu';
const rpcLEnode = 'XXX'

async function getTokenAccounts(wallet: string, solanaConnection: Connection) {
    const filters:GetProgramAccountsFilter[] = [
        {
          dataSize: 165,    //size of account (bytes)
        },
        {
          memcmp: {
            offset: 32,     //location of our query in the account (bytes)
            bytes: wallet,  //our search criteria, a base58 encoded string
          },            
        }
    ];
    const accounts = await solanaConnection.getParsedProgramAccounts(
        new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        {filters: filters}
    );

    await accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo:any = account.account.data;
        const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
        const ownerAddress:number = parsedAccountInfo["parsed"]["info"]["owner"];
        const tokenBalance:number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        const tokenDecimal:number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["decimals"];

        //Log results
        console.log(`${i+1}. Token Account: ${account.pubkey.toString()}`);
        console.log(`- Type: ${tokenDecimal == 0 ? 'NFT' : 'Token'}`);
        console.log(`- SOL Balanve: ${account.account.lamports * 0.000000001}`);
        console.log(`- Token Balance: ${tokenBalance}`);
        console.log(`- Token Mint: ${mintAddress}`);
        console.log(`- Token Owner: ${ownerAddress}`);
        console.log(`- Refer Url: https://solscan.io/account/${account.pubkey.toString()}`);
        console.log(``);
    });

    console.log(`Found ${accounts.length} token account(s) for wallet ${wallet}.`);
    console.log(`Refer Url: https://solscan.io/account/${wallet}#portfolio`);
    console.log(``);
}

const solanaConnection = new Connection(rpcLEnode);
getTokenAccounts(walletToQuery, solanaConnection);