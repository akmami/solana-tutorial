import React, { useEffect, useState } from 'react';
import './App.css';
import idl from './idl.json';
import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import { Program, AnchorProvider, web3, utils, BN } from '@project-serum/anchor';
import { Buffer } from 'buffer';

const programID = idl.metadata.address;
const network = clusterApiUrl('devnet');
const opts = {
  preflightCommitment: "processed" // finalized is another alternative
};
const { SystemProgram } = web3;
window.Buffer = Buffer;

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  
  // created provider = authenticated connection to solana
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment);
    return provider;
  };

  const isWalletConnected = async() => {
    try {
      const {solana} = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom is connected");
          const response = await solana.connect({onlyIfTrusted: true});
          console.log("Conntected with public key: ", response.publicKey.toString());
          setWalletAddress(response.publicKey.toString());
        } else {
          console.log("Solana is detected but Phantom wallet is not active.")
        }
      } else {
        console.log("Solana object is not found. Please connect Phantom wallet!");
      }
    } catch (error) {
      console.error( error);
    }
  };

  const connectWallet = async() => {
    const {solana} = window;
    if (solana) {
      const response = await solana.connect();
      console.log("Conntected with public key: ", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const createCampaign = async() => {
    console.log("createCampaign")
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const [campaign] = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("CAMPAIGN_DEMO"),
          provider.wallet.publicKey.toBuffer()
        ],
        program.programId
      );
      await program.rpc.create('campaign name', 'campaign description', {
        accounts: {
          campaign,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId
        }
      });
      console.log("Created new campaign with: ", campaign.toString());
    } catch (error) {
      console.error("Error encountered while creating campaign", error);
    }
  };

  const getCampaigns = async() => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    
    Promise.all(
      (await connection.getProgramAccounts(program.programId)).map(
          async (campaign) => ({
            ...(await program.account.campaign.fetch(campaign.pubkey)),
            pubkey: campaign.pubkey,
          })
        )
    ).then(campaigns => setCampaigns(campaigns));
  };

  const donate = async (publicKey) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.donate(
        new BN(0.2 * web3.LAMPORTS_PER_SOL),
        {
          accounts: {
            campaign: publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
        }
      );
      console.log("donated some money to: ", publicKey.toString());
      getCampaigns();
    } catch (error) {
      console.error(error);
    }
  };

  const withdraw = async publicKey => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.withdraw(
        new BN(0.2 * web3.LAMPORTS_PER_SOL),
        {
          accounts: {
            campaign: publicKey,
            user: provider.wallet.publicKey,
          },
        }
      );
      
      console.log("withdrawed some money from: ", publicKey.toString());
      getCampaigns();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const onLoad = async () => {
      await isWalletConnected();
    };
    onLoad();
  }, []);

  return (
    <div className="App">
      {!walletAddress && (<button onClick={connectWallet}>Connect to Wallet</button>)}
      {walletAddress && (
        <>
          <button onClick={createCampaign}>Create Campaign</button>
          <button onClick={getCampaigns}>Get a list of campaigns</button>
          <br />
          {campaigns.map(campaign => (
            <> 
              <p>Campaign ID: {campaign.pubkey.toString()}</p>
              <p>Total Donated Money: {(campaign.amountDonated / web3.LAMPORTS_PER_SOL).toString()}</p>
              <p>{campaign.name}</p>
              <p>{campaign.description}</p>
              <button onClick={() => donate(campaign.pubkey)}>
                Click to Donate 0.2 SOL
              </button>
              <button onClick={() => withdraw(campaign.pubkey)}>
                Withdraw 0.2 SOL
              </button>
            </>
          ))}
        </>
        )}
    </div>
  );
};

export default App;


