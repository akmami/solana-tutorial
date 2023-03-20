// validators are responsible for security and integrity of the blockchain
const { Connection, clusterApiUrl } = require("@solana/web3.js");

const main = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "processed");
    const {current, delinquent} = await connection.getVoteAccounts(); // { active, not active }  validators
    console.log("all validators: " + current.concat(delinquent).length);
    console.log("current validators: " + current.length);
    console.log(current[0]); // get first validator info
};

const run_main = async() => {
    try {
        await main();
    } catch (error) {
        console.error(error);
    }
};

run_main();