# Setup

## RPC Node

To query data on Solana, you'll need an API endpoint to connect with the network. You're welcome to use public nodes but they are too slow so I recomment to use Paid nodes, such as those provided by QuickNode.

[Sign up for free here.](https://www.quicknode.com/chains/sol)https://dashboard.quicknode.com/endpoints/new

Make sure to launch your node under the Solana Mainnet.

In your [Endpoint page](https://dashboard.quicknode.com/endpoints), copy "HTTP Provider" and paste it to the `.env` file.

## Typescript

1. Node.js

   If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/).

   Use the LTS (long time support) variant. If you want to check if node has been installed successfully, go open the cmd and type ```node -v```. If everything is ok, you should see something like v20.11.0


2. Typescript

   Run the following command in the cmd.

   ```
   npm install -g typescript
   ```

   This will install Typescript globally. In the same manner, if you want to check for Typescript being installed, type ```tsc -v``` in the cmd and you should get back something like Version 5.3.3.


   Then, install typescript execution engine.
   ```
   npm install -g ts-node
   ```

3. Navigate into the project directory and then install dependencies.
   ```
   npm install
   ```

4. Run the app:

   ```bash
   npm run main
   ```


# Usage:

1. Get Tokens Balance

   After running the app, input 1.
   ```
   1. Get Tokens Balance.
   ```


2. Get NFTs Balance

   After running the app, input 2.  
   ```
   2. Get NFTs Balance.
   ```

3. Get Tokens Transfer History

   After running the app, input 3.
   ```
   3. Get Tokens Transfer History.
   ```
