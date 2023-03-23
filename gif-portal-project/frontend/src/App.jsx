import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import React, {useEffect, useState} from "react";
import {Buffer} from "buffer";
import "./App.css";
import idl from "./idl.json";
import kp from "./keypair.json";

// Constants
const { SystemProgram, Keypair} = web3;
window.Buffer = Buffer;

const key_pair_arr = Object.values(kp._keypair.secretKey);
const secret_key = new Uint8Array(key_pair_arr);
const baseAccount = web3.Keypair.fromSecretKey(secret_key);

const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");

const opts = {
  preflightCommitment: "processed"
};

const App = () => {

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(connection, window.solana, opts.preflightCommitment);
    return provider
  };

  const checkWallet = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom Wallet found!");

          const response = await solana.connect({ onlyIfTrusted: true });

          console.log("Connected with publicKey: " + response.publicKey.toString());
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Please install wallet!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (window) {
      const response = await solana.connect();
      console.log("Connected with publicKey: " + response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const onInputChange = event => {
    const {value} = event.target;
    setInputValue(value)
  };

  const createGifAccount = async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId
        },
        signers: [baseAccount]
      });
      console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString());
      await getGifList();
    } catch (error) {
      console.log("Error creating BaseAccount account:", error);
    }
  };

  const getGifList = async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

      console.log("Got the account", account);
      setGifList(account.gifList);
    } catch (error) {
      console.error("Error in getGifList:", error);
      setGifList(null);
    }
  };

  const sendGif = async() => {
    if (inputValue.length > 0) {
      console.log("Gif link:", inputValue);
      try {
        const provider = getProvider();
        const program = new Program(idl, programID, provider);
        await program.rpc.addGif(inputValue, {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey
          }
        });
        console.log("GIF successfully sent to program", inputValue);
        await getGifList();
        setInputValue("");
      } catch (error) {
        console.error(error);
      }
      
    } else {
      console.log("Empty input. Try again.");
    }
  };

  const renderNotConnectedWalletContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>Connect Wallet</button>
  );

  const renderConnectedWalletContainer = () => {
    if (gifList === null) {
      return <div className="connected-container">
        <button className="cta-button submit-gif-button" onClick={createGifAccount}>
          Do One-Time Initialization for GIF Program Account
        </button>
      </div>
    } else {
      return (
        <div className="connected-container">
          <form
            onSubmit={event => {
              event.preventDefault()
              sendGif()
            }}>
            <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={onInputChange} />
            <button type="submit" className="cta-button submit-gif-button">Submit</button>
          </form>
          <div className="gif-grid">
            {gifList.map((item, index) => (
              <div className="gif-item" key={index}>
                <img src={item.gifLink} alt={item.gifLink} />
              </div>
            ))}
          </div>
        </div>
      )
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkWallet();
    }
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if(walletAddress) {
      console.log("Fetching GIF list...");
      getGifList();
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedWalletContainer()}
          {walletAddress && renderConnectedWalletContainer()}
        </div>
      </div>
    </div>
  );
};

export default App;
