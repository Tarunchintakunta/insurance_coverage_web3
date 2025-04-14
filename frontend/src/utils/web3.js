import { ethers } from 'ethers';
import HealthInsuranceArtifact from '../artifacts/contracts/HealthInsurance.sol/HealthInsurance.json';

// Contract address will be updated after deployment
let CONTRACT_ADDRESS = '';

// Verified address where funds should be sent
export const VERIFIED_ADDRESS = '0x081C18e85D09645CA64dBD1e4781135F5E54110f';

// Function to set contract address (called after deployment)
export const setContractAddress = (address) => {
  CONTRACT_ADDRESS = address;
  // Store in localStorage for persistence
  localStorage.setItem('healthInsuranceContractAddress', address);
};

// Function to get contract address from localStorage if exists
export const getContractAddress = () => {
  const storedAddress = localStorage.getItem('healthInsuranceContractAddress');
  if (storedAddress) {
    CONTRACT_ADDRESS = storedAddress;
  }
  return CONTRACT_ADDRESS;
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return typeof window.ethereum !== 'undefined';
};

// Check if connected to Sepolia
export const isSepolia = async () => {
  if (!isMetaMaskInstalled()) return false;
  
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    return network.chainId === 11155111; // Sepolia chain ID
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};

// Request switch to Sepolia
export const switchToSepolia = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed!');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID in hex
    });
    return true;
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xaa36a7',
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'Sepolia Ether',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            },
          ],
        });
        return true;
      } catch (addError) {
        throw new Error(`Failed to add Sepolia network: ${addError.message}`);
      }
    }
    throw new Error(`Failed to switch to Sepolia: ${error.message}`);
  }
};

// Connect to MetaMask
export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed!');
  }

  try {
    // Check if we're on Sepolia and switch if needed
    const onSepolia = await isSepolia();
    if (!onSepolia) {
      await switchToSepolia();
    }
    
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Store the connected address in localStorage
    localStorage.setItem('connectedWalletAddress', accounts[0]);
    
    return accounts[0];
  } catch (error) {
    throw new Error(`Failed to connect to MetaMask: ${error.message}`);
  }
};

// Get user's ETH balance
export const getBalance = async (address) => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed!');
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0.0';
  }
};

// Get the contract instance
export const getContract = () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed!');
  }

  if (!CONTRACT_ADDRESS) {
    const storedAddress = getContractAddress();
    if (!storedAddress) {
      throw new Error('Contract address not set');
    }
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      HealthInsuranceArtifact.abi,
      signer
    );
    return contract;
  } catch (error) {
    console.error('Failed to get contract:', error);
    throw new Error(`Failed to get contract: ${error.message}`);
  }
};

// Store transaction in localStorage
export const storeTransaction = (txHash, type, details) => {
  const newTx = {
    hash: txHash,
    type: type,
    details: details,
    timestamp: Date.now()
  };
  
  let transactions = [];
  const storedTransactions = localStorage.getItem('transactions');
  
  if (storedTransactions) {
    try {
      transactions = JSON.parse(storedTransactions);
    } catch (e) {
      console.error('Error parsing stored transactions:', e);
    }
  }
  
  transactions.push(newTx);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  return newTx;
};

// Get user's insurance details
export const getUserInsurance = async (address) => {
  try {
    const contract = getContract();
    const insurance = await contract.getUserInsurance(address);
    return {
      planType: insurance.planType,
      startDate: new Date(insurance.startDate.toNumber() * 1000),
      endDate: new Date(insurance.endDate.toNumber() * 1000),
      isActive: insurance.isActive,
      hasActiveInsurance: insurance.hasActiveInsurance
    };
  } catch (error) {
    console.error('Failed to get user insurance:', error);
    // Return a default object
    return {
      planType: '',
      startDate: new Date(),
      endDate: new Date(),
      isActive: false,
      hasActiveInsurance: false
    };
  }
};

