import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import RecommendationCard from './RecommendationCard';
import { sendChatRequest } from '../services/api';
import { FiSend, FiCpu } from 'react-icons/fi';
import './ChatBox.css';

const ChatBox = ({ preferences, setPreferences, reasoningChain, setReasoningChain }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      content: 'Hello! I\'m your movie recommendation assistant. Tell me what kind of movies you enjoy or what you\'re in the mood for today.',
      recommendations: [] 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current && messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    // Add user message
    const newMessages = [...messages, { type: 'user', content: input }];
    console.log(newMessages)
    setMessages(newMessages);
    
    // Add reasoning step for user input
    const newReasoningChain = [
      ...reasoningChain,
      { step: 'User Input', content: `Received: "${input}"` },
      { step: 'Parsing', content: 'Analyzing user input for preferences and requirements...' }
    ];
    setReasoningChain(newReasoningChain);
    
    setIsLoading(true);
    setInput('');

    try {
      // Send request to API
      const response = await sendChatRequest(input, preferences, messages);
      console.log('API Response:', response);
      
      // Update preferences if returned in response
      if (response.updatedPreferences && Object.keys(response.updatedPreferences).length > 0) {
        console.log('updatedPreferences:', response.updatedPreferences);
        setPreferences(prev => ({
          ...prev,
          ...response.updatedPreferences,
        }));
        
        // Add reasoning step for preference updates
        setReasoningChain(prev => [
          ...prev, 
          { 
            step: 'Preference Update', 
            content: `Updated user preferences based on the conversation:
              ${JSON.stringify(response.updatedPreferences, null, 2)}` 
          }
        ]);
      }

      // Add reasoning for recommendations
      if (response.reasoning) {
        setReasoningChain(prev => [
          ...prev, 
          { 
            step: 'Recommendation Reasoning', 
            content: response.reasoning 
          }
        ]);
      }

      // Process recommendations from table if available
      let recommendations = [];
      console.log('response.recommendations', response.recommendations);
      if (response.recommendations && response.recommendations !== '') {
        try {
          // Parse the table to extract movie recommendations
          const tableLines = response.recommendations.filter(line => line.trim());
          
          // Skip header line and separator line
          const movieLines = tableLines.slice(2);
          
          recommendations = movieLines.map(line => {
            const parts = line.split('|').map(part => part.trim()).filter(part => part);
            if (parts.length >= 3) {
              return {
                title: parts[0],
                year: parts[1],
                description: parts[2]
              };
            }
            return null;
          }).filter(movie => movie);
          
          console.log('Parsed recommendations:', recommendations);
        } catch (error) {
          console.error('Error parsing recommendations table:', error);
        }
      }

      // Add bot message with the response
      setMessages(prev => [
        ...prev,
        { 
          type: 'bot', 
          content: response.message || 'I found some movie recommendations for you!', 
          recommendations: recommendations
        }
      ]);

      // Final reasoning step
      setReasoningChain(prev => [
        ...prev, 
        { 
          step: 'Completion', 
          content: 'Recommendation process completed and response presented to user.' 
        }
      ]);

    } catch (error) {
      console.error('Error communicating with API:', error);
      
      setMessages(prev => [
        ...prev,
        { 
          type: 'bot', 
          content: 'Sorry, I encountered an error while processing your request. Please try again.' 
        }
      ]);
      
      setReasoningChain(prev => [
        ...prev, 
        { 
          step: 'Error', 
          content: `Error processing request: ${error.message}` 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <FiCpu className="chat-icon" />
        <h2>Movie Recommendation Chat</h2>
      </div>

      <div className="messages-container" ref={messageContainerRef}>
        {messages.map((message, index) => (
          <div key={index}>
            <Message message={message} />
            {message.recommendations && message.recommendations.length > 0 && (
              <div className="recommendations-container">
                {message.recommendations.map((rec, recIndex) => (
                  <RecommendationCard key={recIndex} recommendation={rec} />
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tell me what kind of movie you're looking for..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading || input.trim() === ''}>
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
