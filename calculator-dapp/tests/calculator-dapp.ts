// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { CalculatorDapp } from "../target/types/calculator_dapp";

// describe("calculator-dapp", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.CalculatorDapp as Program<CalculatorDapp>;

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });

const assert = require("assert");
const anchor = require("@coral-xyz/anchor");
const {SystemProgram} = anchor.web3

import { Program } from "@project-serum/anchor";
import { CalculatorDapp } from "../target/types/calculator_dapp";

describe("calculator-dapp", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider)
    const calculator = anchor.web3.Keypair.generate();
    const program = anchor.workspace.CalculatorDapp as Program<CalculatorDapp>;
    
    it('Creates a calculator', async() => {
        await program.rpc.create("Welcome to Solana", {
            accounts: {
                calculator: calculator.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId
            },
            signers: [calculator]
        });
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.greeting === "Welcome to Solana")
    });

    it('Adds two numbers', async() => {
        await program.rpc.add(new anchor.BN(2), new anchor.BN(4), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(6)))
    });

    it('Subtract two numbers', async() => {
        await program.rpc.subtract(new anchor.BN(2), new anchor.BN(4), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(-2)))
    });

    it('Multiply two numbers', async() => {
        await program.rpc.multiply(new anchor.BN(2), new anchor.BN(4), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(8)))
    });

    it('Divide two numbers', async() => {
        await program.rpc.divide(new anchor.BN(2), new anchor.BN(4), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(0)) & account.remainder.eq(new anchor.BN(2)))
    });
});