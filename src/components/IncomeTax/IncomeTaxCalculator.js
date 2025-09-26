import { useState } from 'react';
import './IncomeTaxCalculator.css';

const IncomeTaxCalculator = () => {
  const [income, setIncome] = useState('');
  const [personalRelief, setPersonalRelief] = useState(9000);
  const [spouseRelief, setSpouseRelief] = useState(0);
  const [childRelief, setChildRelief] = useState(0);
  const [educationRelief, setEducationRelief] = useState(0);
  const [epfRelief, setEpfRelief] = useState(0);
  const [results, setResults] = useState(null);

  const taxBrackets = [
    { min: 0, max: 5000, rate: 0 },
    { min: 5001, max: 20000, rate: 1 },
    { min: 20001, max: 35000, rate: 3 },
    { min: 35001, max: 50000, rate: 6 },
    { min: 50001, max: 70000, rate: 11 },
    { min: 70001, max: 100000, rate: 19 },
    { min: 100001, max: 400000, rate: 25 },
    { min: 400001, max: 600000, rate: 26 },
    { min: 600001, max: 2000000, rate: 28 },
    { min: 2000001, max: Infinity, rate: 30 }
  ];

  const calculateTax = () => {
    const grossIncome = parseFloat(income) || 0;
    const totalRelief = personalRelief + spouseRelief + (childRelief * 2000) + educationRelief + epfRelief;
    const taxableIncome = Math.max(0, grossIncome - totalRelief);
    
    let tax = 0;
    let breakdownData = [];
    
    for (const bracket of taxBrackets) {
      if (taxableIncome > bracket.min - 1) {
        const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min + 1;
        const taxInBracket = (taxableInBracket * bracket.rate) / 100;
        
        if (taxInBracket > 0) {
          tax += taxInBracket;
          breakdownData.push({
            range: bracket.max === Infinity ? `RM ${bracket.min.toLocaleString()}+` : `RM ${bracket.min.toLocaleString()} - RM ${bracket.max.toLocaleString()}`,
            rate: bracket.rate,
            taxableAmount: taxableInBracket,
            taxAmount: taxInBracket
          });
        }
      }
    }

    const netIncome = grossIncome - tax;
    const effectiveRate = grossIncome > 0 ? (tax / grossIncome) * 100 : 0;
    const marginalRate = taxBrackets.find(bracket => 
      taxableIncome >= bracket.min - 1 && taxableIncome <= bracket.max
    )?.rate || 0;

    setResults({
      grossIncome,
      totalRelief,
      taxableIncome,
      tax,
      netIncome,
      effectiveRate,
      marginalRate,
      breakdown: breakdownData
    });
  };

  const handleReset = () => {
    setIncome('');
    setPersonalRelief(9000);
    setSpouseRelief(0);
    setChildRelief(0);
    setEducationRelief(0);
    setEpfRelief(0);
    setResults(null);
  };

  return (
    <div className="income-tax-container">
      <div className="tax-header">
        <h1>🇲🇾 Malaysia Income Tax Calculator 2025</h1>
        <p>Calculate your Malaysian income tax liability for Assessment Year 2025</p>
      </div>

      <div className="tax-content">
        <div className="tax-input-section">
          <div className="input-card">
            <h2>Income Information</h2>
            <div className="input-group">
              <label>Annual Gross Income (RM)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter your annual income"
                className="income-input"
              />
            </div>
          </div>

          <div className="input-card">
            <h2>Tax Relief</h2>
            <div className="relief-grid">
              <div className="input-group">
                <label>Personal Relief (RM)</label>
                <input
                  type="number"
                  value={personalRelief}
                  onChange={(e) => setPersonalRelief(parseFloat(e.target.value) || 0)}
                  placeholder="9000"
                />
              </div>
              <div className="input-group">
                <label>Spouse Relief (RM)</label>
                <input
                  type="number"
                  value={spouseRelief}
                  onChange={(e) => setSpouseRelief(parseFloat(e.target.value) || 0)}
                  placeholder="4000"
                />
              </div>
              <div className="input-group">
                <label>Number of Children</label>
                <input
                  type="number"
                  value={childRelief}
                  onChange={(e) => setChildRelief(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div className="input-group">
                <label>Education Relief (RM)</label>
                <input
                  type="number"
                  value={educationRelief}
                  onChange={(e) => setEducationRelief(parseFloat(e.target.value) || 0)}
                  placeholder="7000"
                />
              </div>
              <div className="input-group">
                <label>EPF Relief (RM)</label>
                <input
                  type="number"
                  value={epfRelief}
                  onChange={(e) => setEpfRelief(parseFloat(e.target.value) || 0)}
                  placeholder="4000"
                />
              </div>
            </div>
          </div>

          <div className="button-group">
            <button onClick={calculateTax} className="calculate-btn">
              Calculate Tax
            </button>
            <button onClick={handleReset} className="reset-btn">
              Reset
            </button>
          </div>
        </div>

        <div className="tax-results-section">
          {results && (
            <div className="results-card">
              <h2>Tax Calculation Results</h2>
              
              <div className="results-summary">
                <div className="summary-item">
                  <span className="label">Gross Income:</span>
                  <span className="value">RM {results.grossIncome.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Total Relief:</span>
                  <span className="value relief">-RM {results.totalRelief.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Taxable Income:</span>
                  <span className="value">RM {results.taxableIncome.toLocaleString()}</span>
                </div>
                <div className="summary-item highlight">
                  <span className="label">Tax Payable:</span>
                  <span className="value tax">RM {results.tax.toFixed(2)}</span>
                </div>
                <div className="summary-item highlight">
                  <span className="label">Net Income:</span>
                  <span className="value net">RM {results.netIncome.toFixed(2)}</span>
                </div>
              </div>

              <div className="tax-rates">
                <div className="rate-item">
                  <span className="rate-label">Effective Tax Rate:</span>
                  <span className="rate-value">{results.effectiveRate.toFixed(2)}%</span>
                </div>
                <div className="rate-item">
                  <span className="rate-label">Marginal Tax Rate:</span>
                  <span className="rate-value">{results.marginalRate}%</span>
                </div>
              </div>

              {results.breakdown.length > 0 && (
                <div className="tax-breakdown">
                  <h3>Tax Breakdown by Bracket</h3>
                  <div className="breakdown-table">
                    <div className="breakdown-header">
                      <span>Income Range</span>
                      <span>Rate</span>
                      <span>Taxable Amount</span>
                      <span>Tax</span>
                    </div>
                    {results.breakdown.map((bracket, index) => (
                      <div key={index} className="breakdown-row">
                        <span>{bracket.range}</span>
                        <span>{bracket.rate}%</span>
                        <span>RM {bracket.taxableAmount.toFixed(0)}</span>
                        <span>RM {bracket.taxAmount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="tax-brackets-info">
            <h3>Malaysia Tax Brackets 2025</h3>
            <div className="brackets-table">
              <div className="brackets-header">
                <span>Income Range (RM)</span>
                <span>Tax Rate</span>
              </div>
              {taxBrackets.map((bracket, index) => (
                <div key={index} className="brackets-row">
                  <span>
                    {bracket.min === 0 ? '0' : bracket.min.toLocaleString()} - {' '}
                    {bracket.max === Infinity ? '2,000,000+' : bracket.max.toLocaleString()}
                  </span>
                  <span>{bracket.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeTaxCalculator;