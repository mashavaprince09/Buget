/*import { BrowserProvider, Contract, ethers, parseEther } from "ethers";

const CUSD_ADDRESS = "0x609E153E2642C007006e0A59973d6b6f981afBBA";
export const transferCUSD = async (address: string, userAddress: string) => {
  if (window.ethereum) {
    // Get connected accounts, if not connected request connnection.
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(userAddress);

    // The current selected account out of the connected accounts.

    let abi = ["function transfer(address to, uint256 value)"];
    const CUSDContract = new Contract(CUSD_ADDRESS, abi, signer);
    let txn = await CUSDContract.transfer(address, parseEther("0.1"));
    let receipt = await txn.wait();
  }
};

declare global {
  interface Window {
    ethereum: any;
  }
}*/