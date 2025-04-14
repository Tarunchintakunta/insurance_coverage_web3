import React, { useState, useEffect } from 'react';
import {
  getMedicationCoverage,
  getMedicationDetails,
  isMedicationAvailable,
  purchaseMedication,
  getUserInsurance,
  getTransactionHistory
} from '../utils/web3';

const MedicationVerification = ({ account }) => {
  const [medicationId, setMedicationId] = useState('');
  const [medicationDetails, setMedicationDetails] = useState(null);
  const [coverage, setCoverage] = useState(null);
  const [userInsurance, setUserInsurance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');
  
  // Predefined list of medications for demonstration
  const availableMedications = [
    { id: 'MED001', name: 'Aspirin' },
    { id: 'MED002', name: 'Amoxicillin' },
    { id: 'MED003', name: 'Lipitor' },
    { id: 'MED004', name: 'Insulin' },
    { id: 'MED005', name: 'Ibuprofen' }
  ];
  
  // Basic medication data as fallback
  const fallbackMedications = {
    'MED001': { name: 'Aspirin', price: '0.005' },
    'MED002': { name: 'Amoxicillin', price: '0.01' },
    'MED003': { name: 'Lipitor', price: '0.02' },
    'MED004': { name: 'Insulin', price: '0.025' },
    'MED005': { name: 'Ibuprofen', price: '0.004' }
  };
  
  useEffect(() => {
    if (account) {
      fetchUserInsurance();
      checkInsuranceFromTransactions();
    }
  }, [account]);
  
  // Check if user has insurance based on transaction history
  const checkInsuranceFromTransactions = () => {
    const transactions = getTransactionHistory();
    const insurancePurchases = transactions.filter(tx => tx.type === 'Insurance Purchase');
    
    if (insurancePurchases.length > 0) {
      // Sort by timestamp (most recent first)
      insurancePurchases.sort((a, b) => b.timestamp - a.timestamp);
      
      // Get the most recent insurance purchase
      const latestInsurance = insurancePurchases[0];
      
      // Create a user insurance object based on transaction data
      const planType = latestInsurance.details.planType;
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(now.getDate() + 30); // Assume 30 days duration
      
      setUserInsurance({
        planType: planType,
        startDate: new Date(latestInsurance.timestamp),
        endDate: endDate,
        isActive: true,
        hasActiveInsurance: true
      });
      
      return true;
    }
    
    return false;
  };
  
  const fetchUserInsurance = async () => {
    try {
      const insurance = await getUserInsurance(account);
      if (insurance && insurance.hasActiveInsurance) {
        setUserInsurance(insurance);
      } else {
        // If contract doesn't show active insurance, check transaction history
        if (!checkInsuranceFromTransactions()) {
          setUserInsurance({
            planType: '',
            startDate: new Date(),
            endDate: new Date(),
            isActive: false,
            hasActiveInsurance: false
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user insurance:', error);
      // Check transaction history if contract call fails
      if (!checkInsuranceFromTransactions()) {
        setUserInsurance({
          planType: '',
          startDate: new Date(),
          endDate: new Date(),
          isActive: false,
          hasActiveInsurance: false
        });
      }
    }
  };
  
  const handleMedicationSearch = async () => {
    if (!medicationId) {
      setError('Please enter a medication ID');
      return;
    }
    
    setLoading(true);
    setError('');
    setMedicationDetails(null);
    setCoverage(null);
    
    try {
      // Use fallback if the medication exists in our fallback list
      if (fallbackMedications[medicationId]) {
        try {
          // First try to check if medication exists in contract
          const exists = await isMedicationAvailable(medicationId);
          
          if (exists) {
            // Get medication details from contract
            const details = await getMedicationDetails(medicationId);
            setMedicationDetails(details);
            
            // Get coverage details from contract
            try {
              const coverageDetails = await getMedicationCoverage(medicationId, account);
              setCoverage(coverageDetails);
            } catch (coverageError) {
              console.error('Error getting coverage from contract:', coverageError);
              // Use fallback coverage calculation
              handleFallbackMedication(medicationId);
            }
          } else {
            // Use fallback data
            handleFallbackMedication(medicationId);
          }
        } catch (contractError) {
          console.error('Error checking medication in contract:', contractError);
          // Use fallback data
          handleFallbackMedication(medicationId);
        }
      } else {
        setError('Medication not found. Please try one of the available medications.');
      }
    } catch (error) {
      console.error('Error verifying medication:', error);
      setError(`Error: ${error.message}`);
      
      // Try to use fallback even on general error
      if (fallbackMedications[medicationId]) {
        handleFallbackMedication(medicationId);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleFallbackMedication = (medId) => {
    const fallbackMed = fallbackMedications[medId];
    if (!fallbackMed) return;
    
    // Set fallback medication details
    setMedicationDetails({
      id: medId,
      name: fallbackMed.name,
      price: fallbackMed.price
    });
    
    // Calculate coverage based on user insurance (if any)
    const hasCoverage = userInsurance && userInsurance.hasActiveInsurance;
    let coveragePercentage = 0;
    
    if (hasCoverage) {
      // Determine coverage percentage based on plan type
      switch(userInsurance.planType) {
        case 'Basic':
          coveragePercentage = 60;
          break;
        case 'Standard':
          coveragePercentage = 80;
          break;
        case 'Premium':
          coveragePercentage = 90;
          break;
        default:
          coveragePercentage = 0;
      }
    }
    
    const originalPrice = parseFloat(fallbackMed.price);
    const coveredAmount = originalPrice * (coveragePercentage / 100);
    const coPayAmount = originalPrice - coveredAmount;
    
    // Set fallback coverage
    setCoverage({
      originalPrice: fallbackMed.price,
      coveredPrice: hasCoverage ? coveredAmount.toFixed(6) : '0',
      coPayAmount: hasCoverage ? coPayAmount.toFixed(6) : fallbackMed.price,
      hasCoverage: hasCoverage
    });
  };
  
  const handlePurchase = async () => {
    if (!medicationDetails || !coverage) return;
    
    setPurchasing(true);
    try {
      // Use co-pay amount if covered, otherwise use original price
      const amount = coverage.hasCoverage ? coverage.coPayAmount : coverage.originalPrice;
      
      const receipt = await purchaseMedication(medicationId, amount);
      
      // Show success message with Etherscan link
      const txHash = receipt.transactionHash;
      const etherscanLink = `https://sepolia.etherscan.io/tx/${txHash}`;
      
      // Use a more complex confirmation to show the Etherscan link
      if (confirm(`Successfully purchased ${medicationDetails.name}!\n\nWould you like to view the transaction on Etherscan?`)) {
        window.open(etherscanLink, '_blank');
      }
      
      // Clear form
      setMedicationId('');
      setMedicationDetails(null);
      setCoverage(null);
    } catch (error) {
      console.error('Error purchasing medication:', error);
      setError(`Failed to purchase medication: ${error.message}`);
    } finally {
      setPurchasing(false);
    }
  };
  
  const selectMedication = (id) => {
    setMedicationId(id);
  };
  
  const renderInsuranceStatus = () => {
    // Check transactions first
    const transactions = getTransactionHistory();
    const insurancePurchases = transactions.filter(tx => tx.type === 'Insurance Purchase');
    
    if (insurancePurchases.length > 0 || (userInsurance && userInsurance.hasActiveInsurance)) {
      // Get the plan from either source
      const planType = userInsurance && userInsurance.hasActiveInsurance 
        ? userInsurance.planType 
        : (insurancePurchases.length > 0 ? insurancePurchases[0].details.planType : 'Unknown');
      
      return (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">You have active insurance!</p>
          <p>Plan: {planType}</p>
          <p>You'll receive coverage based on your plan when purchasing medications.</p>
        </div>
      );
    } else {
      return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">No Active Insurance</p>
          <p>You don't have an active insurance plan. You'll need to pay full price for medications.</p>
        </div>
      );
    }
  };
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Medication Coverage Verification</h2>
      
      {renderInsuranceStatus()}
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Available Medications (for demo)</label>
          <div className="flex flex-wrap gap-2">
            {availableMedications.map(med => (
              <button
                key={med.id}
                onClick={() => selectMedication(med.id)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm transition"
              >
                {med.name} ({med.id})
              </button>
            ))}
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
              value={medicationId}
              onChange={(e) => setMedicationId(e.target.value)}
              placeholder="Enter medication ID (e.g., MED001)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleMedicationSearch}
            disabled={loading || !medicationId}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Coverage'}
          </button>
        </div>
        
        {error && (
          <div className="text-red-600 mb-4">{error}</div>
        )}
      </div>
      
      {medicationDetails && coverage && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold mb-4">{medicationDetails.name} Coverage Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-600 mb-1">Medication ID:</p>
              <p className="font-medium">{medicationDetails.id}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Original Price:</p>
              <p className="font-medium">{coverage.originalPrice} ETH</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Covered Price:</p>
              <p className="font-medium">
                {coverage.hasCoverage 
                  ? `${coverage.coveredPrice} ETH (${Math.round((1 - (parseFloat(coverage.coPayAmount) / parseFloat(coverage.originalPrice))) * 100)}% coverage)` 
                  : '0 ETH (No coverage)'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Your Co-Pay:</p>
              <p className="font-medium text-xl text-blue-600">{coverage.coPayAmount} ETH</p>
            </div>
          </div>
          
          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {purchasing 
              ? 'Processing Purchase...' 
              : `Purchase for ${coverage.coPayAmount} ETH`}
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicationVerification;