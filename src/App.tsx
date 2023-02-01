import React, { useEffect, useState } from "react";
import "./App.css";
import CounterABI from "../src/config/abi.json";
import ERC20ABI from "../src/config/erc20contract.json";
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
  font-size: 45px;
  text-decoration: underline;
  font-weight: bold;
  text-shadow: 5px 5px #585858;
`;
const TitleSpan = styled.span`
  font-size: 36px;
  opacity: 0.7;
  text-transform: capitalize;
  display: block;
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
    erc20: {
      balanceOf: "",
      decimals: "",
      name: "",
      symbol: "",
      totalSupply: "",
    },
  };
  const [info, setInfo] = useState({ ...INITIAL_STATE });

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
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
          value={info.pk}
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
        <HR />
        <H1>5. ERC20 Contract</H1>
        <div style={{ color: "grey", fontSize: "16px" }}>
          규현: 0x8ed317703Cf0CC7CC4AD3FC41025eDcaE25a9560
          <br /> 소은: 0x563023174BF4bDc63007043eaE0f1d1Afd9Ae373
        </div>
        <InputWithLabel>
          Contract Addr.
          <input
            name="contactAddress"
            type={"text"}
            onChange={inputChange}
            value={info.contactAddress}
          />
        </InputWithLabel>
        <InputWithLabel>
          Address
          <input
            name="address"
            type={"text"}
            onChange={inputChange}
            value={info.address}
          />
        </InputWithLabel>
        <button
          onClick={async () => {
            const abi: any = ERC20ABI;
            const contract = new web3.eth.Contract(abi, info.contactAddress);
            const balanceOf = await contract.methods
              .balanceOf("0x9BD4C525eC074CbC6A4906Bb1Bd47E5BE3AFEa79")
              .call();
            const decimals = await contract.methods.decimals().call();
            const name = await contract.methods.name().call();
            const symbol = await contract.methods.symbol().call();
            const totalSupply = await contract.methods.totalSupply().call();
            const result = {
              balanceOf,
              decimals,
              name,
              symbol,
              totalSupply,
            };
            setInfo({
              ...info,
              erc20: result,
            });
          }}
        >
          contract Input
        </button>
        <button
          onClick={async () => {
            const abi: any = ERC20ABI;
            const contract = new web3.eth.Contract(abi, info.contactAddress);
            const data = await contract.methods
              .transfer(info.address, 9999999)
              .encodeABI();
            console.log("---");
            const estimateGas = await contract.methods
              .transfer(info.address, 9999999)
              .estimateGas({ from: info.address });
            console.log(estimateGas);
            const gasObject = await getGasprice();
            const { fast, slow } = gasObject;
            const nonce = await web3.eth.getTransactionCount(info.address);
            const txObj = {
              nonce,
              data,
              to: info.contactAddress,
              gasLimit: estimateGas,
              gasPrice: web3.utils.toHex(
                web3.utils.toWei(fast.toString(), "gwei")
              ),
            };
            const common = new Common({
              chain: Chain.Goerli,
            });
            const tx = new Transaction(txObj, { common });
            const privateKey = Buffer.from(info.pk.substring(2), "hex");
            const signedTx = tx.sign(privateKey);
            const txSignedSerial = signedTx.serialize();
            web3.eth
              .sendSignedTransaction("0x" + txSignedSerial.toString("hex"))
              .on("receipt", (e) => console.log(e));
          }}
        >
          push input
        </button>
        <button
          onClick={async () => {
            const abi: any = ERC20ABI;
            const contract = new web3.eth.Contract(abi, info.contactAddress);
            const data = await contract.methods
              .transfer(info.address, 9)
              .send();
          }}
        >
          push input
        </button>
        <div
          style={{
            textAlign: "left",
            border: "1px solid white",
            padding: "20px",
            margin: "20px",
          }}
        >
          <TitleSpan>balanceOf</TitleSpan> : {info.erc20.balanceOf}
          <TitleSpan>decimals</TitleSpan> : {info.erc20.decimals}
          <TitleSpan>name</TitleSpan> : {info.erc20.name}
          <TitleSpan>symbol</TitleSpan> : {info.erc20.symbol}
          <TitleSpan>totalSupply</TitleSpan> : {info.erc20.totalSupply}
        </div>
      </header>
    </div>
  );
}

export default App;