// Get available insurance plans
export const getAvailableInsurancePlans = async () => {
  try {
    const contract = getContract();
    const plans = await contract.getAvailableInsurancePlans();
    
    return [
      {
        planType: plans.basic.planType,
        coveragePercentage: plans.basic.coveragePercentage.toNumber(),
        price: ethers.utils.formatEther(plans.basic.price),
        duration: plans.basic.duration.toNumber() / (24 * 60 * 60), // Convert to days
        isActive: plans.basic.isActive
      },
      {
        planType: plans.standard.planType,
        coveragePercentage: plans.standard.coveragePercentage.toNumber(),
        price: ethers.utils.formatEther(plans.standard.price),
        duration: plans.standard.duration.toNumber() / (24 * 60 * 60), // Convert to days
        isActive: plans.standard.isActive
      },
      {
        planType: plans.premium.planType,
        coveragePercentage: plans.premium.coveragePercentage.toNumber(),
        price: ethers.utils.formatEther(plans.premium.price),
        duration: plans.premium.duration.toNumber() / (24 * 60 * 60), // Convert to days
        isActive: plans.premium.isActive
      }
    ];
  } catch (error) {
    console.error('Failed to get insurance plans:', error);
    throw new Error(`Failed to get insurance plans: ${error.message}`);
  }
};

// Purchase insurance plan
export const purchaseInsurance = async (planType, price) => {
  try {
    const contract = getContract();
    const tx = await contract.purchaseInsurance(planType, {
      value: ethers.utils.parseEther(price.toString())
    });
    
    // Store transaction hash
    storeTransaction(
      tx.hash,
      'Insurance Purchase',
      { planType, price }
    );
    
    return await tx.wait();
  } catch (error) {
    console.error('Failed to purchase insurance:', error);
    throw new Error(`Failed to purchase insurance: ${error.message}`);
  }
};

// Get medication coverage
export const getMedicationCoverage = async (medicationId, address) => {
  try {
    const contract = getContract();
    const coverage = await contract.getMedicationCoverage(medicationId, address);
    
    return {
      originalPrice: ethers.utils.formatEther(coverage.originalPrice),
      coveredPrice: ethers.utils.formatEther(coverage.coveredPrice),
      coPayAmount: ethers.utils.formatEther(coverage.coPayAmount),
      hasCoverage: coverage.hasCoverage
    };
  } catch (error) {
    console.error('Failed to get medication coverage:', error);
    throw new Error(`Failed to get medication coverage: ${error.message}`);
  }
};

// Purchase medication
export const purchaseMedication = async (medicationId, amount) => {
  try {
    const contract = getContract();
    const tx = await contract.purchaseMedication(medicationId, {
      value: ethers.utils.parseEther(amount.toString())
    });
    
    // Store transaction hash
    storeTransaction(
      tx.hash,
      'Medication Purchase',
      { medicationId, amount }
    );
    
    return await tx.wait();
  } catch (error) {
    console.error('Failed to purchase medication:', error);
    throw new Error(`Failed to purchase medication: ${error.message}`);
  }
};

// Get medication purchase history
export const getMedicationPurchaseHistory = async (address) => {
  try {
    const contract = getContract();
    const history = await contract.getMedicationPurchaseHistory(address);
    
    return history.map(purchase => ({
      medicationId: purchase.medicationId,
      originalPrice: ethers.utils.formatEther(purchase.originalPrice),
      coveredPrice: ethers.utils.formatEther(purchase.coveredPrice),
      coPayAmount: ethers.utils.formatEther(purchase.coPayAmount),
      purchaseDate: new Date(purchase.purchaseDate.toNumber() * 1000)
    }));
  } catch (error) {
    console.error('Failed to get medication purchase history:', error);
    return []; // Return empty array on error
  }
};

// Get stored transactions from localStorage
export const getTransactionHistory = () => {
  const storedTransactions = localStorage.getItem('transactions');
  if (storedTransactions) {
    try {
      return JSON.parse(storedTransactions);
    } catch (e) {
      console.error('Error parsing stored transactions:', e);
      return [];
    }
  }
  return [];
};

// Check if a medication exists
export const isMedicationAvailable = async (medicationId) => {
  try {
    const contract = getContract();
    return await contract.isMedicationAvailable(medicationId);
  } catch (error) {
    console.error('Failed to check medication availability:', error);
    return false;
  }
};

// Get medication details
export const getMedicationDetails = async (medicationId) => {
  try {
    const contract = getContract();
    const details = await contract.getMedicationDetails(medicationId);
    
    return {
      id: details.id,
      name: details.name,
      price: ethers.utils.formatEther(details.price)
    };
  } catch (error) {
    console.error('Failed to get medication details:', error);
    throw new Error(`Failed to get medication details: ${error.message}`);
  }
};