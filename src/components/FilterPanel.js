import React, { useState } from 'react';
import GenreFilter from './GenreFilter';
import RangeFilter from './RangeFilter';
import KeywordFilter from './KeywordFilter';
import './FilterPanel.css';

const FilterPanel = ({ preferences, setPreferences, setReasoningChain }) => {
  const [selectedFilter, setSelectedFilter] = useState('genres');

  return (
    <div className="filter-panel">
      <div className="filter-tabs">
        <button 
          className={selectedFilter === 'genres' ? 'active' : ''}
          onClick={() => setSelectedFilter('genres')}
        >
          Genres
        </button>
        <button 
          className={selectedFilter === 'ratings' ? 'active' : ''}
          onClick={() => setSelectedFilter('ratings')}
        >
          Ratings & Length
        </button>
        <button 
          className={selectedFilter === 'keywords' ? 'active' : ''}
          onClick={() => setSelectedFilter('keywords')}
        >
          Keywords
        </button>
      </div>

      <div className="filter-content">
        {selectedFilter === 'genres' && (
          <GenreFilter 
            genres={preferences.genres} 
            setPreferences={setPreferences} 
            setReasoningChain={setReasoningChain}
          />
        )}

        {selectedFilter === 'ratings' && (
          <div className="range-filters">
            <RangeFilter 
              label="Rating Range"
              min={0}
              max={10}
              step={0.5}
              values={preferences.ratings}
              category="ratings"
              setPreferences={setPreferences}
              setReasoningChain={setReasoningChain}
            />
            <RangeFilter 
              label="Movie Length (minutes)"
              min={0}
              max={240}
              step={5}
              values={preferences.length}
              category="length"
              setPreferences={setPreferences}
              setReasoningChain={setReasoningChain}
            />
            <RangeFilter 
              label="Release Year"
              min={1900}
              max={2023}
              step={1}
              values={preferences.release}
              category="release"
              setPreferences={setPreferences}
              setReasoningChain={setReasoningChain}
            />
          </div>
        )}

        {selectedFilter === 'keywords' && (
          <KeywordFilter 
            keywords={preferences.keywords} 
            setPreferences={setPreferences}
            setReasoningChain={setReasoningChain}
          />
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
