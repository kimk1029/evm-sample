import { Transaction } from "@ethereumjs/tx";
import { Chain, Common } from "@ethereumjs/common";
import web3, { getGasprice } from "../config/web3";
import CounterABI from "../../src/config/abi.json";
export const SendSignTransaction = async (
  address: string,
  pk: string,
  type: string
) => {
  const privateKey = Buffer.from(pk.substring(2), "hex");
  const abi: any = CounterABI;
  const contract = await new web3.eth.Contract(
    abi,
    "0x6d3a50670cD9992E127Aa4643ceFF644A7E75f1a"
  );

  const exData =
    type === "add"
      ? await contract.methods.add()
      : await contract.methods.minus();
  const data = exData.encodeABI();

  const estimateGas =
    type === "add"
      ? await contract.methods.add().estimateGas()
      : await contract.methods.minus().estimateGas();

  const nonce = await web3.eth.getTransactionCount(address);
  const gasObject = await getGasprice();
  const { fast, slow } = gasObject;

  const common = new Common({
    chain: Chain.Goerli,
  });

  const txObj = {
    nonce,
    to: "0x6d3a50670cD9992E127Aa4643ceFF644A7E75f1a",
    gasLimit: estimateGas,
    gasPrice: web3.utils.toHex(web3.utils.toWei(fast.toString(), "gwei")),
    data,
    value: 0,
  };
  const tx = new Transaction(txObj, { common });
  const signedTx = tx.sign(privateKey);
  const txSignedSerial = signedTx.serialize();
  web3.eth
    .sendSignedTransaction("0x" + txSignedSerial.toString("hex"))
    .on("receipt", (e) => console.log(e));
};
