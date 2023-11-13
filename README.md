<h2 align="center">
  <a href="" target="blank_">
    <img src="./doc/image/logo.svg" alt="Logo" height="75">
  </a>
  <br>
  Order Book Swap Prototype
</h2>

# Overview

The **Order Book Token Swap Prototype** aims to create a decentralized platform where users can list tokens for swap, specifying the desired amount and type of other tokens in return. Interested parties from around the globe can accept these offers, leading to a finalized token swap.

This Order Book Token Swap was built using mainstream Web Technologies & Frameworks (Typescript & React) on top of the Marlowe Web DApp Stack:

- [Marlowe TypeScript SDK (TS-SDK)](https://github.com/input-output-hk/marlowe-ts-sdk/): a suite of TypeScript/JavaScript libraries for developing Web-DApp in the Cardano Blockchain using Marlowe Technologies.

## Deployed Instance

We invite you to test [a deployed instance of the Order Book Token Swap Prototype](https://token-swap-prototype-franzavalla.vercel.app/) for yourself.

# How To Run Locally

To get the DApp up and running on your local machine, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/input-output-hk/marlowe-order-book-swap
   cd marlowe-order-book-swap
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure variables in .env.example**

   To ensure that the dApp works correctly, you need to set the appropriate URLs in the `.env` file.

   ### Steps

   1. **Open the .env.example File**:
      Navigate to the root directory of your project and open the `.env.example` file in your preferred text editor.

   2. **Set the Blockfrost Project ID**:
      Locate the line `NEXT_PUBLIC_BLOCKFROST_PROJECT_ID="<Your-Project-ID>"`. Replace `<Your-Project-ID>` with your Project ID from Blockfrost.

      MARLOWE_RUNTIME_WEB_URL=preprod123test321

4. **Rename the .env.example file**

   Since the `.env` file is gitignored, you need to rename the name of the file to `.env`.

5. **Run the DApp**
   ```bash
   npm run dev
   ```

Enjoy and stay tuned for our next releases!
