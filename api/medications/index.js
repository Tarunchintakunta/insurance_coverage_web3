// API route for medications data
const { ethers } = require('ethers');
require('dotenv').config();

// This would typically be fetched from a database or external API in a real application
const medications = [
  {
    id: 'MED001',
    name: 'Aspirin',
    genericName: 'acetylsalicylic acid',
    category: 'Pain Relief',
    description: 'Used to treat pain, fever, and inflammation',
    originalPrice: ethers.utils.parseEther('0.005'),
    requiresPrescription: false
  },
  {
    id: 'MED002',
    name: 'Amoxicillin',
    genericName: 'amoxicillin',
    category: 'Antibiotics',
    description: 'Used to treat bacterial infections',
    originalPrice: ethers.utils.parseEther('0.01'),
    requiresPrescription: true
  },
  {
    id: 'MED003',
    name: 'Lipitor',
    genericName: 'atorvastatin',
    category: 'Cholesterol Control',
    description: 'Used to lower cholesterol levels',
    originalPrice: ethers.utils.parseEther('0.02'),
    requiresPrescription: true
  },
  {
    id: 'MED004',
    name: 'Insulin',
    genericName: 'insulin',
    category: 'Diabetes',
    description: 'Used to control blood sugar levels in diabetes',
    originalPrice: ethers.utils.parseEther('0.025'),
    requiresPrescription: true
  },
  {
    id: 'MED005',
    name: 'Ibuprofen',
    genericName: 'ibuprofen',
    category: 'Pain Relief',
    description: 'Used to reduce pain, fever, and inflammation',
    originalPrice: ethers.utils.parseEther('0.004'),
    requiresPrescription: false
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
    const { id, category, search } = req.query;
    
    let filteredMedications = [...medications];
    
    // Filter by ID
    if (id) {
      filteredMedications = filteredMedications.filter(
        med => med.id.toLowerCase() === id.toLowerCase()
      );
    }
    
    // Filter by category
    if (category) {
      filteredMedications = filteredMedications.filter(
        med => med.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Search by name or generic name
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMedications = filteredMedications.filter(
        med => med.name.toLowerCase().includes(searchLower) || 
               med.genericName.toLowerCase().includes(searchLower)
      );
    }
    
    // Format prices to be human-readable
    filteredMedications = filteredMedications.map(med => ({
      ...med,
      originalPrice: ethers.utils.formatEther(med.originalPrice)
    }));
    
    return res.status(200).json({
      success: true,
      medications: filteredMedications
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};