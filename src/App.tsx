import React, { useState } from "react";
import "./App.css";
import Web3 from "web3";
// Address : 0x394662298bFC044771245B07027CdbaA391F052f

// Key : 0xabbaf5008e9323151e1b578205aed5477c7a1290fcabc6c62a006ea0ec4acfb4
const INFURA_URL =
  "https://goerli.infura.io/v3/e839e4099dba4eb189fab5aeade0dfea";
function App() {
  const [address, setAddress] = useState<string>("");
  const [pk, setPk] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const web3 = new Web3(INFURA_URL);

  const clickBtn = () => {
    const account = web3.eth.accounts.create();
    setAddress(account.address);
    setPk(account.privateKey);
  };
  const clickReset = () => {
    setAddress("");
    setPk("");
  };
  const clickPktoAccount = () => {
    const { address, privateKey } = web3.eth.accounts.privateKeyToAccount(
      pk.substring(2)
    );
    if (address) {
      setAddress(address);
    }
  };
  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPk(value);
  };
  const ClickBalanceOf = async () => {
    const balance = await web3.eth.getBalance(address);
    setBalance(balance);
  };
  return (
    <div className="App">
      <header className="App-header">
        {address && <p>Address : {address}</p>}
        {pk && <p>Key : {pk}</p>}
        <button onClick={clickBtn}>generate</button>
        <button onClick={clickReset}>reset</button>
        <hr />
        <input
          name={"pk"}
          type={"text"}
          placeholder={"Private Key"}
          onChange={inputChange}
        />
        <button onClick={clickPktoAccount}>Import Privatekey </button>
        {address && (
          <button onClick={ClickBalanceOf}>Balance ?{balance} </button>
        )}
      </header>
    </div>
  );
}

export default App;
