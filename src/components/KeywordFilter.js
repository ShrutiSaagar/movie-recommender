import React, { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import './KeywordFilter.css';

const KeywordFilter = ({ keywords, setPreferences, setReasoningChain }) => {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setPreferences(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));

      // Add reasoning step for keyword addition
      setReasoningChain(prev => [
        ...prev, 
        { 
          step: 'Keyword Addition', 
          content: `User added keyword: "${newKeyword.trim()}"` 
        }
      ]);

      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setPreferences(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));

    // Add reasoning step for keyword removal
    setReasoningChain(prev => [
      ...prev, 
      { 
        step: 'Keyword Removal', 
        content: `User removed keyword: "${keyword}"` 
      }
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div className="keyword-filter">
      <div className="keyword-input-container">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a keyword..."
          className="keyword-input"
        />
        <button 
          onClick={handleAddKeyword}
          disabled={!newKeyword.trim() || keywords.includes(newKeyword.trim())}
          className="add-keyword-button"
        >
          <FiPlus />
        </button>
      </div>
      
      <div className="keywords-list">
        {keywords.length === 0 ? (
          <p className="no-keywords">No keywords added yet. Keywords help specify themes, actors, directors, or other specific elements you're looking for.</p>
        ) : (
          keywords.map((keyword, index) => (
            <div key={index} className="keyword-tag">
              <span>{keyword}</span>
              <button onClick={() => handleRemoveKeyword(keyword)}>
                <FiX />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KeywordFilter;
