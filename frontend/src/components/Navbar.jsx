import React, { useState, useEffect } from 'react';
import { connectWallet, getBalance, isMetaMaskInstalled, isSepolia, switchToSepolia } from '../utils/web3';

const Navbar = ({ account, setAccount }) => {
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  
  useEffect(() => {
    // Check if user was previously connected
    const storedAddress = localStorage.getItem('connectedWalletAddress');
    if (storedAddress && !account) {
      setAccount(storedAddress);
      fetchBalance(storedAddress);
    }
    
    // Check if on Sepolia network
    const checkNetwork = async () => {
      const onSepolia = await isSepolia();
      setIsCorrectNetwork(onSepolia);
    };
    
    checkNetwork();
  }, []);
  
  useEffect(() => {
    if (account) {
      fetchBalance(account);
    }
  }, [account]);
  
  const fetchBalance = async (address) => {
    try {
      const bal = await getBalance(address);
      setBalance(bal);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };
  
  const handleConnect = async () => {
    if (!isMetaMaskInstalled()) {
      alert('Please install MetaMask to use this dApp');
      return;
    }
    
    setIsConnecting(true);
    try {
      // Check if on Sepolia, prompt to switch if not
      const onSepolia = await isSepolia();
      if (!onSepolia) {
        const switched = await switchToSepolia();
        if (!switched) {
          alert('Please switch to Sepolia network in MetaMask');
          setIsConnecting(false);
          return;
        }
      }
      
      const address = await connectWallet();
      setAccount(address);
      setIsCorrectNetwork(true);
    } catch (error) {
      console.error('Connection error:', error);
      alert(`Failed to connect: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleSwitchNetwork = async () => {
    try {
      await switchToSepolia();
      setIsCorrectNetwork(true);
    } catch (error) {
      console.error('Error switching network:', error);
      alert(`Failed to switch network: ${error.message}`);
    }
  };
  
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Health Insurance DApp</div>
        
        <div className="flex items-center space-x-4">
          {!isCorrectNetwork && account && (
            <button
              onClick={handleSwitchNetwork}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Switch to Sepolia
            </button>
          )}
          
          {account ? (
            <div className="flex items-center space-x-4">
              <div className="bg-blue-700 px-3 py-1 rounded-lg">
                {parseFloat(balance).toFixed(4)} ETH
              </div>
              <div className="bg-blue-700 px-3 py-1 rounded-lg">
                {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
              </div>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;