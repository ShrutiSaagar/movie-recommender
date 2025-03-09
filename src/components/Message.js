import React from 'react';
import { FiUser, FiCpu } from 'react-icons/fi';
import './Message.css';

const Message = ({ message }) => {
  return (
    <div className={`message ${message.type}`}>
      <div className="message-avatar">
        {message.type === 'user' ? <FiUser /> : <FiCpu />}
      </div>
      <div className="message-content">
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default Message;
