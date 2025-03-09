import React, { useRef, useEffect } from 'react';
import './ReasoningChain.css';

const ReasoningChain = ({ reasoningChain }) => {
  const reasoningEndRef = useRef(null);
  const reasoningContainerRef = useRef(null);

  useEffect(() => {
    if (reasoningEndRef.current && reasoningContainerRef.current) {
      reasoningContainerRef.current.scrollTop = reasoningContainerRef.current.scrollHeight;
    }
  }, [reasoningChain]);

  return (
    <div className="reasoning-container" ref={reasoningContainerRef}>
      {reasoningChain.map((step, index) => (
        <div key={index} className="reasoning-step">
          <div className="step-header">
            <div className="step-number">{index + 1}</div>
            <h3>{step.step}</h3>
          </div>
          <div className="step-content">
            <p>{step.content}</p>
          </div>
        </div>
      ))}
      <div ref={reasoningEndRef} />
    </div>
  );
};

export default ReasoningChain;
