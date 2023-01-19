import Web3 from "web3";

const INFURA_URL =
  "https://goerli.infura.io/v3/e839e4099dba4eb189fab5aeade0dfea";
const web3 = new Web3(INFURA_URL);
export const getGasprice = async () => {
  const response = await (
    await fetch("https://ethgasstation.info/api/ethgasAPI.json")
  ).json();
  return { fast: response.fast, slow: response.slow };
};
export default web3;
