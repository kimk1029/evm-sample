import React, { useState } from "react";
import "./App.css";
import Web3 from "web3";
import CounterABI from "./abi.json";
import styled from "styled-components";
const HR = styled.hr`
  width: 80%;
  display: block;
  margin: 50px;
  opacity: 0.1;
`;
const H1 = styled.h1`
  font-size: 42px;
  text-decoration: underline;
`;
// Address : 0x394662298bFC044771245B07027CdbaA391F052f

// Key : 0xabbaf5008e9323151e1b578205aed5477c7a1290fcabc6c62a006ea0ec4acfb4
const INFURA_URL =
  "https://goerli.infura.io/v3/e839e4099dba4eb189fab5aeade0dfea";
function App() {
  const [address, setAddress] = useState<string>("");
  const [pk, setPk] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [contactAddress, setContractAddress] = useState<string>("");
  const [count, setCount] = useState<number>(0);
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
  const inputContract = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setContractAddress(value);
  };
  const contractClick = async () => {
    console.log(contactAddress);
    const contract = new web3.eth.Contract(
      [
        {
          inputs: [],
          name: "add",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "minus",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "startCount",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "count",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      contactAddress
    );
    const count = await contract.methods.count().call();
    setCount(count);
  };
  return (
    <div className="App">
      <header className="App-header">
        <H1>1. Generate Address , PK Key</H1>
        {address && <p>Address : {address}</p>}
        {pk && <p>Key : {pk}</p>}
        <button onClick={clickBtn}>generate</button>
        <button onClick={clickReset}>reset</button>
        <HR />
        <H1>2. Import Private Key</H1>
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
        <HR />
        <H1>3. Import Contract to count</H1>
        Contract Address ={" "}
        <input
          name="contract"
          type={"text"}
          onChange={inputContract}
          value={contactAddress}
        />
        <button onClick={contractClick}>contact Input </button>
        {count}
      </header>
    </div>
  );
}

export default App;
