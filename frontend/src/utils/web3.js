import { ethers } from 'ethers';

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

// Get user's insurance details
export const getUserInsurance = async (address) => {
  // Check localStorage first
  try {
    const storedInsurance = localStorage.getItem('userInsurance_' + address.toLowerCase());
    if (storedInsurance) {
      const insurance = JSON.parse(storedInsurance);
      return {
        planType: insurance.planType,
        startDate: new Date(insurance.startDate),
        endDate: new Date(insurance.endDate),
        isActive: insurance.isActive,
        hasActiveInsurance: insurance.hasActiveInsurance
      };
    }
  } catch (e) {
    console.error('Error parsing stored insurance:', e);
  }
  
  // Return default if no stored insurance
  return {
    planType: '',
    startDate: new Date(),
    endDate: new Date(),
    isActive: false,
    hasActiveInsurance: false
  };
};

// Get available insurance plans
export const getAvailableInsurancePlans = async () => {
  return [
    {
      planType: "Basic",
      coveragePercentage: 60,
      price: "0.01",
      duration: 30,
      isActive: true
    },
    {
      planType: "Standard",
      coveragePercentage: 80,
      price: "0.02",
      duration: 30,
      isActive: true
    },
    {
      planType: "Premium",
      coveragePercentage: 90,
      price: "0.03",
      duration: 30,
      isActive: true
    }
  ];
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

// Simplified version for medication coverage
export const getMedicationCoverage = async (medicationId, address) => {
  // Check if user has insurance
  const insurance = await getUserInsurance(address);
  const hasCoverage = insurance.hasActiveInsurance;
  
  // Default medication data
  const medications = {
    'MED001': { name: 'Aspirin', price: '0.005' },
    'MED002': { name: 'Amoxicillin', price: '0.01' },
    'MED003': { name: 'Lipitor', price: '0.02' },
    'MED004': { name: 'Insulin', price: '0.025' },
    'MED005': { name: 'Ibuprofen', price: '0.004' }
  };
  
  if (!medications[medicationId]) {
    throw new Error('Medication not found');
  }
  
  const originalPrice = medications[medicationId].price;
  let coveragePercentage = 0;
  
  if (hasCoverage) {
    switch (insurance.planType) {
      case 'Basic': coveragePercentage = 60; break;
      case 'Standard': coveragePercentage = 80; break;
      case 'Premium': coveragePercentage = 90; break;
      default: coveragePercentage = 0;
    }
  }
  
  const coveredPrice = parseFloat(originalPrice) * (coveragePercentage / 100);
  const coPayAmount = parseFloat(originalPrice) - coveredPrice;
  
  return {
    originalPrice: originalPrice,
    coveredPrice: coveredPrice.toFixed(6),
    coPayAmount: coPayAmount.toFixed(6),
    hasCoverage: hasCoverage
  };
};

// Check if a medication exists
export const isMedicationAvailable = async (medicationId) => {
  const medications = [
    'MED001', 'MED002', 'MED003', 'MED004', 'MED005'
  ];
  return medications.includes(medicationId);
};

// Get medication details
export const getMedicationDetails = async (medicationId) => {
  const medications = {
    'MED001': { name: 'Aspirin', price: '0.005' },
    'MED002': { name: 'Amoxicillin', price: '0.01' },
    'MED003': { name: 'Lipitor', price: '0.02' },
    'MED004': { name: 'Insulin', price: '0.025' },
    'MED005': { name: 'Ibuprofen', price: '0.004' }
  };
  
  if (!medications[medicationId]) {
    throw new Error('Medication not found');
  }
  
  return {
    id: medicationId,
    name: medications[medicationId].name,
    price: medications[medicationId].price
  };
};

// Purchase medication
export const purchaseMedication = async (medicationId, amount) => {
  try {
    // Direct transaction using MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const from = accounts[0];
    
    const tx = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: from,
        to: VERIFIED_ADDRESS,
        value: '0x' + (Number(amount) * 1e18).toString(16), // Convert ETH to wei and then to hex
      }]
    });
    
    // Store transaction in localStorage
    storeTransaction(
      tx,
      'Medication Purchase',
      { medicationId, amount }
    );
    
    // Return a simplified receipt object
    return {
      transactionHash: tx,
      status: 1 // Success
    };
  } catch (error) {
    console.error('Failed to purchase medication:', error);
    throw new Error(`Failed to purchase medication: ${error.message}`);
  }
};

// Get medication purchase history
export const getMedicationPurchaseHistory = async (address) => {
  const transactions = getTransactionHistory();
  return transactions
    .filter(tx => tx.type === 'Medication Purchase')
    .map(tx => {
      const medicationId = tx.details.medicationId;
      const medications = {
        'MED001': { name: 'Aspirin', price: '0.005' },
        'MED002': { name: 'Amoxicillin', price: '0.01' },
        'MED003': { name: 'Lipitor', price: '0.02' },
        'MED004': { name: 'Insulin', price: '0.025' },
        'MED005': { name: 'Ibuprofen', price: '0.004' }
      };
      
      const medication = medications[medicationId] || { name: 'Unknown', price: '0' };
      
      return {
        medicationId: medicationId,
        originalPrice: medication.price,
        coveredPrice: '0',
        coPayAmount: tx.details.amount,
        purchaseDate: new Date(tx.timestamp)
      };
    });
};