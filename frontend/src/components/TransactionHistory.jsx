import React, { useState, useEffect } from 'react';
import { getTransactionHistory, getMedicationPurchaseHistory, getContractAddress } from '../utils/web3';

const TransactionHistory = ({ account }) => {
  const [history, setHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (account) {
      fetchTransactionHistory();
    }
  }, [account]);
  
  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      
      // Get transaction history from localStorage
      const txHistory = getTransactionHistory();
      setTransactions(txHistory);
      
      // Get medication purchase history
      const purchaseHistory = await getMedicationPurchaseHistory(account);
      setHistory(purchaseHistory);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      setError(`Failed to load transaction history: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to get medication name from ID
  const getMedicationName = (medicationId) => {
    const medicationNames = {
      'MED001': 'Aspirin',
      'MED002': 'Amoxicillin',
      'MED003': 'Lipitor',
      'MED004': 'Insulin',
      'MED005': 'Ibuprofen'
    };
    
    return medicationNames[medicationId] || medicationId;
  };
  
  // Generate Etherscan link for transaction
  const getEtherscanLink = (txHash) => {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  };
  
  // Generate Etherscan link for the contract
  const getContractEtherscanLink = () => {
    const contractAddress = getContractAddress();
    if (!contractAddress) return '';
    return `https://sepolia.etherscan.io/address/${contractAddress}`;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading transaction history...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
      
      {getContractAddress() && (
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Contract Address:</p>
          <a 
            href={getContractEtherscanLink()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all flex items-center"
          >
            {getContractAddress()}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <p className="text-sm text-gray-500 mt-1">
            View all contract transactions: <a 
              href={`https://sepolia.etherscan.io/address/${getContractAddress()}#transactions`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on Etherscan
            </a>
          </p>
        </div>
      )}
      
      {/* Recent Blockchain Transactions */}
      {transactions.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Recent Blockchain Transactions</h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left font-medium text-gray-600">Date</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">Type</th>
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
                    <td className="py-3 px-4 font-mono text-sm">
                      {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                    </td>
                    <td className="py-3 px-4">
                      <a 
                        href={getEtherscanLink(tx.hash)} 
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
        </div>
      ) : (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Recent Blockchain Transactions</h3>
          <div className="bg-gray-100 text-gray-600 p-6 rounded-lg text-center">
            No transaction history found.
          </div>
        </div>
      )}
      
      {/* Medication Purchase History */}
      <h3 className="text-xl font-semibold mb-4">Medication Purchase History</h3>
      <div className="overflow-x-auto">
        {history.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left font-medium text-gray-600">Date</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">Medication</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">Original Price</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">Covered Price</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">Co-Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {history.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {transaction.purchaseDate.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {getMedicationName(transaction.medicationId)}
                    <span className="text-xs text-gray-500 block">
                      {transaction.medicationId}
                    </span>
                  </td>
                  <td className="py-3 px-4">{transaction.originalPrice} ETH</td>
                  <td className="py-3 px-4">{transaction.coveredPrice} ETH</td>
                  <td className="py-3 px-4 font-medium text-blue-600">
                    {transaction.coPayAmount} ETH
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="bg-gray-100 text-gray-600 p-6 rounded-lg text-center">
            No medication purchase history found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;