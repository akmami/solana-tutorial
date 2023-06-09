# Solana NFT Drop Project (adapted from Buildspace)

Candy Machine JS CLI documentetion (here)[https://docs.metaplex.com/deprecated/candy-machine-js-cli/configuration]

## Setup

In order to run this application you need to install *git*, *node*, *yarn* and *ts-node*.

Then make sure you have required packages:

```brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

### Clone and Install the JS CLI Repo

You need to install Candy Machine (v2) CLI to communicate with metaplex and deploy NFTs.

Execute the following commands seperately.

```
git clone https://github.com/metaplex-foundation/deprecated-clis.git ~/deprecated-clis
cd ~/deprecated-clis
sudo yarn install
```

Make sure you have setup Candy machine correctly:

```
ts-node ~/deprecated-clis/src/candy-machine-v2-cli.ts --version
```

## Setting up a devnet wallet

```
solana-keygen new --outfile ~/.config/solana/devnet.json
solana config set --keypair ~/.config/solana/devnet.json
solana airdrop 2 --url devnet
```

Upload NTFs to devnet:

```
ts-node ~/deprecated-clis/src/candy-machine-v2-cli.ts upload \
    -e devnet \
    -k ~/.config/solana/devnet.json \
    -cp config.json \
    ./assets
```

You can varify by Solana Explorer (paste Public Key generated by Candy Machine).

Or you can run:

```
ts-node ~/deprecated-clis/src/candy-machine-v2-cli.ts verify_upload \
    -e devnet \
    -k ~/.config/solana/devnet.json \
    -c example
```

## Configuration

You need to create *config.json* file and insert the configurations there as follows with minimal structure.

```json
{
    "price": 1.0,
    "number": 10,
    "gatekeeper": null,
    "solTreasuryAccount": "<YOUR WALLET ADDRESS>",
    "splTokenAccount": null,
    "splToken": null,
    "goLiveDate": "25 Dec 2021 00:00:00 GMT",
    "endSettings": null,
    "whitelistMintSettings": null,
    "hiddenSettings": null,
    "storage": "arweave-sol",
    "ipfsInfuraProjectId": null,
    "ipfsInfuraSecret": null,
    "nftStorageKey": null,
    "awsS3Bucket": null,
    "noRetainAuthority": false,
    "noMutable": false
}
```

## Asset Metadata

```json
{
  "name": "Name_OF_NFT",
  "symbol": "Symbol_OF_NFT",
  "description": "Description",
  "seller_fee_basis_points": 500,
  "image": "Image_Name.png",
  "attributes": [
    {
      "trait_type": "Layer-1",
      "value": "0"
    },
  ],
  "properties": {
    "creators": [
      {
        "address": "INSERT_YOUR_WALLET_ADDRESS",
        "share": 100
      }
    ],
    "files": [
      {
        "uri": "Image_Name.png",
        "type": "image/png"
      }
    ]
  },
  "collection": {
    "name": "numbers",
    "family": "numbers"
  }
}
```

In order to verify assets run 

```
ts-node ~/deprecated-clis/src/candy-machine-v2-cli.ts verify_assets ./assets
```