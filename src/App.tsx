import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";
import { BlockHeader, Block } from "web3-eth";

function App() {
  const [address, setAddress] = useState<string>("");
  const [pk, setPk] = useState<string>("");
  const web3 = new Web3(Web3.givenProvider);
  const clickBtn = () => {
    const account = web3.eth.accounts.create();
    setAddress(account.address);
    setPk(account.privateKey);
    console.log(Web3.givenProvider);
  };
  const clickReset = () => {
    setAddress("");
    setPk("");
  };
  return (
    <div className="App">
      <header className="App-header">
        {address && <p>Address : {address}</p>}
        {pk && <p>Key : {pk}</p>}
        <button onClick={clickBtn}>generate</button>
        <button onClick={clickReset}>reset</button>
      </header>
    </div>
  );
}

export default App;
