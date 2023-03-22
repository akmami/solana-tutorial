# Chainlink Solana DAPP

This program retireves real time data with chainlink.

The price of BTC / USD is being displayed in test case.

The build and test are pretty much same as previous dapps, so, I will not got in detail

```
solana-keygen new -o id.json --force
solana airdrop 2 --url devnet [wallet-address] # newly created
anchor build
anchor test --skip-local-validator
```

Make sure on another tab, the following commands is being executed
```
solana-test-validator
```