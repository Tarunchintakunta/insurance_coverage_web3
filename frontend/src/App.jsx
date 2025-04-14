import React, { useState, useEffect } from 'react';
import { getContractAddress, setContractAddress, isMetaMaskInstalled, connectWallet } from './utils/web3';

function App() {
  const [account, setAccount] = useState('');
  const [activeTab, setActiveTab] = useState('insurance');
  const [contractAddress, setContractAddressState] = useState('');
  
  useEffect(() => {
    // Check if contract address is already stored
    const storedAddress = getContractAddress();
    if (storedAddress) {
      setContractAddressState(storedAddress);
    }
    
    // Check if user was previously connected
    const storedAccount = localStorage.getItem('connectedWalletAddress');
    if (storedAccount) {
      setAccount(storedAccount);
    }
    
    // Listen for MetaMask account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          localStorage.setItem('connectedWalletAddress', accounts[0]);
        } else {
          setAccount('');
          localStorage.removeItem('connectedWalletAddress');
        }
      });
    }
  }, []);
  
  // Handle wallet connection
  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert('Please install MetaMask to use this dApp');
      return;
    }
    
    try {
      const address = await connectWallet();
      setAccount(address);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      alert(`Connection error: ${error.message}`);
    }
  };
  
  // Set contract address
  const handleSetContractAddress = (e) => {
    e.preventDefault();
    if (contractAddress) {
      setContractAddress(contractAddress);
      alert('Contract address set successfully!');
    }
  };
  
  // Render the insurance plans tab
  const renderInsurancePlans = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Insurance Plans</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Plan */}
        <div className="border rounded-lg p-6 border-gray-200 hover:border-blue-500 hover:shadow-md transition">
          <h3 className="text-xl font-bold mb-2">Basic Plan</h3>
          <div className="text-3xl font-bold mb-4">60%</div>
          <p className="text-gray-600 mb-2">Coverage</p>
          
          <div className="mb-4">
            <p className="text-gray-600">Price: 0.01 ETH</p>
            <p className="text-gray-600">Duration: 30 days</p>
          </div>
          
          <button
            onClick={() => alert('Please implement the purchase functionality')}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Purchase for 0.01 ETH
          </button>
        </div>
        
        {/* Standard Plan */}
        <div className="border rounded-lg p-6 border-gray-200 hover:border-blue-500 hover:shadow-md transition">
          <h3 className="text-xl font-bold mb-2">Standard Plan</h3>
          <div className="text-3xl font-bold mb-4">80%</div>
          <p className="text-gray-600 mb-2">Coverage</p>
          
          <div className="mb-4">
            <p className="text-gray-600">Price: 0.02 ETH</p>
            <p className="text-gray-600">Duration: 30 days</p>
          </div>
          
          <button
            onClick={() => alert('Please implement the purchase functionality')}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Purchase for 0.02 ETH
          </button>
        </div>
        
        {/* Premium Plan */}
        <div className="border rounded-lg p-6 border-gray-200 hover:border-blue-500 hover:shadow-md transition">
          <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
          <div className="text-3xl font-bold mb-4">90%</div>
          <p className="text-gray-600 mb-2">Coverage</p>
          
          <div className="mb-4">
            <p className="text-gray-600">Price: 0.03 ETH</p>
            <p className="text-gray-600">Duration: 30 days</p>
          </div>
          
          <button
            onClick={() => alert('Please implement the purchase functionality')}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Purchase for 0.03 ETH
          </button>
        </div>
      </div>
    </div>
  );
  
  // Render the medication verification tab
  const renderMedicationVerification = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Medication Coverage Verification</h2>
      
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
        <p className="font-bold">No Active Insurance</p>
        <p>You don't have an active insurance plan. You'll need to pay full price for medications.</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Available Medications (for demo)</label>
          <div className="flex flex-wrap gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm transition">
              Aspirin (MED001)
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm transition">
              Amoxicillin (MED002)
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm transition">
              Lipitor (MED003)
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm transition">
              Insulin (MED004)
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm transition">
              Ibuprofen (MED005)
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
          <div className="flex-grow">
            <label htmlFor="medicationId" className="block text-gray-700 mb-2">
              Medication ID
            </label>
            <input
              id="medicationId"
              type="text"
              placeholder="Enter medication ID (e.g., MED001)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Check Coverage
          </button>
        </div>
      </div>
    </div>
  );
  
  // Render the transaction history tab
  const renderTransactionHistory = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-2">Contract Address:</p>
        <p className="text-blue-600 hover:underline break-all flex items-center">
          {getContractAddress() || 'No contract address set'}
        </p>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Recent Blockchain Transactions</h3>
      <div className="bg-gray-100 text-gray-600 p-6 rounded-lg text-center mb-8">
        No transaction history found.
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Medication Purchase History</h3>
      <div className="bg-gray-100 text-gray-600 p-6 rounded-lg text-center">
        No medication purchase history found.
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">Health Insurance DApp</div>
          
          <div className="flex items-center space-x-4">
            {account ? (
              <div className="bg-blue-700 px-3 py-1 rounded-lg">
                {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        {!getContractAddress() && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Contract Address Not Set</p>
            <p className="mb-2">Please set the contract address after deployment to interact with the dApp.</p>
            
            <form onSubmit={handleSetContractAddress} className="flex gap-2">
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddressState(e.target.value)}
                placeholder="Enter contract address"
                className="flex-grow px-3 py-2 border border-yellow-400 rounded"
              />
              <button
                type="submit"
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Set Address
              </button>
            </form>
          </div>
        )}
        
        {!account ? (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Welcome to Health Insurance DApp</h1>
            <p className="text-gray-600 mb-8">
              A decentralized application for health insurance coverage verification.
            </p>
          </div>
        ) : (
          <>
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab('insurance')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'insurance'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Insurance Plans
              </button>
              <button
                onClick={() => setActiveTab('medication')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'medication'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Medication Verification
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'history'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Transaction History
              </button>
            </div>
            
            <div className="pb-12">
              {activeTab === 'insurance' && renderInsurancePlans()}
              {activeTab === 'medication' && renderMedicationVerification()}
              {activeTab === 'history' && renderTransactionHistory()}
            </div>
          </>
        )}
      </div>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>Health Insurance DApp © 2025</p>
          <p className="text-gray-400 text-sm mt-2">
            Running on Sepolia Testnet
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;