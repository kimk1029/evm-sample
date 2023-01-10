import React, { useState } from "react";
import "./App.css";
import Web3 from "web3";

const INFURA_URL =
  "https://goerli.infura.io/v3/e839e4099dba4eb189fab5aeade0dfea";
function App() {
  const [address, setAddress] = useState<string>("");
  const [pk, setPk] = useState<string>("");

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
  const ClickBalanceOf = () => {
    const contract = web3
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
        {address && <button onClick={ClickBalanceOf}>Balance ? </button>}
      </header>
    </div>
  );
}

export default App;
