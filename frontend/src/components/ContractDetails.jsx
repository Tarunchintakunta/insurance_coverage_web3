import React, { useState, useEffect } from 'react';
import { getContract, VERIFIED_ADDRESS } from '../utils/web3';

const ContractDetails = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    try {
      const contract = getContract();
      setContractAddress(contract.address);
    } catch (error) {
      console.error('Error getting contract address:', error);
      setError('Contract not connected. Please set the contract address in the form above.');
    }
  }, []);
  
  const getEtherscanLink = () => {
    if (!contractAddress) return '';
    return `https://sepolia.etherscan.io/address/${contractAddress}`;
  };
  
  const getVerifiedAddressLink = () => {
    return `https://sepolia.etherscan.io/address/${VERIFIED_ADDRESS}`;
  };
  
  if (error) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }
  
  if (!contractAddress) {
    return null;
  }
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold mb-3">Contract Information</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-600 mb-1">Contract Address:</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <code className="bg-white p-2 rounded border break-all">{contractAddress}</code>
            <a 
              href={getEtherscanLink()} 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition flex items-center justify-center"
            >
              View on Etherscan
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
        
        <div>
          <p className="text-gray-600 mb-1">Payments Sent To:</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <code className="bg-white p-2 rounded border break-all">{VERIFIED_ADDRESS}</code>
            <a 
              href={getVerifiedAddressLink()} 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition flex items-center justify-center"
            >
              View on Etherscan
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-gray-600 mb-1">View Contract Transactions:</p>
        <a 
          href={`https://sepolia.etherscan.io/address/${contractAddress}#transactions`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center"
        >
          https://sepolia.etherscan.io/address/{contractAddress}#transactions
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ContractDetails;