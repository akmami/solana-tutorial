const { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, Authorized, Lockup, StakeProgram, sendAndConfirmTransaction, PublicKey } = require("@solana/web3.js");

const main = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "processed");
    const wallet = Keypair.generate();
    const airdropSigniture = await connection.requestAirdrop(
        wallet.publicKey,
        1 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSigniture);
    
    const stakeAccount = Keypair.generate()
    const minimumRent = await connection.getMinimumBalanceForRentExemption(StakeProgram.space);
    const amountUserWantsToStake = 0.5 * LAMPORTS_PER_SOL;
    const amountToStake = minimumRent + amountUserWantsToStake;
    const createStakeAccount = StakeProgram.createAccount({
        authorized: new Authorized(wallet.publicKey, wallet.publicKey), // 0: stake_authority, 1: withdraw_authority
        fromPubkey: wallet.publicKey,
        lamports: amountToStake,
        lockup: new Lockup(0, 0, wallet.publicKey), // 0: expire at 0, 1: epoch, 2: public_key
        stakePubkey: stakeAccount.publicKey
    });
    const createStateAccountTxId = await sendAndConfirmTransaction(connection, createStakeAccount, [wallet, stakeAccount]);
    console.log(`Stake account created, Tx Id: ${createStateAccountTxId}`);
    
    let stakeBalance = await connection.getBalance(stakeAccount.publicKey);
    console.log(`Stake account balance: ${stakeBalance / LAMPORTS_PER_SOL}`);

    let stakeStatus = await connection.getStakeActivation(stakeAccount.publicKey);
    console.log(`Stake account status: ${stakeStatus.state}`);

    const validators = await connection.getVoteAccounts();
    const selectedValidater = validators.current[0];
    const selectedValidaterPubkey = new PublicKey(selectedValidater.votePubkey);
    const delegateTx = StakeProgram.delegate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: wallet.publicKey,
        votePubkey: selectedValidaterPubkey,
    });

    const delegateTxId = await sendAndConfirmTransaction(connection, delegateTx, [wallet]);
    console.log(`Stake account delegated to ${selectedValidaterPubkey}. Tx id: ${delegateTxId}`);

    stakeStatus = await connection.getStakeActivation(stakeAccount.publicKey);
    console.log(`Stake account status: ${stakeStatus.state}`);

    const deactivateTx = StakeProgram.deactivate({stakePubkey: stakeAccount.publicKey, authorizedPubkey: wallet.publicKey});
    const deactivateTxId = await sendAndConfirmTransaction(connection, deactivateTx, [wallet]);
    console.log(`Stake account deactivated. Tx id: ${deactivateTxId}`)

    stakeStatus = await connection.getStakeActivation(stakeAccount.publicKey);
    console.log(`Stake account status: ${stakeStatus.state}`);

    let wallatBalance = await connection.getBalance(wallet.publicKey);
    console.log(`Wallet account balance before withdraw: ${wallatBalance / LAMPORTS_PER_SOL}`);
    stakeBalance = await connection.getBalance(stakeAccount.publicKey);
    console.log(`Stake account balance before withdraw: ${stakeBalance / LAMPORTS_PER_SOL}`);

    const withdrawTx = StakeProgram.withdraw({stakePubkey: stakeAccount.publicKey, authorizedPubkey: wallet.publicKey, toPubkey: wallet.publicKey, lamports: stakeBalance});
    const withdrawTxId = await sendAndConfirmTransaction(connection, withdrawTx, [wallet]); // signer is the wallet
    console.log(`Stake account withdrawn. Tx id: ${withdrawTxId}`);

    wallatBalance = await connection.getBalance(wallet.publicKey);
    console.log(`Wallet account balance after withdraw: ${wallatBalance / LAMPORTS_PER_SOL}`);
    stakeBalance = await connection.getBalance(stakeAccount.publicKey);
    console.log(`Stake account balance after withdraw: ${stakeBalance / LAMPORTS_PER_SOL}`);
};

const run_main = async() => {
    try {
        await main();
    } catch (error) {
        console.error(error);
    }
};

run_main();
