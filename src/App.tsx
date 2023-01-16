import React, { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import CounterABI from "./abi.json";
import styled from "styled-components";
import { Transaction } from "@ethereumjs/tx";
import { Chain, Common } from "@ethereumjs/common";
import { Buffer } from "buffer";

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
const InputWithLabel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 500px;
`;
// Address : 0x394662298bFC044771245B07027CdbaA391F052f

// Key : 0xabbaf5008e9323151e1b578205aed5477c7a1290fcabc6c62a006ea0ec4acfb4
const INFURA_URL =
  "https://goerli.infura.io/v3/e839e4099dba4eb189fab5aeade0dfea";
function App() {
  useEffect(() => {
    // @ts-ignore
    window.Buffer = Buffer;
  }, []);
  const [address, setAddress] = useState<string>("");
  const [pk, setPk] = useState<string>(
    "0xabbaf5008e9323151e1b578205aed5477c7a1290fcabc6c62a006ea0ec4acfb4"
  );
  const [balance, setBalance] = useState<string>("");
  const [contactAddress, setContractAddress] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [sendAddress, setSendAddress] = useState<string>("");
  const [toAddress, setToAddress] = useState<string>("");
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
    const abi: any = CounterABI;
    const contract = new web3.eth.Contract(abi, contactAddress);
    const count = await contract.methods.count().call();
    setCount(count);
  };
  const sendSignInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSendAddress(value);
  };
  const inputFromAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSendAddress(value);
  };
  const inputToAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setToAddress(value);
  };
  const sendSignClick = async () => {
    if (sendAddress === "") {
      alert("Blank");
      return false;
    }
    const { address } = web3.eth.accounts.privateKeyToAccount(pk.substring(2));
    const nonce = await web3.eth.getTransactionCount(address);
    const privateKey = Buffer.from(
      "abbaf5008e9323151e1b578205aed5477c7a1290fcabc6c62a006ea0ec4acfb4",
      "hex"
    );
    const txObj = {
      nonce,
      to: toAddress,
      gasLimit: 100000,
      gasPrice: 10000,
      value: web3.utils.toHex(0.1),
    };
    const common = new Common({
      chain: Chain.Goerli,
    });
    const tx = new Transaction(txObj, { common });
    const signedTx = tx.sign(privateKey);

    const txSerial = tx.serialize();
    const txSignedSerial = signedTx.serialize();
    console.log(txSerial);
    console.log(txSignedSerial);
    // await web3.eth.sendSignedTransaction("")
    // ;
    // const tx = {};
    // web3.eth.sendSignedTransaction("sss", tx);
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
        <button onClick={contractClick}>contract Input </button>
        {count}
        <HR />
        <H1>4. SendSignTransaction</H1>
        <InputWithLabel>
          From.Private Key
          <input
            name="contract"
            type={"text"}
            value={pk}
            onChange={inputChange}
          />
        </InputWithLabel>
        <InputWithLabel>
          To.Address
          <input
            name="contract"
            type={"text"}
            value={toAddress}
            onChange={inputToAddress}
          />
        </InputWithLabel>
        <InputWithLabel>
          Value
          <input
            name="contract"
            type={"text"}
            onChange={sendSignInput}
            value={sendAddress}
          />
        </InputWithLabel>
        <button onClick={sendSignClick}>contract Input </button>
      </header>
    </div>
  );
}

export default App;
