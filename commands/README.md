## Useful commands

Detailed explainations for all codes can be found in official website [Token Program](https://spl.solana.com/token)

Create wallet

```
solana-keygen new
```

In order to see public key of your solana wallet

```
solana-keygen pubkey
```

Check your balance of devnet 

```
solana balance --url devnet
```

You can verify it with [Solana Explorer](https://explorer.solana.com/)

Airdrop 2 solana in devnet

```
solana airdrop 2 [pubkey] --url devnet
```

Create token in devnet

```
spl-token create-token --url devnet
```

Wallet can have multiple accounts and each account can hold specific token. In order to create account

```
spl-token create-account [token-address] --url devnet
```

token-address is the alphanumeric value which is being given after creation of token. Empty token account address is given after creating account.

In order to supply newly created token:
```
spl-token supply [token-address] --url devnet
```

In order to check the balance of the account:
```
spl-token balance [token-address] --url devnet
```

In order to mint token into account:
```
spl-token mint [token-address] [amount] --url devnet
spl-token supply [token-address] --url devnet
```

In order to check circulating amount of tokens:
```
spl-token mint [token-address] [amount] --url devnet
spl-token supply [token-address] --url devnet
```

In order to prevent more token minting
```
spl-token authorize [token-address] mint --disable --url devnet
```
This action can be done only once and after executing this, Solana network will not allow anyone to mint anymore.

In order to brun (only your) token:
```
spl-token burn [token-account-address] [amount] --url devnet
```

In order to transfer token to another account in devnet:
```
spl-token transfer [token-address] [amount] [receiver-token-address] --allow-unfunded-recipient --fund-recipient
```