const {
    Connection,
    PublicKey,
    cluserApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    clusterApiUrl
} = require('@solana/web3.js')

const wallet = new Keypair()

const publicKey = new PublicKey(wallet._keypair.publicKey)
const secretKey = wallet._keypair.secretKey

// console.log(publicKey)
// console.log(secretKey)

const getWalletBalance = async() => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed') // 'devne' is env smt like payground for developers
        const walletBalance = await connection.getBalance(publicKey)
        console.log(`Wallet balance is ${walletBalance}`)
    } catch(err) {
        console.error(err)
    }
}
const airDropSol = async() => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        const fromAirFropSigniture = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL) 
        // request 2 solana to publicKey
        // There are 1-billion lamports in one SOL
        
        // Old Code
        // await connection.confirmTransaction(fromAirFropSigniture)
        
        // New Code
        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: fromAirFropSigniture,
        });
    } catch(err) {
        console.error(err)
    }
}
const main = async() => {
    await getWalletBalance()
    await airDropSol()
    await getWalletBalance()
}

main()