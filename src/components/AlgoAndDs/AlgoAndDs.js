import React, { useState, useEffect } from 'react'; // Add useEffect
import './AlgoAndDs.css';
import Navbar from '../Navbar'; // Import Navbar component
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const AdvancedConcepts = () => {
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [bitArray, setBitArray] = useState(Array(20).fill(0)); // Bit array size remains 20
  const [inputValue, setInputValue] = useState('');
  const [recordCount, setRecordCount] = useState(0); // Track the number of records added
  const [showWhenToUseDialog, setShowWhenToUseDialog] = useState(false); // State for "When to Use" dialog
  const [showFormulaDialog, setShowFormulaDialog] = useState({ type: null, visible: false }); // State for formula dialogs

  const maxRecords = 10; // Maximum records allowed

  const hashFunctions = [
    (str) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0) * 31, 0) % 20,
    (str) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0) * 17, 0) % 20,
    (str) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0) * 13, 0) % 20,
    (str) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0) * 7, 0) % 20,
    (str) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0) * 3, 0) % 20,
  ];

  const coffeeNames = ['Espresso', 'Latte', 'Cappuccino', 'Americano', 'Mocha', 'Macchiato', 'Flat White', 'Ristretto', 'Affogato', 'Irish Coffee'];

  const handleCardClick = (concept) => {
    setSelectedConcept(concept);
  };

  const closeModal = () => {
    setSelectedConcept(null);
  };

  const handleAddToBloomFilter = () => {
    if (recordCount >= maxRecords) {
      toast.error('Maximum record limit reached!');
      return;
    }

    const newBitArray = [...bitArray];
    hashFunctions.forEach((hashFn) => {
      const index = hashFn(inputValue);
      newBitArray[index] = 1;
    });
    setBitArray(newBitArray);
    setRecordCount(recordCount + 1); // Increment the record count
    setInputValue('');
    toast.success(`The element "${inputValue}" added to Bloom Filter!`);
  };

  const handleCheckExistence = () => {
    const exists = hashFunctions.every((hashFn) => {
      const index = hashFn(inputValue);
      return bitArray[index] === 1;
    });

    if (exists) {
      toast.success(`The element "${inputValue}" exists in the set!`);
    } else {
      toast.error(`The element "${inputValue}" does not exist in the set.`);
    }
  };

  const openFormulaDialog = (type) => {
    setShowFormulaDialog({ type, visible: true });
  };

  const closeFormulaDialog = () => {
    setShowFormulaDialog({ type: null, visible: false });
  };

  const renderFormulaContent = () => {
    switch (showFormulaDialog.type) {
      case 'falsePositive':
        return (
          <div className="modal-body">
            <h3 className="text-primary">False Positive Probability Formula</h3>
            <p className="text-muted">P = (1 - e^(-k * n / m))^k</p>
            <p><strong>Where:</strong></p>
            <ul className="list-group">
              <li className="list-group-item">P = False positive probability</li>
              <li className="list-group-item">k = Number of hash functions</li>
              <li className="list-group-item">n = Number of inserted elements</li>
              <li className="list-group-item">m = Number of bits in the Bloom Filter</li>
            </ul>
          </div>
        );
      case 'requiredBits':
        return (
          <div className="modal-body">
            <h3 className="text-primary">Required Bits Formula</h3>
            <p className="text-muted">m = -(n * ln(p)) / (ln(2)^2)</p>
            <p><strong>Where:</strong></p>
            <ul className="list-group">
              <li className="list-group-item">m = Number of bits required</li>
              <li className="list-group-item">n = Number of elements to store</li>
              <li className="list-group-item">p = Desired false positive probability</li>
            </ul>
          </div>
        );
      case 'optimalHash':
        return (
          <div className="modal-body">
            <h3 className="text-primary">Optimal Hash Functions Formula</h3>
            <p className="text-muted">k = (m / n) * ln(2)</p>
            <p><strong>Where:</strong></p>
            <ul className="list-group">
              <li className="list-group-item">k = Optimal number of hash functions</li>
              <li className="list-group-item">m = Number of bits in the Bloom Filter</li>
              <li className="list-group-item">n = Number of elements to store</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowFormulaDialog({ type: null, visible: false }); // Close formula dialog
        setShowWhenToUseDialog(false); // Close "When to Use" dialog
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="advanced-concepts-container">
      <Navbar /> {/* Ensure Navbar is included */}
      <h1>Algorithms & Data Structure</h1>
      <div className="concepts-grid">
        <div
          className="concept-card"
          onClick={() => handleCardClick('Bloom Filter')}
        >
          <h2>Bloom Filter</h2>
          <p>Efficiently checks if an item is likely in a set before performing expensive operations. May have false positives but no false negatives.</p>
        </div>
      </div>
      {selectedConcept === 'Bloom Filter' && (
        <div className="modal">
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} /> {/* Toast container moved here */}
          <div className="modal-content large-modal"> {/* Add large-modal class */}
            <h2>Bloom Filter</h2>
            <p>
              A Bloom Filter is a space-efficient probabilistic data structure used to test whether an element is a member of a set. It may have false positives but no false negatives.
            </p>
            <div className="bloom-filter-info">
              <div className="info-row">
                <div className="info-card">
                  <h3>Current Status</h3>
                  <p>{recordCount}/{maxRecords}</p>
                </div>
                <div className="info-card">
                  <h3>False Positive Probability</h3>
                  <p>~26%</p>
                </div>
                <div className="info-card" onClick={() => setShowWhenToUseDialog(true)} style={{ cursor: 'pointer' }}>
                  <h3>When to Use</h3>
                  <p>Click to learn more <span className="pulse-indicator"></span></p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-card" onClick={() => openFormulaDialog('falsePositive')} style={{ cursor: 'pointer' }}>
                  <h3>False Positive Probability Formula</h3>
                  <p>Click to learn more <span className="pulse-indicator"></span></p>
                </div>
                <div className="info-card" onClick={() => openFormulaDialog('requiredBits')} style={{ cursor: 'pointer' }}>
                  <h3>Required Bits Formula</h3>
                  <p>Click to learn more <span className="pulse-indicator"></span></p>
                </div>
                <div className="info-card" onClick={() => openFormulaDialog('optimalHash')} style={{ cursor: 'pointer' }}>
                  <h3>Optimal Hash Functions Formula</h3>
                  <p>Click to learn more <span className="pulse-indicator"></span></p>
                </div>
              </div>
            </div>
            <div className="bloom-filter-ui">
              <div className="bit-array">
                {bitArray.map((bit, index) => (
                  <div key={index} className={`bit-card ${bit === 1 ? 'active' : ''}`}>
                    {bit}
                  </div>
                ))}
              </div>
              <div className="bloom-filter-controls">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter coffee name" // Updated placeholder
                />
                <div className="chip-container">
                  {coffeeNames.map((name) => (
                    <button
                      key={name}
                      className="chip"
                      onClick={() => setInputValue(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                <div className="button-row">
                  <button onClick={handleAddToBloomFilter}>Add to Bloom Filter</button>
                  <button onClick={handleCheckExistence}>Check if Exist in Set</button>
                </div>
              </div>
            </div>
            <button className="close-button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
      {showFormulaDialog.visible && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Formula Details</h5>
                <button type="button" className="btn-close" onClick={closeFormulaDialog}></button>
              </div>
              {renderFormulaContent()}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeFormulaDialog}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showWhenToUseDialog && (
        <div className="modal">
          <div className="modal-content">
            <h2>When to Use</h2>
            <table className="usage-table">
              <thead>
                <tr>
                  <th>Python Set / Dict</th>
                  <th>Bloom Filter</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>✅ 100% accuracy — no false positives</td>
                  <td>✅ Much smaller memory footprint</td>
                </tr>
                <tr>
                  <td>✅ Fast lookup (O(1) on average)</td>
                  <td>✅ Perfect for read-heavy, append-only, or network-bound systems</td>
                </tr>
                <tr>
                  <td>✅ Simple to implement</td>
                  <td>✅ Used where you can tolerate false positives, but never false negatives</td>
                </tr>
                <tr>
                  <td>❌ Memory heavy — every entry stores the entire key</td>
                  <td>✅ Examples:</td>
                </tr>
                <tr>
                  <td>❌ Not ideal for constrained memory or huge datasets</td>
                  <td>- Caches (avoid checking slow storage if item not present)</td>
                </tr>
                <tr>
                  <td>❌ Can't handle "probably in the set" use cases</td>
                  <td>- Spam filters</td>
                </tr>
                <tr>
                  <td></td>
                  <td>- Distributed systems (e.g. Bigtable, Cassandra, HBase)</td>
                </tr>
                <tr>
                  <td></td>
                  <td>- Blockchain transaction filters</td>
                </tr>
              </tbody>
            </table>
            <button className="close-button" onClick={() => setShowWhenToUseDialog(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedConcepts;