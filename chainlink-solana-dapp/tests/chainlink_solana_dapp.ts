import * as anchor from "@coral-xyz/anchor";

const CHAINLINK_FEED = "6PxBx93S8x3tno1TsFZwT5VqP8drrRCbCXygEXYNkFJe";
const CHAINLINK_PROGRAM_ID = "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";

describe("chainlink_solana_dapp", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.ChainlinkSolanaDapp;
  it('Queries BTC / USD Price Feed', async() => {
    const resultAccount = anchor.web3.Keypair.generate()
    await program.rpc.execute({
      accounts: {
        resultAccount: resultAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        chainlinkFeed: CHAINLINK_FEED,
        chainlinkProgram: CHAINLINK_PROGRAM_ID
      },
      signers: [resultAccount],
    });
    const latestPrice = await program.account.resultAccount.fetch(resultAccount.publicKey);
    console.log("Price is: " + latestPrice.value / 100000000);
  })
});
