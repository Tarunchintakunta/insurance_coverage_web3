// import React, { useState, useEffect } from 'react';
// import { getContractAddress, setContractAddress, isMetaMaskInstalled, connectWallet } from './utils/web3';

// function App() {
//   const [account, setAccount] = useState('');
//   const [activeTab, setActiveTab] = useState('insurance');
//   const [contractAddress, setContractAddressState] = useState('');
  
//   useEffect(() => {
//     // Check if contract address is already stored
//     const storedAddress = getContractAddress();
//     if (storedAddress) {
//       setContractAddressState(storedAddress);
//     }
    
//     // Check if user was previously connected
//     const storedAccount = localStorage.getItem('connectedWalletAddress');
//     if (storedAccount) {
//       setAccount(storedAccount);
//     }
    
//     // Listen for MetaMask account changes
//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', (accounts) => {
//         if (accounts.length > 0) {
//           setAccount(accounts[0]);
//           localStorage.setItem('connectedWalletAddress', accounts[0]);
//         } else {
//           setAccount('');
//           localStorage.removeItem('connectedWalletAddress');
//         }
//       });
//     }
//   }, []);
  
//   // Handle wallet connection
//   const handleConnectWallet = async () => {
//     if (!isMetaMaskInstalled()) {
//       alert('Please install MetaMask to use this dApp');
//       return;
//     }
    
//     try {
//       const address = await connectWallet();
//       setAccount(address);
//     } catch (error) {
//       console.error('Error connecting to wallet:', error);
//       alert(`Connection error: ${error.message}`);
//     }
//   };
  
//   // Set contract address
//   const handleSetContractAddress = (e) => {
//     e.preventDefault();
//     if (contractAddress) {
//       setContractAddress(contractAddress);
//       alert('Contract address set successfully!');
//     }
//   };
  
//   // Render the insurance plans tab
//   const renderInsurancePlans = () => (
//     <div className="mt-8">
//       <h2 className="text-2xl font-bold mb-6">Insurance Plans</h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Basic Plan */}
//         <div className="border rounded-lg p-6 border-gray-200 hover:border-blue-500 hover:shadow-md transition">
//           <h3 className="text-xl font-bold mb-2">Basic Plan</h3>
//           <div className="text-3xl font-bold mb-4">60%</div>
//           <p className="text-gray-600 mb-2">Coverage</p>
          
//           <div className="mb-4">
//             <p className="text-gray-600">Price: 0.01 ETH</p>
//             <p className="text-gray-600">Duration: 30 days</p>
//           </div>
          
//           <button
//             onClick={() => alert('Please implement the purchase functionality')}
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Purchase for 0.01 ETH
//           </button>
//         </div>
        
//         {/* Standard Plan */}
//         <div className="border rounded-lg p-6 border-gray-200 hover:border-blue-500 hover:shadow-md transition">
//           <h3 className="text-xl font-bold mb-2">Standard Plan</h3>
//           <div className="text-3xl font-bold mb-4">80%</div>
//           <p className="text-gray-600 mb-2">Coverage</p>
          
//           <div className="mb-4">
//             <p className="text-gray-600">Price: 0.02 ETH</p>
//             <p className="text-gray-600">Duration: 30 days</p>
//           </div>
          
//           <button
//             onClick={() => alert('Please implement the purchase functionality')}
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Purchase for 0.02 ETH
//           </button>
//         </div>
        
//         {/* Premium Plan */}
//         <div className="border rounded-lg p-6 border-gray-200 hover:border-blue-500 hover:shadow-md transition">
//           <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
//           <div className="text-3xl font-bold mb-4">90%</div>
//           <p className="text-gray-600 mb-2">Coverage</p>
          
//           <div className="mb-4">
//             <p className="text-gray-600">Price: 0.03 ETH</p>
//             <p className="text-gray-600">Duration: 30 days</p>
//           </div>
          
//           <button
//             onClick={() => alert('Please implement the purchase functionality')}
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Purchase for 0.03 ETH
//           </button>
//         </div>
//       </div>
//     </div>
//   );
  
