# Crowdfunding

This dapp is deployed in devnet can can be found [here](https://explorer.solana.com/address/7EpjcPETt3UfaDcze1YDhr7WRPxqUdvC4MhXSeoHmZDU?cluster=devnet). 

The Program Id: 7EpjcPETt3UfaDcze1YDhr7WRPxqUdvC4MhXSeoHmZDU

## Deployment instructions

In Anchor.toml file, cluster is changed to *devnet* and wallet is set to ./id.json

The id.json file is generated after executing:

```
solana-keygen new -o id.json
```

Make sure you have enough Sol since the deployment requires Sol. If you don't have Sol, you can airdrop to yourself (at least 4 is required).

Build your program
```
anchor build
```

The commmand above should have generated Program Id which can be found out by executing:
```
solana address -k ./target/deploy/crowdfunding-keypair.json
```

Copy the address and pase it into declare_id in libr.rs

Lastly, run the following command to deploy your program
``` 
anchor deploy
```

Congatulations. You can find your program in Solana Explorer in devnet network by calling it with given program id.