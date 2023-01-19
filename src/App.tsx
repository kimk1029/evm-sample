import React, { useEffect, useState } from "react";
import "./App.css";
import CounterABI from "../src/config/abi.json";
import styled from "styled-components";
import { Transaction } from "@ethereumjs/tx";
import { Chain, Common } from "@ethereumjs/common";
import web3, { getGasprice } from "./config/web3";
import { SendSignTransaction } from "./page/SendSignTransaction";

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
//0xaa8e7bb85e5abec0a0567ced64a54080430b95445d547055d8cd87c4b3e4afab
function App() {
  const INITIAL_STATE = {
    address: "",
    pk: "0xaa8e7bb85e5abec0a0567ced64a54080430b95445d547055d8cd87c4b3e4afab",
    balance: "",
    contactAddress: "",
    count: "",
    sendBalance: "",
    toAddress: "0x9F5230608353116ef5d1941C4803e4516A54e23C",
  };
  const [info, setInfo] = useState({ ...INITIAL_STATE });

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    console.log(value);
    console.log(name);
    setInfo({
      ...info,
      [name]: value,
    });
  };

  const clickBtn = () => {
    const account = web3.eth.accounts.create();
    setInfo({
      ...info,
      address: account.address,
      pk: account.privateKey,
    });
  };
  const clickReset = () => {
    setInfo(INITIAL_STATE);
  };
  const clickPktoAccount = () => {
    const { address } = web3.eth.accounts.privateKeyToAccount(
      info.pk.substring(2)
    );
    if (address) {
      setInfo({
        ...info,
        address,
      });
    }
  };
  const ClickBalanceOf = async () => {
    const balance = await web3.eth.getBalance(info.address);
    setInfo({
      ...info,
      balance: balance,
    });
  };
  const contractClick = async () => {
    const abi: any = CounterABI;
    const contract = new web3.eth.Contract(abi, info.contactAddress);
    const count = await contract.methods.count().call();
    setInfo({
      ...info,
      count,
    });
  };
  const sendSignClick = async () => {
    if (info.sendBalance === "") {
      alert("수량을 입력하세요");
      return false;
    }
    const { address } = web3.eth.accounts.privateKeyToAccount(
      info.pk.substring(2)
    );
    const nonce = await web3.eth.getTransactionCount(address);
    const privateKey = Buffer.from(info.pk.substring(2), "hex");
    const gasObject = await getGasprice();
    const { fast, slow } = gasObject;

    const txObj = {
      nonce,
      to: info.toAddress,
      gasLimit: web3.utils.toHex("21000"),
      gasPrice: web3.utils.toHex(web3.utils.toWei(fast.toString(), "gwei")),
      value: web3.utils.toHex(1),
    };
    console.log(web3.utils.toWei(fast.toString(), "gwei"));
    console.log(txObj);
    const common = new Common({
      chain: Chain.Goerli,
    });
    const tx = new Transaction(txObj, { common });
    const signedTx = tx.sign(privateKey);

    //const txSerial = tx.serialize();
    const txSignedSerial = signedTx.serialize();
    web3.eth
      .sendSignedTransaction("0x" + txSignedSerial.toString("hex"))
      .on("receipt", (e) => console.log(e));
  };
  const contractPlusClick = async (type: string) => {
    SendSignTransaction(info.address, info.pk, type);
  };
  return (
    <div className="App">
      <header className="App-header">
        <H1>1. Generate Address , PK Key</H1>
        {info.address && <p>Address : {info.address}</p>}
        {info.pk && <p>Key : {info.pk}</p>}
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
        {info.address && (
          <button onClick={ClickBalanceOf}>Balance ?{info.balance} </button>
        )}
        <HR />
        <H1>3. Import Contract to count</H1>
        Contract Address ={" "}
        <input
          name="contactAddress"
          type={"text"}
          onChange={inputChange}
          value={info.contactAddress}
        />
        <button onClick={contractClick}>contract Input </button>
        {info.count}
        <H1>3-1. Contract to Plus & minus</H1>
        <button onClick={() => contractPlusClick("add")}>
          ADD Transaction{" "}
        </button>
        <button onClick={() => contractPlusClick("minus")}>
          MINUS Transaction{" "}
        </button>
        <HR />
        <H1>4. SendSignTransaction</H1>
        <InputWithLabel>
          From.Private Key
          <input
            name="pk"
            type={"text"}
            value={info.pk}
            onChange={inputChange}
          />
        </InputWithLabel>
        <InputWithLabel>
          To.Address
          <input
            name="toAddress"
            type={"text"}
            value={info.toAddress}
            onChange={inputChange}
          />
        </InputWithLabel>
        <InputWithLabel>
          Value
          <input
            name="sendBalance"
            type={"text"}
            onChange={inputChange}
            value={info.sendBalance}
          />
        </InputWithLabel>
        <button onClick={sendSignClick}>contract Input </button>
      </header>
    </div>
  );
}

export default App;