//   // Render the medication verification tab
//   const renderMedicationVerification = () => (
//     <div className="mt-8">
//       <h2 className="text-2xl font-bold mb-6">Medication Coverage Verification</h2>
      
//       <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
//         <p className="font-bold">No Active Insurance</p>
//         <p>You don't have an active insurance plan. You'll need to pay full price for medications.</p>
//       </div>
      
//       <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
//         <div className="mb-6">
//           <label className="block text-gray-700 mb-2">Available Medications (for demo)</label>
//           <div className="flex flex-wrap gap-2">
//             <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm transition">
//               Aspirin (MED001)
//             </button>
//             <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm transition">
//               Amoxicillin (MED002)
//             </button>
//             <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm transition">
//               Lipitor (MED003)
//             </button>
//             <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm transition">
//               Insulin (MED004)
//             </button>
//             <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm transition">
//               Ibuprofen (MED005)
//             </button>
//           </div>
//         </div>
        
//         <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
//           <div className="flex-grow">
//             <label htmlFor="medicationId" className="block text-gray-700 mb-2">
//               Medication ID
//             </label>
//             <input
//               id="medicationId"
//               type="text"
//               placeholder="Enter medication ID (e.g., MED001)"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <button
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Check Coverage
//           </button>
//         </div>
//       </div>
//     </div>
//   );
  
//   // Render the transaction history tab
//   const renderTransactionHistory = () => (
//     <div className="mt-8">
//       <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
      
//       <div className="mb-6">
//         <p className="text-gray-600 mb-2">Contract Address:</p>
//         <p className="text-blue-600 hover:underline break-all flex items-center">
//           {getContractAddress() || 'No contract address set'}
//         </p>
//       </div>
      
//       <h3 className="text-xl font-semibold mb-4">Recent Blockchain Transactions</h3>
//       <div className="bg-gray-100 text-gray-600 p-6 rounded-lg text-center mb-8">
//         No transaction history found.
//       </div>
      
//       <h3 className="text-xl font-semibold mb-4">Medication Purchase History</h3>
//       <div className="bg-gray-100 text-gray-600 p-6 rounded-lg text-center">
//         No medication purchase history found.
//       </div>
//     </div>
//   );
  
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-blue-600 p-4 text-white">
//         <div className="container mx-auto flex justify-between items-center">
//           <div className="text-xl font-bold">Health Insurance DApp</div>
          
//           <div className="flex items-center space-x-4">
//             {account ? (
//               <div className="bg-blue-700 px-3 py-1 rounded-lg">
//                 {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
//               </div>
//             ) : (
//               <button
//                 onClick={handleConnectWallet}
//                 className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
//               >
//                 Connect Wallet
//               </button>
//             )}
//           </div>
//         </div>
//       </nav>
      
//       <div className="container mx-auto px-4 py-8">
//         {!getContractAddress() && (
//           <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
//             <p className="font-bold">Contract Address Not Set</p>
//             <p className="mb-2">Please set the contract address after deployment to interact with the dApp.</p>
            
//             <form onSubmit={handleSetContractAddress} className="flex gap-2">
//               <input
//                 type="text"
//                 value={contractAddress}
//                 onChange={(e) => setContractAddressState(e.target.value)}
//                 placeholder="Enter contract address"
//                 className="flex-grow px-3 py-2 border border-yellow-400 rounded"
//               />
//               <button
//                 type="submit"
//                 className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
//               >
//                 Set Address
//               </button>
//             </form>
//           </div>
//         )}
        
