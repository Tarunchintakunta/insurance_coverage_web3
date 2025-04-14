// API route for insurance plans
const { ethers } = require('ethers');
require('dotenv').config();

// This would typically be fetched from a database in a real application
const insurancePlans = [
  {
    planType: 'Basic',
    coveragePercentage: 60,
    price: ethers.utils.parseEther('0.01'),
    duration: 30 * 24 * 60 * 60, // 30 days in seconds
    description: 'Basic coverage for essential medications',
    isActive: true
  },
  {
    planType: 'Standard',
    coveragePercentage: 80,
    price: ethers.utils.parseEther('0.02'),
    duration: 30 * 24 * 60 * 60, // 30 days in seconds
    description: 'Standard coverage for most medications',
    isActive: true
  },
  {
    planType: 'Premium',
    coveragePercentage: 90,
    price: ethers.utils.parseEther('0.03'),
    duration: 30 * 24 * 60 * 60, // 30 days in seconds
    description: 'Premium coverage for all medications including specialized treatments',
    isActive: true
  }
];

module.exports = (req, res) => {
  // Allow CORS for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    // Format prices to be human-readable
    const formattedPlans = insurancePlans.map(plan => ({
      ...plan,
      price: ethers.utils.formatEther(plan.price),
      duration: plan.duration / (24 * 60 * 60) // Convert seconds to days
    }));
    
    return res.status(200).json({
      success: true,
      plans: formattedPlans
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};