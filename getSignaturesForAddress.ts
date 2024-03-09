// How to filter getSignaturesForAddress by token transfer
import * as web3 from '@solana/web3.js';

const walletAddress = 'BRwv49yzZXL5W2dS69KKT9W4t44JmutVhQBb6tFNgWdK';
const solanaConnection = new web3.Connection('XXX');

const getTransactions = async(address: string) => {
  const pubKey = new web3.PublicKey(address);
  let transactionList = await solanaConnection.getSignaturesForAddress(pubKey, { limit: 10 });
  let signatureList = transactionList.map(transaction=>transaction.signature);
  console.log(signatureList);
  for await (const sig of signatureList) {
    console.log(await solanaConnection.getParsedTransaction(sig));
  }
}

getTransactions(walletAddress);