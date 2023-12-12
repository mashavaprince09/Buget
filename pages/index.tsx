//US
import { BrowserProvider } from 'ethers';
//const provider = new ethers.BrowserProvider(window.ethereum)
import { Contract} from "ethers";
//import { JsonRpcProvider } from 'ethers';
import Button from "@/components/common/Button";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { parseEther } from 'viem';
import Link from 'next/link';
declare global {
  interface Window {
    ethereum: any;
  }
}

const CUSD_ADDRESS = "0x609E153E2642C007006e0A59973d6b6f981afBBA";
const VENDOR_ID = "0x669680cdedfdb4f64d7458e1ea36cdd492345fa0"; // Constant for vendor's wallet ID

export default function Home() {
  const { address, isConnected } = useAccount();

  const [loading, setLoading] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAmountField, setShowAmountField] = useState(false);
  const [lockAmount, setLockAmount] = useState<number | null>(null);

  // Initialize state variables to zero
  const [groceriesAmount, setGroceriesAmount] = useState<number | null>(0);
  const [rentAmount, setRentAmount] = useState<number | null>(0);
  const [transportAmount, setTransportAmount] = useState<number | null>(0);

  // State variables to track pop-ups
  const [showBalancePopup, setShowBalancePopup] = useState(false);
  const [showTransactPopup, setShowTransactPopup] = useState(false);
  const [showVendorPopup, setShowVendorPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showInsufficientPopup, setShowInsufficientPopup] = useState(false);
  const [showVendorNotAffiliatedPopup, setShowVendorNotAffiliatedPopup] = useState(false);

  // State variables for vendor and payment amount
  const [vendorWalletID, setVendorWalletID] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<number | number>(0);

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);
  
