import React from 'react';
import './SpeechBubble.css';

const SpeechBubble = ({ text, isUser }) => {
  return (
    <div className={`speech-bubble-wrapper ${isUser ? 'right' : 'left'}`}>
      <div className="speech-bubble">{text}</div>
    </div>
  );
};

export default SpeechBubble;
