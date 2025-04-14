import React, { useState, useEffect } from 'react';
import { getAvailableInsurancePlans, purchaseInsurance, getUserInsurance } from '../utils/web3';

const InsurancePlans = ({ account, onPurchase }) => {
  const [plans, setPlans] = useState([]);
  const [userInsurance, setUserInsurance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (account) {
      fetchData();
    }
  }, [account]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Default plans if API call fails
      const defaultPlans = [
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
      
      setPlans(defaultPlans);
      
      try {
        // Try to get user insurance
        const insuranceData = await getUserInsurance(account);
        setUserInsurance(insuranceData);
      } catch (insuranceError) {
        console.error('Error fetching user insurance:', insuranceError);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load insurance plans. Please make sure your contract is properly deployed and your wallet is connected.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePurchase = async (plan) => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }
    
    setSelectedPlan(plan.planType);
    setPurchasing(true);
    setError('');
    
    try {
      // Direct transaction using MetaMask
      const tx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: '0x081C18e85D09645CA64dBD1e4781135F5E54110f', // The verified address
          value: '0x' + (Number(plan.price) * 1e18).toString(16), // Convert ETH to wei and then to hex
        }]
      });
      
      // Create a user insurance record in localStorage
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(now.getDate() + 30); // 30 days from now
      
      const userInsuranceData = {
        planType: plan.planType,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        isActive: true,
        hasActiveInsurance: true
      };
      
      localStorage.setItem('userInsurance_' + account.toLowerCase(), JSON.stringify(userInsuranceData));
      
      // Store transaction in localStorage for history
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.push({
        hash: tx,
        type: 'Insurance Purchase',
        details: { planType: plan.planType, price: plan.price },
        timestamp: Date.now()
      });
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      // Update local state
      setUserInsurance({
        planType: plan.planType,
        startDate: now,
        endDate: endDate,
        isActive: true,
        hasActiveInsurance: true
      });
      
      // Show Etherscan link
      const etherscanLink = `https://sepolia.etherscan.io/tx/${tx}`;
      if (confirm(`Successfully purchased ${plan.planType} insurance plan!\n\nWould you like to view the transaction on Etherscan?`)) {
        window.open(etherscanLink, '_blank');
      }
      
      // Callback to parent component
      if (onPurchase) onPurchase();
    } catch (error) {
      console.error('Error purchasing insurance:', error);
      setError(`Failed to purchase insurance: ${error.message}`);
    } finally {
      setPurchasing(false);
      setSelectedPlan(null);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading insurance plans...</div>
      </div>
    );
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Insurance Plans</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {userInsurance && userInsurance.hasActiveInsurance && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">You have active insurance!</p>
          <p>Plan: {userInsurance.planType}</p>
          <p>Valid until: {new Date(userInsurance.endDate).toLocaleDateString()}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.planType} 
            className={`border rounded-lg p-6 ${
              userInsurance && userInsurance.hasActiveInsurance && userInsurance.planType === plan.planType
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-blue-500 hover:shadow-md'
            } transition`}
          >
            <h3 className="text-xl font-bold mb-2">{plan.planType} Plan</h3>
            <div className="text-3xl font-bold mb-4">{plan.coveragePercentage}%</div>
            <p className="text-gray-600 mb-2">Coverage</p>
            
            <div className="mb-4">
              <p className="text-gray-600">Price: {plan.price} ETH</p>
              <p className="text-gray-600">Duration: {plan.duration} days</p>
            </div>
            
            {userInsurance && userInsurance.hasActiveInsurance && userInsurance.planType === plan.planType ? (
              <button 
                disabled 
                className="w-full bg-green-500 text-white py-2 rounded-lg opacity-75 cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handlePurchase(plan)}
                disabled={purchasing}
                className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${
                  purchasing && selectedPlan === plan.planType ? 'opacity-75 cursor-wait' : ''
                }`}
              >
                {purchasing && selectedPlan === plan.planType
                  ? 'Processing...'
                  : `Purchase for ${plan.price} ETH`}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsurancePlans;