import React from 'react';
import './GenreFilter.css';

const GenreFilter = ({ genres, setPreferences, setReasoningChain }) => {
  const updateGenre = (genre, value) => {
    setPreferences(prev => ({
      ...prev,
      genres: {
        ...prev.genres,
        [genre]: value
      }
    }));

    // Add reasoning step for manual preference update
    setReasoningChain(prev => [
      ...prev, 
      { 
        step: 'Manual Preference Update', 
        content: `User manually updated genre ${genre} preference to ${value}` 
      }
    ]);
  };

  return (
    <div className="genres-grid">
      {Object.entries(genres).map(([genre, weight]) => (
        <div key={genre} className="genre-item">
          <label>{genre}</label>
          <div className="weight-control">
            <button 
              onClick={() => updateGenre(genre, Math.max(0, weight - 1))}
              disabled={weight <= 0}
              className="weight-button"
            >
              -
            </button>
            <span className="weight-value">{weight}</span>
            <button 
              onClick={() => updateGenre(genre, Math.min(10, weight + 1))}
              disabled={weight >= 10}
              className="weight-button"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GenreFilter;
