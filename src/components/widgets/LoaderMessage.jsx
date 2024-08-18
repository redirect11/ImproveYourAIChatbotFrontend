import React from 'react';

import SVG from 'react-inlinesvg'; 
import Loader from '../Loader';


const LoaderMessage = ( {state, message} ) => {
  return (
    <div className="react-chatbot-kit-chat-bot-custom-message-container">
      <div className="react-chatbot-kit-chat-bot-avatar-container">
      <SVG
            src={window?.ChatbotData?.icon ? window.ChatbotData.icon : "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"}
            width={24}
            height="auto"
            title="React" />
      </div>
      <div className="react-chatbot-kit-chat-bot-custom-message">
        <Loader/>
        <div className="react-chatbot-kit-chat-bot-message-arrow"></div>
      </div>
    </div>
  );
 };

export default LoaderMessage;
