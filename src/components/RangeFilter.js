import React from 'react';
import './RangeFilter.css';

const RangeFilter = ({ label, min, max, step, values, category, setPreferences, setReasoningChain }) => {
  const handleMinChange = (e) => {
    const newValue = parseFloat(e.target.value);
    
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        min: newValue,
        // Ensure max is not less than min
        max: Math.max(prev[category].max, newValue)
      }
    }));

    // Add reasoning step for manual preference update
    setReasoningChain(prev => [
      ...prev, 
      { 
        step: 'Manual Preference Update', 
        content: `User manually updated ${category} minimum to ${newValue}` 
      }
    ]);
  };

  const handleMaxChange = (e) => {
    const newValue = parseFloat(e.target.value);
    
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        // Ensure min is not greater than max
        min: Math.min(prev[category].min, newValue),
        max: newValue
      }
    }));

    // Add reasoning step for manual preference update
    setReasoningChain(prev => [
      ...prev, 
      { 
        step: 'Manual Preference Update', 
        content: `User manually updated ${category} maximum to ${newValue}` 
      }
    ]);
  };

  return (
    <div className="range-filter">
      <label>{label}</label>
      <div className="range-values">
        <span>{values.min}</span>
        <span>{values.max}</span>
      </div>
      <div className="range-sliders">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={values.min}
          onChange={handleMinChange}
          className="range-slider min-slider"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={values.max}
          onChange={handleMaxChange}
          className="range-slider max-slider"
        />
      </div>
    </div>
  );
};

export default RangeFilter;
