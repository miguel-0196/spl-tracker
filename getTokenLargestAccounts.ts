import { getAccount } from "@solana/spl-token"
import { Connection, PublicKey } from "@solana/web3.js"
import { findOwnedNameAccountsForUser } from './getDomainName.js'

const tokenAddress  = 'EJPtJEDogxzDbvM8qvAsqYbLmPj5n1vQeqoAzj9Yfv3q'
const solanaConnection = new Connection('XXX')

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getAccountOwner = async(solanaConn: Connection, accountKey: PublicKey) => {
  const acc = await solanaConn.getParsedAccountInfo(accountKey)
  if (acc != null
    && acc.value != null) {
      const data = acc.value.data
      if ('parsed' in data && 'info' in data['parsed'])
        return data.parsed.info.owner

      return acc.value.owner.toString() + '_'
  }

  return ''
}

const getLargestAccounts = async(solanaConn: Connection, tokenAddr: string) => {
  const largestAccounts = await solanaConn.getTokenLargestAccounts(
    new PublicKey(tokenAddr)
  )

  for (const key in largestAccounts.value) {
    const tokenAccount = largestAccounts.value[key].address
    const acc = await solanaConn.getParsedAccountInfo(tokenAccount)
    await sleep(1000)
    const owner = await getAccountOwner(solanaConn, tokenAccount)
    await sleep(1000)
    const oowner = await getAccountOwner(solanaConn, new PublicKey(owner))
    const domain_names = await findOwnedNameAccountsForUser(solanaConn, new PublicKey(owner))
    console.log(`Token Account: ${tokenAccount}`)
    console.log(`Token Balance: ${largestAccounts.value[key].uiAmount}`)
    console.log(`Owner Info: ${owner}, ${oowner}, ${domain_names.length}`)
    console.log(`URL: https://solscan.io/account/${tokenAccount}`)
    console.log('')
  }
}

getLargestAccounts(solanaConnection, tokenAddress)