// Transfer function//
const transferCUSD = async (address: string, userAddress: string) => {
  if (window.ethereum) {
    // Get connected accounts, if not connected request connnection.
    //const localNodeUrl = 'http://127.0.0.1:4040'; // Replace with your local node's URL
    //const provider = new JsonRpcProvider(localNodeUrl);
    const provider = new BrowserProvider(window.ethereum);
    const signer = provider.getSigner(userAddress);

    // The current selected account out of the connected accounts.

    let abi = ["function transfer(address to, uint256 value)"];
    const CUSDContract = new Contract(CUSD_ADDRESS, abi, signer);
    let txn = await CUSDContract.transfer(address, parseEther(`1`));
    let receipt = await txn.wait();
  }
};

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(false);
    setShowAmountField(true);
    setShowBalancePopup(false); // Hide Balance pop-up when an option is selected
    setShowTransactPopup(false); // Close Transact pop-up when an option is selected
    setShowVendorPopup(false); // Close Vendor pop-up when an option is selected
    setShowErrorPopup(false); // Hide error pop-up when an option is selected
    setShowInsufficientPopup(false);
    setShowVendorNotAffiliatedPopup(false); // Hide "vendor not affiliated" pop-up when an option is selected
  };

  const handleLockAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(event.target.value);
    setLockAmount(isNaN(amount) ? null : amount);
  };

  const handleCancelClick = () => {
    setShowAmountField(false);
    setLockAmount(null);
  };
  const handleSubmitLockClick = () => {
    // You can add any additional logic specific to "Budget Lock" submission here
    console.log(`Lock Amount: ${lockAmount}`);
    setShowAmountField(false);
    setLockAmount(null);
  };

  const handleSubmitClick = async () => {
    if (vendorWalletID.trim() === "" || paymentAmount === null) {
      // Check for missing fields
      setShowErrorPopup(true);
      return;
    }

    setShowErrorPopup(false);

    // Check if the entered vendor's wallet ID is NOT the same as the constant ID
    if (vendorWalletID !== VENDOR_ID) {
      setShowVendorNotAffiliatedPopup(true); // Show "vendor not affiliated with wallet" pop-up
      return;
    }

    // Check if the user has enough funds in the corresponding variable from budget lock
    let availableFunds = 0;

    switch (selectedOption) {
      case "Groceries":
        availableFunds = groceriesAmount || 0;
        break;
      case "Rent":
        availableFunds = rentAmount || 0;
        break;
      case "Transport":
        availableFunds = transportAmount || 0;
        break;
      default:
        break;
    }

    if (availableFunds < paymentAmount) {
      // Show a pop-up message indicating insufficient funds
      setShowInsufficientPopup(true);
      return;
    }
    // Add your logic to handle the submission of vendor and payment amount
    console.log(`Vendor Wallet ID: ${vendorWalletID}, Payment Amount: ${paymentAmount}`);
    setShowVendorPopup(false); // Close Vendor pop-up after submission

    // Call the transferCUSD function with the specified amount
    await transferCUSD(vendorWalletID,
      address as string
    );
  };

  const handleBalanceClick = () => {
    setShowBalancePopup(true); // Show Balance pop-up when the "Balance" button is clicked
    setShowDropdown(false); // Hide the dropdown when Balance is clicked
    setShowAmountField(false); // Hide the lock amount field when Balance is clicked
    setShowTransactPopup(false); // Close Transact pop-up when Balance is clicked
    setShowVendorPopup(false); // Close Vendor pop-up when Balance is clicked
    setShowErrorPopup(false); // Hide error pop-up when Balance is clicked
    setShowInsufficientPopup(false);
    setShowVendorNotAffiliatedPopup(false); // Hide "vendor not affiliated" pop-up when Balance is clicked
  };

  const handleBalancePopupCancelClick = () => {
    setShowBalancePopup(false); // Close Balance pop-up when "Return" button is clicked
  };

  const handleTransactClick = () => {
    setShowTransactPopup(true); // Show Transact pop-up when the "Transact" button is clicked
    setShowDropdown(false); // Hide the dropdown when Transact is clicked
    setShowBalancePopup(false); // Close Balance pop-up when Transact is clicked
    setShowAmountField(false); // Hide the lock amount field when Transact is clicked
    setShowVendorPopup(false); // Close Vendor pop-up when Transact is clicked
    setShowErrorPopup(false); // Hide error pop-up when Transact is clicked
    setShowInsufficientPopup(false);
    setShowVendorNotAffiliatedPopup(false); // Hide "vendor not affiliated" pop-up when Transact is clicked
  };

  const handleTransactOptionClick = (option: string) => {
    // Handle the selected option in the Transact pop-up
    console.log(`Paying with: ${option}`);
    setShowTransactPopup(false); // Close Transact pop-up after selection
    setShowVendorPopup(true); // Show Vendor pop-up after selecting the account
  };

  const handleVendorIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVendorWalletID(event.target.value);
  };

  const handlePaymentAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(event.target.value);
    setPaymentAmount(isNaN(amount) ? 0 : amount);
  };

  const handleVendorPopupCancelClick = () => {
    setShowVendorPopup(false); // Close Vendor pop-up when "Cancel" button is clicked
  };

  const handleVendorPopupSubmitClick = () => {
    handleSubmitClick();
  };

  const handleVendorNotAffiliatedPopupCancelClick = () => {
    setShowVendorNotAffiliatedPopup(false); // Close "vendor not affiliated with wallet" pop-up
  };

  const handleErrorPopupCancelClick = () => {
    setShowErrorPopup(false); // Hide error pop-up
  };
  const handleInsufficientPopupCancelClick = () => {
    setShowInsufficientPopup(false); // Hide error pop-up
  };
  const handleLockClick = () => {
    // Perform any additional logic if needed before locking the amount
    console.log(`Locking Amount: ${lockAmount}`);
    // Store or update the corresponding variable by adding the new amount to the existing amount
    switch (selectedOption) {
      case "Groceries":
        setGroceriesAmount((prevAmount) => (prevAmount || 0) + (lockAmount || 0));
        break;
      case "Rent":
        setRentAmount((prevAmount) => (prevAmount || 0) + (lockAmount || 0));
        break;
      case "Transport":
        setTransportAmount((prevAmount) => (prevAmount || 0) + (lockAmount || 0));
        break;
      default:
        break;
    }
    setShowAmountField(false);
    setLockAmount(null);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="w-full flex flex-col justify-center items-start px-7">
        <div className="h2 text-center mb-4">
          Your address: {userAddress.substring(0, 5)}...
          {userAddress.substring(userAddress.length - 4, userAddress.length)}
        </div>
        {!showDropdown && !showBalancePopup && !showTransactPopup && !showVendorPopup && (
          <>
            <Button text="Budget Lock" loading={loading} onClick={() => setShowDropdown(true)} />
            <Button text="Balance" loading={loading} onClick={handleBalanceClick} />
            <Button text="Transact" loading={loading} onClick={handleTransactClick} />
            {/* Add the "GoToSMS" button below */}
              <Link href="/SMSForm">
                <Button text="TopMeUp" onClick={() => { /* handle GoToSMS button click if needed */ }} loading={false} />
              </Link>
          </>
        )}

        {showDropdown && (
          <div className="mt-2 flex flex-col">
            <Button text="Groceries" onClick={() => handleOptionClick("Groceries")} loading={false} />
            <Button text="Rent" onClick={() => handleOptionClick("Rent")} loading={false} />
            <Button text="Transport" onClick={() => handleOptionClick("Transport")} loading={false} />
          </div>
        )}

        {showAmountField && (
          <div className="mt-2">
            <label htmlFor="lockAmount">How much would you like to lock?</label>
            <div className="border p-2 border-1 flex">
              <input
                type="number"
                id="lockAmount"
                value={lockAmount || ''}
                onChange={handleLockAmountChange}
              />
            </div>
            <button className="ml-2 bg-red-500 text-white px-4 py-2 rounded" onClick={handleCancelClick}>
                Cancel
              </button>
              <button className="ml-2 bg-green-500 text-white px-4 py-2 rounded" onClick={handleLockClick}>
                Lock
              </button>    
          </div>
        )}

        {/* Display the amounts for each category only when the "Balance" pop-up is open */}
        {showBalancePopup && (
          <div className="mt-2">
            <div>
              Groceries Amount: {groceriesAmount}
            </div>
            <div>
              Rent Amount: {rentAmount}
            </div>
            <div>
              Transport Amount: {transportAmount}
            </div>
            <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded" onClick={handleBalancePopupCancelClick}>
              Return
            </button>
          </div>
        )}

        {/* Display the Transact pop-up when it's open */}
        {showTransactPopup && (
          <div className="mt-2">
            <div className="border p-1 border-1 flex">
              Which account are you paying with?
            </div>
            <div className="flex flex-col">
              <Button text="Groceries" onClick={() => handleTransactOptionClick("Groceries")} loading={false} />
              <Button text="Rent" onClick={() => handleTransactOptionClick("Rent")} loading={false} />
              <Button text="Transport" onClick={() => handleTransactOptionClick("Transport")} loading={false} />
            </div>
          </div>
        )}

        {/* Display the Vendor pop-up when it's open */}
        {showVendorPopup && (
          <div className="mt-2">
            <div className="border p-1 border-1 flex">
              Enter the vendors wallet ID:
            </div>
            <div className="border p-1 border-1 flex mt-2">
              <input
                type="text"
                id="vendorWalletID"
                value={vendorWalletID}
                onChange={handleVendorIDChange}
                placeholder="Vendor's Wallet ID"
              />
            </div>
            <div className="border p-1 border-1 flex mt-2">
              <label htmlFor="paymentAmount">How much do you want to pay?</label>
            </div>
            <div className="border p-1 border-1 flex mt-2">            
              <input
                type="number"
                id="paymentAmount"
                value={paymentAmount || ''}
                onChange={handlePaymentAmountChange}
                placeholder="Payment Amount"
              /> 
            </div>           
            <div className="flex mt-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleVendorPopupSubmitClick}>
                Submit
              </button>
              <button className="ml-2 bg-red-500 text-white px-4 py-2 rounded" onClick={handleVendorPopupCancelClick}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Display the "vendor not affiliated with wallet" pop-up when it's open */}
        {showVendorNotAffiliatedPopup && (
          <div className="mt-2">
            <div className="border p-1 border-1 flex">
              Vendor is not affiliated with the wallet.
            </div>
            <button
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleVendorNotAffiliatedPopupCancelClick}
            >
              OK
            </button>
          </div>
        )}

        {/* Display the error pop-up when it's open */}
        {showErrorPopup && (
          <div className="mt-2">
            <div className="border p-1 border-1 flex">
              There is a missing field.
            </div>
            <button
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleErrorPopupCancelClick}
            >
              OK
            </button>
          </div>
        )}
        {showInsufficientPopup && (
          <div className="mt-2">
            <div className="border p-1 border-1 flex">
              Insufficient funds
            </div>
            <button
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleInsufficientPopupCancelClick}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );

}
