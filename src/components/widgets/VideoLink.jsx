import React from 'react';

import Markdown from 'react-markdown'
import SVG from 'react-inlinesvg'; 


const ChatbotMessageWithLinks = ( {state, message, actionProvider} ) => {
   const customContent = message.message;
   //console.log('ChatbotMessageWithLinks:', message);

   //crea una variabile className con tailwind da assegnare al div react-chatbot-kit-chat-bot-custom-message-container quando message.is_handover_message è true
    let className = message.is_handover_message ? "react-chatbot-kit-chat-bot-custom-message-container bg-red-100" : "react-chatbot-kit-chat-bot-custom-message-container";


  return (
    <div className={className}>
      <div className="react-chatbot-kit-chat-bot-avatar-container">
      <SVG
            src={window?.ChatbotData?.icon ? window?.ChatbotData.icon : "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"}
            width={24}
            height="auto"
            title="React" />
      </div>
      <div className="react-chatbot-kit-chat-bot-custom-message">
        <Markdown>{customContent}</Markdown>
        <div className="react-chatbot-kit-chat-bot-message-arrow"></div>
      </div>
    </div>
  );
 };

export default ChatbotMessageWithLinks;
