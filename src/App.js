import React, { useState } from 'react';
import ChatBox from './components/ChatBox';
import FilterPanel from './components/FilterPanel';
import ReasoningChain from './components/ReasoningChain';
import './App.css';

function App() {
  const [preferences, setPreferences] = useState({
    genres: {
      Action: 0,
      Comedy: 0,
      Drama: 0,
      Horror: 0,
      SciFi: 0,
      Fantasy: 0,
      Romance: 0,
      Thriller: 0,
      Animation: 0,
      Documentary: 0
    },
    ratings: { min: 0, max: 10 },
    length: { min: 0, max: 240 },
    release: { min: 1900, max: 2023 },
    keywords: []
  });

  const [reasoningChain, setReasoningChain] = useState([
    { step: 'Initial', content: 'Waiting for user input to begin recommendation process.' }
  ]);

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo-container">
          <h1>MovieMind</h1>
          <p>AI-Powered Recommendations</p>
        </div>
        
        <FilterPanel 
          preferences={preferences} 
          setPreferences={setPreferences} 
          setReasoningChain={setReasoningChain}
        />
      </div>
      
      <div className="main-content">
        <ChatBox 
          preferences={preferences} 
          setPreferences={setPreferences} 
          reasoningChain={reasoningChain}
          setReasoningChain={setReasoningChain}
        />
      </div>
      
      <div className="reasoning-panel">
        <h2>Reasoning Process</h2>
        <ReasoningChain reasoningChain={reasoningChain} />
      </div>
    </div>
  );
}

export default App;
