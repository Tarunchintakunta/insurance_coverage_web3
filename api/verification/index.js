// API route for medication coverage verification
const { ethers } = require('ethers');
require('dotenv').config();

// Helper function to calculate coverage based on insurance plan
function calculateCoverage(originalPrice, planType) {
  let coveragePercentage;
  
  switch (planType) {
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
  
  const covered = originalPrice.mul(coveragePercentage).div(100);
  const coPay = originalPrice.sub(covered);
  
  return {
    originalPrice,
    coveredPrice: covered,
    coPayAmount: coPay,
    coveragePercentage
  };
}

module.exports = async (req, res) => {
  // Allow CORS for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    try {
      const { medicationId, userAddress, contractAddress } = req.body;
      
      if (!medicationId || !userAddress || !contractAddress) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters'
        });
      }
      
      // In a real application, this would use the blockchain contract
      // to get actual coverage data. For this demo, we'll simulate it.
      
      // Simulate medication data
      const medications = {
        'MED001': { price: ethers.utils.parseEther('0.005') },
        'MED002': { price: ethers.utils.parseEther('0.01') },
        'MED003': { price: ethers.utils.parseEther('0.02') },
        'MED004': { price: ethers.utils.parseEther('0.025') },
        'MED005': { price: ethers.utils.parseEther('0.004') }
      };
      
      // Simulate user insurance data (would come from the blockchain)
      // For demo purposes, we'll assume the user has Standard insurance
      const userInsurance = {
        planType: 'Standard',
        isActive: true
      };
      
      if (!medications[medicationId]) {
        return res.status(404).json({
          success: false,
          error: 'Medication not found'
        });
      }
      
      const originalPrice = medications[medicationId].price;
      
      let coverage;
      if (userInsurance.isActive) {
        coverage = calculateCoverage(originalPrice, userInsurance.planType);
      } else {
        coverage = {
          originalPrice,
          coveredPrice: ethers.BigNumber.from(0),
          coPayAmount: originalPrice,
          coveragePercentage: 0
        };
      }
      
      return res.status(200).json({
        success: true,
        coverage: {
          originalPrice: ethers.utils.formatEther(coverage.originalPrice),
          coveredPrice: ethers.utils.formatEther(coverage.coveredPrice),
          coPayAmount: ethers.utils.formatEther(coverage.coPayAmount),
          coveragePercentage: coverage.coveragePercentage,
          hasCoverage: userInsurance.isActive
        }
      });
    } catch (error) {
      console.error('Error in verification:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};