//         {!account ? (
//           <div className="text-center py-12">
//             <h1 className="text-3xl font-bold mb-4">Welcome to Health Insurance DApp</h1>
//             <p className="text-gray-600 mb-8">
//               A decentralized application for health insurance coverage verification.
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="flex border-b border-gray-200 mb-8">
//               <button
//                 onClick={() => setActiveTab('insurance')}
//                 className={`px-6 py-3 font-medium ${
//                   activeTab === 'insurance'
//                     ? 'text-blue-600 border-b-2 border-blue-600'
//                     : 'text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 Insurance Plans
//               </button>
//               <button
//                 onClick={() => setActiveTab('medication')}
//                 className={`px-6 py-3 font-medium ${
//                   activeTab === 'medication'
//                     ? 'text-blue-600 border-b-2 border-blue-600'
//                     : 'text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 Medication Verification
//               </button>
//               <button
//                 onClick={() => setActiveTab('history')}
//                 className={`px-6 py-3 font-medium ${
//                   activeTab === 'history'
//                     ? 'text-blue-600 border-b-2 border-blue-600'
//                     : 'text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 Transaction History
//               </button>
//             </div>
            
//             <div className="pb-12">
//               {activeTab === 'insurance' && renderInsurancePlans()}
//               {activeTab === 'medication' && renderMedicationVerification()}
//               {activeTab === 'history' && renderTransactionHistory()}
//             </div>
//           </>
//         )}
//       </div>
      
//       <footer className="bg-gray-800 text-white py-6">
//         <div className="container mx-auto px-4 text-center">
//           <p>Health Insurance DApp © 2025</p>
//           <p className="text-gray-400 text-sm mt-2">
//             Running on Sepolia Testnet
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';

function App() {
  const [account, setAccount] = useState('');
  const [activeTab, setActiveTab] = useState('insurance');
  const [contractAddress, setContractAddress] = useState('');
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [userHasInsurance, setUserHasInsurance] = useState(false);
  const [userInsurancePlan, setUserInsurancePlan] = useState(null);
  
  // Verified address where funds are sent
  const VERIFIED_ADDRESS = '0x081C18e85D09645CA64dBD1e4781135F5E54110f';
  
  useEffect(() => {
    // Check if contract address is already stored
    const storedAddress = localStorage.getItem('healthInsuranceContractAddress');
    if (storedAddress) {
      setContractAddress(storedAddress);
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
  
  // Check if user has purchased insurance
  useEffect(() => {
    if (account) {
      // Check localStorage for insurance purchases
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const insurancePurchases = transactions.filter(tx => tx.type === 'Insurance Purchase');
      
      if (insurancePurchases.length > 0) {
        // Get the most recent insurance purchase
        const latestPurchase = insurancePurchases.reduce((latest, current) => 
          current.timestamp > latest.timestamp ? current : latest, insurancePurchases[0]);
        
        setUserHasInsurance(true);
        setUserInsurancePlan(latestPurchase.details.planType);
      }
    }
  }, [account, activeTab]);
  
  // Handle wallet connection
  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        localStorage.setItem('connectedWalletAddress', accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
        alert('Failed to connect to MetaMask: ' + error.message);
      }
    } else {
      alert('Please install MetaMask to use this dApp');
    }
  };
  
  // Set contract address
  const handleSetContractAddress = (e) => {
    e.preventDefault();
    if (contractAddress) {
      localStorage.setItem('healthInsuranceContractAddress', contractAddress);
      alert('Contract address set successfully!');
    }
  };
  
  // Get contract address from localStorage
  const getContractAddress = () => {
    return localStorage.getItem('healthInsuranceContractAddress');
  };
  
  // Purchase insurance plan
  const handlePurchaseInsurance = async (plan) => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }
    
    try {
      const priceInWei = plan.price * 1e18; // Convert ETH to wei
      const priceHex = '0x' + priceInWei.toString(16);
      
      const tx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: VERIFIED_ADDRESS,
          value: priceHex
        }]
      });
      
      alert(`Successfully purchased ${plan.name} plan! Transaction hash: ${tx}`);
      
      // Save transaction to localStorage
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.push({
        hash: tx,
        type: 'Insurance Purchase',
        details: { planType: plan.name, price: plan.price },
        timestamp: Date.now()
      });
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      // Update insurance status
      setUserHasInsurance(true);
      setUserInsurancePlan(plan.name);
      
      // Go to medication tab
      setActiveTab('medication');
    } catch (error) {
      console.error('Error purchasing insurance:', error);
      alert(`Failed to purchase insurance: ${error.message}`);
    }
  };
  
  // Handle medication selection
  const handleCheckMedication = (id, name, price) => {
    if (!userHasInsurance) {
      alert('Please purchase an insurance plan first to check coverage details.');
      setActiveTab('insurance');
      return;
    }
    
    // Calculate coverage based on insurance plan
    let coveragePercent = 0;
    switch(userInsurancePlan) {
      case 'Basic':
        coveragePercent = 60;
        break;
      case 'Standard':
        coveragePercent = 80;
        break;
      case 'Premium':
        coveragePercent = 90;
        break;
      default:
        coveragePercent = 0;
    }
    
    const copayAmount = price * (1 - (coveragePercent / 100));
    
    setSelectedMedication({
      id,
      name,
      price,
      coverage: coveragePercent,
      copay: copayAmount.toFixed(6)
    });
  };
  
  // Handle medication purchase
  const handlePurchaseMedication = async (medication) => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }
    
    try {
      const priceInWei = medication.copay * 1e18; // Convert ETH to wei
      const priceHex = '0x' + Math.floor(priceInWei).toString(16);
      
      const tx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: VERIFIED_ADDRESS,
          value: priceHex
        }]
      });
      
      alert(`Successfully purchased ${medication.name}! Transaction hash: ${tx}`);
      
      // Save transaction to localStorage
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.push({
        hash: tx,
        type: 'Medication Purchase',
        details: { medicationId: medication.id, name: medication.name, price: medication.copay },
        timestamp: Date.now()
      });
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      // Clear selected medication
      setSelectedMedication(null);
      
      // Switch to transaction history
      setActiveTab('history');
    } catch (error) {
      console.error('Error purchasing medication:', error);
      alert(`Failed to purchase medication: ${error.message}`);
    }
  };
  
  const insurancePlans = [
    { name: "Basic", coverage: 60, price: 0.01 },
    { name: "Standard", coverage: 80, price: 0.02 },
    { name: "Premium", coverage: 90, price: 0.03 }
  ];
  
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
        {!getContractAddress() ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Contract Address Not Set</p>
            <p className="mb-2">Please set the contract address after deployment to interact with the dApp.</p>
            
            <form onSubmit={handleSetContractAddress} className="flex gap-2">
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
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
            <p className="text-sm mt-2">
              <strong>Note:</strong> Payments will be sent to the verified address: {VERIFIED_ADDRESS}
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2">Contract Information</h3>
            <p><span className="font-medium">Contract Address:</span> {getContractAddress()}</p>
            <p><span className="font-medium">Payments go to:</span> {VERIFIED_ADDRESS}</p>
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
              {activeTab === 'insurance' && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-6">Insurance Plans</h2>
                  
                  {userHasInsurance && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                      <p className="font-bold">You have active insurance!</p>
                      <p>Plan: {userInsurancePlan}</p>
                      <p>You can now check medication coverage in the Medication Verification tab.</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {insurancePlans.map((plan) => (
                      <div 
                        key={plan.name} 
                        className={`border rounded-lg p-6 ${
                          userInsurancePlan === plan.name 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-blue-500 hover:shadow-md'
                        } transition`}
                      >
                        <h3 className="text-xl font-bold mb-2">{plan.name} Plan</h3>
                        <div className="text-3xl font-bold mb-4">{plan.coverage}%</div>
                        <p className="text-gray-600 mb-2">Coverage</p>
                        
                        <div className="mb-4">
                          <p className="text-gray-600">Price: {plan.price} ETH</p>
                          <p className="text-gray-600">Duration: 30 days</p>
                        </div>
                        
                        {userInsurancePlan === plan.name ? (
                          <button
                            disabled
                            className="w-full bg-green-500 text-white py-2 rounded-lg opacity-75 cursor-not-allowed"
                          >
                            Current Plan
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePurchaseInsurance(plan)}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                          >
                            Purchase for {plan.price} ETH
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'medication' && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-6">Medication Coverage Verification</h2>
                  
                  {!userHasInsurance && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                      <p className="font-bold">No Active Insurance</p>
                      <p>You don't have an active insurance plan. You'll need to pay full price for medications.</p>
                    </div>
                  )}
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                    <p className="text-lg mb-4">Select a medication to check coverage:</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <button 
                        onClick={() => handleCheckMedication('MED001', 'Aspirin', 0.005)} 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg transition"
                      >
                        Aspirin (MED001)
                      </button>
                      <button 
                        onClick={() => handleCheckMedication('MED002', 'Amoxicillin', 0.01)} 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg transition"
                      >
                        Amoxicillin (MED002)
                      </button>
                      <button 
                        onClick={() => handleCheckMedication('MED003', 'Lipitor', 0.02)} 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg transition"
                      >
                        Lipitor (MED003)
                      </button>
                      <button 
                        onClick={() => handleCheckMedication('MED004', 'Insulin', 0.025)} 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg transition"
                      >
                        Insulin (MED004)
                      </button>
                      <button 
                        onClick={() => handleCheckMedication('MED005', 'Ibuprofen', 0.004)} 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg transition"
                      >
                        Ibuprofen (MED005)
                      </button>
                    </div>
                    
                    {selectedMedication ? (
                      <div className="border rounded-lg p-4 bg-blue-50">
                        <h3 className="text-xl font-bold mb-4">{selectedMedication.name} Coverage Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-gray-600 mb-1">Medication ID:</p>
                            <p className="font-medium">{selectedMedication.id}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Original Price:</p>
                            <p className="font-medium">{selectedMedication.price} ETH</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Coverage:</p>
                            <p className="font-medium">{selectedMedication.coverage}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Your Co-Pay:</p>
                            <p className="font-medium text-xl text-blue-600">{selectedMedication.copay} ETH</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handlePurchaseMedication(selectedMedication)}
                          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          Purchase for {selectedMedication.copay} ETH
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        {userHasInsurance 
                          ? "Click on a medication above to check coverage details." 
                          : "Connect your wallet and purchase an insurance plan to check medication coverage."}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
                  
                  {getContractAddress() && (
                    <div className="mb-6">
                      <p className="text-gray-600 mb-2">Contract Address:</p>
                      <a 
                        href={`https://sepolia.etherscan.io/address/${getContractAddress()}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all flex items-center"
                      >
                        {getContractAddress()}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                  
                  {(() => {
                    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
                    
                    if (transactions.length === 0) {
                      return (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          <p className="text-lg mb-4">Your transaction history will appear here after purchases.</p>
                          
                          <p className="text-gray-600">
                            Make insurance or medication purchases to see your transaction history.
                          </p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="overflow-x-auto mb-6">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="py-3 px-4 text-left font-medium text-gray-600">Date</th>
                              <th className="py-3 px-4 text-left font-medium text-gray-600">Type</th>
                              <th className="py-3 px-4 text-left font-medium text-gray-600">Details</th>
                              <th className="py-3 px-4 text-left font-medium text-gray-600">Transaction Hash</th>
                              <th className="py-3 px-4 text-left font-medium text-gray-600">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {transactions.map((tx, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  {new Date(tx.timestamp).toLocaleString()}
                                </td>
                                <td className="py-3 px-4 font-medium">
                                  {tx.type}
                                </td>
                                <td className="py-3 px-4">
                                  {tx.type === 'Insurance Purchase' 
                                    ? `Plan: ${tx.details.planType} (${tx.details.price} ETH)` 
                                    : tx.type === 'Medication Purchase'
                                      ? `Medication: ${tx.details.name} (${tx.details.price} ETH)`
                                      : JSON.stringify(tx.details)}
                                </td>
                                <td className="py-3 px-4 font-mono text-sm">
                                  {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                                </td>
                                <td className="py-3 px-4">
                                  <a 
                                    href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center"
                                  >
                                    View on Etherscan
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>Health Insurance DApp © 2025</p>
          <p className="text-gray-400 text-sm mt-2">
            Running on Sepolia Testnet | Payments go to: {VERIFIED_ADDRESS}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;