const { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, Authorized, Lockup, StakeProgram, sendAndConfirmTransaction, PublicKey } = require("@solana/web3.js");

const main = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "processed");
    const STAKE_PROGRAM_ID = new PublicKey("Stake11111111111111111111111111111111111111");
    const VOTE_PUB_KEY = "F95vVhuyAjAtmXbg2EnNVWKkD5yQsDS5S83Uw1TUDcZm"; // run delegate_stake.js and get delegated id

    const accounts = await connection.getParsedProgramAccounts(STAKE_PROGRAM_ID, 
        [ // filters
            {dataSize: 200},
            {memcmp: {offset: 200, bytes: VOTE_PUB_KEY}}
        ]
    );

    console.log(`Total number of delegaters found for ${VOTE_PUB_KEY} is: ${accounts.length}`);

    if (accounts.length > 0) {
        console.log(`Sample delegator: ${JSON.stringify(accounts[0])}`);
    }
};

const run_main = async() => {
    try {
        await main();
    } catch (error) {
        console.error(error);
    }
};

run_main();