import React, { useState } from "react";
import { formatUnits } from "ethers";
import { useNavigate } from "react-router-dom";

const WalletCard = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet connected");
          getAccountBalance(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  const disconnectWalletHandler = () => {
    setDefaultAccount(null);
    setUserBalance(null);
    setErrorMessage(null);
    navigate("/");
    console.log("Wallet disconnected");
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setUserBalance(formatUnits(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  return (
    <div>
      <div className="flex p-10 justify-center text-center bg-slate-100 min-h-screen">
        <div className="flex flex-col gap-5">
          <h4> {"Connection to MetaMask using window.ethereum methods"} </h4>
          <div className="flex justify-center">
            <button
              className="bg-blue-950 text-white rounded-lg h-10 w-1/2 justify-center"
              onClick={connectWalletHandler}
            >
              {connButtonText}
            </button>
          </div>
          <div className="text-lg">
            <h3>
              <b>Address: </b> {defaultAccount}
            </h3>
          </div>
          <div className="balanceDisplay">
            <h3>
              <b>Balance: </b>
              {userBalance}
            </h3>
          </div>
          {errorMessage}
          <div className="flex justify-center">
            {defaultAccount ? (<button
              className="bg-red-300 text-black rounded-lg h-10 w-1/2 justify-center"
              onClick={disconnectWalletHandler}
            >
              Disconnect Wallet
            </button>) : (
                <></>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
