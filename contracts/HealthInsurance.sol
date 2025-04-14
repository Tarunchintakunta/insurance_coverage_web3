// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title HealthInsurance
 * @dev Smart contract for decentralized health insurance with medication coverage
 */
contract HealthInsurance {
    address public owner;
    address public verifiedAddress;
    
    // Insurance plan details
    struct InsurancePlan {
        string planType;
        uint256 coveragePercentage;
        uint256 price;
        uint256 duration; // in days
        bool isActive;
    }
    
    // Medication details
    struct Medication {
        string medicationId;
        string name;
        uint256 originalPrice;
        bool exists;
    }
    
    // User insurance details
    struct UserInsurance {
        string planType;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
    }
    
    // Records of medication purchases
    struct MedicationPurchase {
        string medicationId;
        uint256 originalPrice;
        uint256 coveredPrice;
        uint256 coPayAmount;
        uint256 purchaseDate;
    }
    
    // Mapping to store all available insurance plans
    mapping(string => InsurancePlan) public insurancePlans;
    
    // Mapping to store all medications
    mapping(string => Medication) public medications;
    
    // Mapping to store user's insurance
    mapping(address => UserInsurance) public userInsurances;
    
    // Mapping to store user's medication purchase history
    mapping(address => MedicationPurchase[]) public medicationPurchaseHistory;
    
    // Events
    event InsurancePurchased(address indexed user, string planType, uint256 startDate, uint256 endDate);
    event MedicationPurchased(address indexed user, string medicationId, uint256 coveredPrice, uint256 coPayAmount);
    event InsurancePlanAdded(string planType, uint256 coveragePercentage, uint256 price, uint256 duration);
    event MedicationAdded(string medicationId, string name, uint256 originalPrice);
    
    constructor(address _verifiedAddress) {
        owner = msg.sender;
        verifiedAddress = _verifiedAddress;
        
        // Initialize with some default plans
        _addInsurancePlan("Basic", 60, 0.01 ether, 30 days);
        _addInsurancePlan("Standard", 80, 0.02 ether, 30 days);
        _addInsurancePlan("Premium", 90, 0.03 ether, 30 days);
        
        // Initialize with some default medications
        _addMedication("MED001", "Aspirin", 0.005 ether);
        _addMedication("MED002", "Amoxicillin", 0.01 ether);
        _addMedication("MED003", "Lipitor", 0.02 ether);
        _addMedication("MED004", "Insulin", 0.025 ether);
        _addMedication("MED005", "Ibuprofen", 0.004 ether);
    }
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier medicationExists(string memory medicationId) {
        require(medications[medicationId].exists, "Medication does not exist");
        _;
    }
    
    // Function to add a new insurance plan (admin only)
    function _addInsurancePlan(
        string memory planType,
        uint256 coveragePercentage,
        uint256 price,
        uint256 duration
    ) private {
        insurancePlans[planType] = InsurancePlan(
            planType,
            coveragePercentage,
            price,
            duration,
            true
        );
        
        emit InsurancePlanAdded(planType, coveragePercentage, price, duration);
    }
    
    // Public function to add insurance plan (admin only)
    function addInsurancePlan(
        string memory planType,
        uint256 coveragePercentage,
        uint256 price,
        uint256 duration
    ) external onlyOwner {
        _addInsurancePlan(planType, coveragePercentage, price, duration);
    }
    
    // Function to add a new medication (admin only)
    function _addMedication(
        string memory medicationId,
        string memory name,
        uint256 originalPrice
    ) private {
        medications[medicationId] = Medication(
            medicationId,
            name,
            originalPrice,
            true
        );
        
        emit MedicationAdded(medicationId, name, originalPrice);
    }
    
    // Public function to add medication (admin only)
    function addMedication(
        string memory medicationId,
        string memory name,
        uint256 originalPrice
    ) external onlyOwner {
        _addMedication(medicationId, name, originalPrice);
    }
    
    // Function to purchase insurance
    function purchaseInsurance(string memory planType) external payable {
        InsurancePlan memory plan = insurancePlans[planType];
        require(plan.isActive, "Insurance plan does not exist or is not active");
        require(msg.value >= plan.price, "Insufficient payment for insurance plan");
        
        // Transfer payment to verified address
        (bool success, ) = verifiedAddress.call{value: msg.value}("");
        require(success, "Transfer failed");
        
        // Set user's insurance plan
        userInsurances[msg.sender] = UserInsurance(
            planType,
            block.timestamp,
            block.timestamp + plan.duration,
            true
        );
        
        emit InsurancePurchased(msg.sender, planType, block.timestamp, block.timestamp + plan.duration);
    }
    
    // Function to check medication coverage for a user
    function getMedicationCoverage(string memory medicationId, address user) 
        external 
        view 
        medicationExists(medicationId)
        returns (
            uint256 originalPrice,
            uint256 coveredPrice,
            uint256 coPayAmount,
            bool hasCoverage
        ) 
    {
        UserInsurance memory userInsurance = userInsurances[user];
        Medication memory medication = medications[medicationId];
        
        // Check if user has active insurance
        bool hasActiveInsurance = userInsurance.isActive && 
                                 userInsurance.endDate >= block.timestamp;
        
        if (!hasActiveInsurance) {
            return (
                medication.originalPrice,
                medication.originalPrice,
                medication.originalPrice,
                false
            );
        }
        
        // Get insurance coverage percentage
        uint256 coveragePercentage = insurancePlans[userInsurance.planType].coveragePercentage;
        
        // Calculate covered price and co-pay
        uint256 covered = (medication.originalPrice * coveragePercentage) / 100;
        uint256 coPay = medication.originalPrice - covered;
        
        return (
            medication.originalPrice,
            covered,
            coPay,
            true
        );
    }
    
    // Function to get user's insurance details
    function getUserInsurance(address user) external view returns (
        string memory planType,
        uint256 startDate,
        uint256 endDate,
        bool isActive,
        bool hasActiveInsurance
    ) {
        UserInsurance memory userInsurance = userInsurances[user];
        
        bool activeInsurance = userInsurance.isActive && 
                              userInsurance.endDate >= block.timestamp;
        
        return (
            userInsurance.planType,
            userInsurance.startDate,
            userInsurance.endDate,
            userInsurance.isActive,
            activeInsurance
        );
    }
    
    // Function to purchase medication with insurance
    function purchaseMedication(string memory medicationId) external payable medicationExists(medicationId) {
        UserInsurance memory userInsurance = userInsurances[msg.sender];
        
        // Check if user has active insurance
        bool hasActiveInsurance = userInsurance.isActive && 
                                 userInsurance.endDate >= block.timestamp;
        
        Medication memory medication = medications[medicationId];
        uint256 paymentAmount;
        uint256 coPayAmount;
        
        if (hasActiveInsurance) {
            // Calculate coverage based on insurance plan
            uint256 coveragePercentage = insurancePlans[userInsurance.planType].coveragePercentage;
            uint256 covered = (medication.originalPrice * coveragePercentage) / 100;
            coPayAmount = medication.originalPrice - covered;
            paymentAmount = coPayAmount;
        } else {
            // Full price if no insurance
            paymentAmount = medication.originalPrice;
            coPayAmount = medication.originalPrice;
        }
        
        require(msg.value >= paymentAmount, "Insufficient payment for medication");
        
        // Transfer payment to verified address
        (bool success, ) = verifiedAddress.call{value: msg.value}("");
        require(success, "Transfer failed");
        
        // Record the purchase
        medicationPurchaseHistory[msg.sender].push(
            MedicationPurchase(
                medicationId,
                medication.originalPrice,
                medication.originalPrice - coPayAmount,
                coPayAmount,
                block.timestamp
            )
        );
        
        emit MedicationPurchased(msg.sender, medicationId, medication.originalPrice - coPayAmount, coPayAmount);
    }
    
    // Function to get user's medication purchase history
    function getMedicationPurchaseHistory(address user) external view returns (MedicationPurchase[] memory) {
        return medicationPurchaseHistory[user];
    }
    
    // Get available insurance plans (returns three plans for simplicity)
    function getAvailableInsurancePlans() external view returns (
        InsurancePlan memory basic,
        InsurancePlan memory standard,
        InsurancePlan memory premium
    ) {
        return (
            insurancePlans["Basic"],
            insurancePlans["Standard"],
            insurancePlans["Premium"]
        );
    }
    
    // Function to check if a medication exists
    function isMedicationAvailable(string memory medicationId) external view returns (bool) {
        return medications[medicationId].exists;
    }
    
    // Function to get medication details
    function getMedicationDetails(string memory medicationId) external view 
        medicationExists(medicationId) 
        returns (
            string memory id,
            string memory name,
            uint256 price
        ) 
    {
        Medication memory medication = medications[medicationId];
        return (
            medication.medicationId,
            medication.name,
            medication.originalPrice
        );
    }
}