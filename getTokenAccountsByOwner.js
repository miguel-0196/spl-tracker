// Getting address of a token account given a Solana wallet address
const web3 = require('@solana/web3.js');

(async () => {
  const solana = new web3.Connection("https://api.mainnet-beta.solana.com");

//the public solana address
  const accountPublicKey = new web3.PublicKey(
    "2B1Uy1UTnsaN1rBNJLrvk8rzTf5V187wkhouWJSApvGT"
  );

//mintAccount = the token mint address
  const mintAccount = new web3.PublicKey(
    "GLmaRDRmYd4u3YLfnj9eq1mrwxa1YfSweZYYZXZLTRdK"
  );
  const account = await solana.getTokenAccountsByOwner(accountPublicKey, {
      mint: mintAccount});

      console.log('First:', account.value[0].pubkey.toString());

})();