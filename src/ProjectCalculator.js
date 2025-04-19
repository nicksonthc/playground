import React, { useState, useEffect, useCallback } from 'react';
import './Home.css'; // For navbar styling
import './components/ProjectCalculator/ProjectCalculator.css'; // For styling
import Navbar from './components/Navbar'; // Import the Navbar component

function ProjectCalculator() {
  // State for input values
  const [formData, setFormData] = useState({
    headcount: 1,
    engineeringDays: 20,
    averageMonthlyCost: 5000,
    onsiteCost: 2000,
    supportPeriod: 3,
    profitMargin: 30 // Percentage
  });

  // State for hardware items
  const [hardwareItems, setHardwareItems] = useState([]);

  // State for calculated results
  const [results, setResults] = useState({
    resourceCost: 0,
    onsiteAndSupportCost: 0,
    hardwareCost: 0,
    totalCost: 0,
    quotationAmount: 0
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Remove leading zeros for number inputs
    const cleanedValue = value.replace(/^0+(?=\d)/, '');
    
    setFormData(prevData => ({
      ...prevData,
      [name]: parseFloat(cleanedValue) || 0
    }));
    
    // If the field is emptied, set to "0" to avoid input field showing empty
    if (value === '') {
      e.target.value = '0';
    } else {
      // Ensure the input field shows the value without leading zeros
      e.target.value = cleanedValue;
    }
  };

  // Handle hardware item changes
  const handleHardwareChange = (index, field, value) => {
    const updatedHardwareItems = [...hardwareItems];
    if (field === 'qty' || field === 'cost') {
      // Remove leading zeros for number inputs
      const cleanedValue = value.replace(/^0+(?=\d)/, '');
      updatedHardwareItems[index][field] = parseFloat(cleanedValue) || 0;
    } else {
      updatedHardwareItems[index][field] = value;
    }
    setHardwareItems(updatedHardwareItems);
  };

  // Add a new hardware item
  const addHardwareItem = () => {
    setHardwareItems([...hardwareItems, { name: '', cost: 0, qty: 1 }]);
  };

  // Remove a hardware item
  const removeHardwareItem = (index) => {
    const updatedHardwareItems = hardwareItems.filter((_, i) => i !== index);
    setHardwareItems(updatedHardwareItems);
  };

  // Calculate project costs whenever form data or hardware items change
  const calculateProjectCost = useCallback(() => {
    // Calculate months required
    const monthsRequired = formData.engineeringDays / 20;
    
    // Calculate resource cost
    const resourceCost = formData.headcount * formData.averageMonthlyCost * monthsRequired;
    
    // Calculate Onsite,OT and Allowance cost
    const onsiteAndSupportCost = formData.onsiteCost * formData.supportPeriod * formData.headcount;
    
    // Calculate total hardware cost
    const hardwareCost = hardwareItems.reduce((total, item) => total + (item.cost * item.qty), 0);
    
    // Calculate total cost
    const totalCost = resourceCost + onsiteAndSupportCost + hardwareCost;
    
    // Calculate quotation amount with profit margin
    const profitAmount = totalCost * (formData.profitMargin / 100);
    const quotationAmount = totalCost + profitAmount;
    
    // Update results
    setResults({
      resourceCost,
      onsiteAndSupportCost,
      hardwareCost,
      totalCost,
      quotationAmount
    });
  }, [formData, hardwareItems]);

  // Use the memoized function in useEffect
  useEffect(() => {
    calculateProjectCost();
  }, [calculateProjectCost]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(amount);
  };

return (
    <div className="home-container">
        <Navbar />

        <div className="calculator-container">
            <h1>Project Calculator</h1>
            <p className="calculator-description">
            Calculate project costs and generate quotations (including hardware costs).
            </p>

            <div className="calculator-form-container">
                <div className="calculator-form">
                    <div className="form-group">
                        <label htmlFor="headcount">Resource Headcount Required:</label>
                        <input
                            type="number"
                            id="headcount"
                            name="headcount"
                            value={formData.headcount}
                            onChange={handleInputChange}
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="engineeringDays">Engineering Days Required:</label>
                        <input
                            type="number"
                            id="engineeringDays"
                            name="engineeringDays"
                            value={formData.engineeringDays}
                            onChange={handleInputChange}
                            min="1"
                        />
                        <small>(20 working days = 1 month)</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="averageMonthlyCost">Average Resource Cost (RM) per Month:</label>
                        <input
                            type="number"
                            id="averageMonthlyCost"
                            name="averageMonthlyCost"
                            value={formData.averageMonthlyCost}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="onsiteCost">Onsite, Overtime and Allowance Cost (RM) per Month:</label>
                        <input
                            type="number"
                            id="onsiteCost"
                            name="onsiteCost"
                            value={formData.onsiteCost}
                            onChange={handleInputChange}
                            min="0"
                        />
                         <small>(Per Headcount Cost)</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="supportPeriod">Onsite, Overtime and Allowance Period Required (Months):</label>
                        <input
                            type="number"
                            id="supportPeriod"
                            name="supportPeriod"
                            value={formData.supportPeriod}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="profitMargin">Profit Margin (%):</label>
                        <input
                            type="number"
                            id="profitMargin"
                            name="profitMargin"
                            value={formData.profitMargin}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                        />
                        <small>(You can include overhead cost here)</small>
                    </div>

                    <div className="form-group">
                        <label>Hardware Costs:</label>
                        {hardwareItems.map((item, index) => (
                            <div key={index} className="hardware-item">
                                <div className="form-group">
                                    <label>Hardware Name:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter hardware name"
                                        value={item.name}
                                        onChange={(e) => handleHardwareChange(index, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cost (RM):</label>
                                    <input
                                        type="number"
                                        placeholder="Enter cost"
                                        value={item.cost}
                                        onChange={(e) => {
                                            const cleaned = e.target.value.replace(/^0+(?=\d)/, '') || '0';
                                            handleHardwareChange(index, 'cost', cleaned);
                                            e.target.value = cleaned; // Visually update the input field
                                          }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Quantity:</label>
                                    <input
                                        type="number"
                                        placeholder="Enter quantity"
                                        value={item.qty}
                                        onChange={(e) => {
                                            const cleaned = e.target.value.replace(/^0+(?=\d)/, '') || '0';
                                            handleHardwareChange(index, 'qty', cleaned);
                                            e.target.value = cleaned; // Visually update the input field
                                          }}
                                    />
                                </div>
                                <button 
                                    onClick={() => removeHardwareItem(index)} 
                                    className="modern-btn remove-btn"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button onClick={addHardwareItem} className="modern-btn add-btn">
                            + Add Hardware
                        </button>
                    </div>
                </div>

                <div className="calculator-results">
                    <h2>Project Quote Summary</h2>
                    <div className="result-item">
                        <span>Resource Cost:</span>
                        <span>{formatCurrency(results.resourceCost)}</span>
                    </div>
                    <div className="result-item">
                        <span>Onsite & Support Cost:</span>
                        <span>{formatCurrency(results.onsiteAndSupportCost)}</span>
                    </div>
                    <div className="result-item">
                        <span>Hardware Cost:</span>
                        <span>{formatCurrency(results.hardwareCost)}</span>
                    </div>
                    <div className="result-item total">
                        <span>Total Cost:</span>
                        <span>{formatCurrency(results.totalCost)}</span>
                    </div>
                    <div className="result-item">
                        <span>Profit ({formData.profitMargin}%):</span>
                        <span>{formatCurrency(results.quotationAmount - results.totalCost)}</span>
                    </div>
                    <div className="result-item quotation">
                        <span>Quotation Amount:</span>
                        <span>{formatCurrency(results.quotationAmount)}</span>
                    </div>
                    
                    <button className="print-btn" onClick={() => window.print()}>
                        Print Quotation
                    </button>
                </div>
            </div>
        </div>
    </div>
);
}

export default ProjectCalculator;
