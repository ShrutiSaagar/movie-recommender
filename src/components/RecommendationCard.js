import React from 'react';
import { FiStar, FiClock, FiCalendar } from 'react-icons/fi';
import './RecommendationCard.css';

const RecommendationCard = ({ recommendation }) => {
  const {
    title,
    year,
    rating,
    runtime,
    genres,
    imageUrl,
    description
  } = recommendation;

  return (
    <div className="recommendation-card">
      <div className="recommendation-image">
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <div className="placeholder-image">{title[0]}</div>
        )}
      </div>
      <div className="recommendation-details">
        <h3>{title}</h3>
        <div className="recommendation-meta">
          {year && (
            <div className="meta-item">
              <FiCalendar />
              <span>{year}</span>
            </div>
          )}
          {rating && (
            <div className="meta-item">
              <FiStar />
              <span>{rating}</span>
            </div>
          )}
          {runtime && (
            <div className="meta-item">
              <FiClock />
              <span>{runtime} min</span>
            </div>
          )}
        </div>
        {genres && genres.length > 0 && (
          <div className="recommendation-genres">
            {genres.map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
        )}
        {description && (
          <p className="recommendation-description">{description}</p>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
