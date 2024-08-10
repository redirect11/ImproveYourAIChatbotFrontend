// src/App.js
import React, { useEffect, useState, useMemo } from 'react';
import Chatbot, { createChatBotMessage, createClientMessage, createCustomMessage } from 'react-chatbot-kit';
import MessageParser from '../messageParser';
import ActionProvider from '../actionProvider';
import 'react-chatbot-kit/build/main.css'
import SVG from 'react-inlinesvg'; 
import Overview from './widgets/Overview/Overview';

import ChatbotMessageWithLinks from './widgets/VideoLink';
import LoaderMessage from './widgets/LoaderMessage';
import WithAvatar from './widgets/WithAvatar';
import ChatbotHeader from './widgets/ChatbotHeader';
import ChatbotMessageWithError from './widgets/ErrorMessage';


const ChatbotStyleWrapper = (props) => {
  return (
    <div className="chatbot-custom-theme" style={{ width: '100%', height: '100%' }}>
      <Chatbot {...props} />
    </div>
  );
}

const VideoAiChatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const assistants = window.ChatbotData.assistants.data ? window.ChatbotData.assistants.data : [];
  const [selectedAssistant, setSelectedAssistant] = useState(assistants && assistants.length === 1 ? assistants[0] : null);
  let oldMessages = window.ChatbotData.messages.data.data ? window.ChatbotData.messages.data.data : [];
  
  let wMessage = window.ChatbotData.welcomeMessage ? window.ChatbotData.welcomeMessage : "";
  
  let messageHistory = [];
  for(let i = 0; i < oldMessages.length; i++) {
    if(oldMessages[i].role === "user" && !(oldMessages[i].metadata?.postprompt === "true"	)) {
      messageHistory.push(createClientMessage(oldMessages[i].content[0].text.value));
      //continue;
    } else if (oldMessages[i].role === "assistant" && oldMessages[i].assistant_id) {
      messageHistory.push(createCustomMessage(oldMessages[i].content[0].text.value,
                                              "customWithLinks", 
                                              {payload: oldMessages[i].content[0].text.value}));
    } 
  }

  const [messages, setMessages] = useState(messageHistory.reverse());

  let chatbotName = window.ChatbotData.chatbotName ? window.ChatbotData.chatbotName : "Chatbot";
  let chatBotMessage;

  if(assistants.length === 0) {
    chatBotMessage = useMemo(() => createChatBotMessage("No assistants available"), []);
  } else if(assistants.length === 1) {
    chatBotMessage = useMemo(() => createChatBotMessage(wMessage), []);
  } else {	
    chatBotMessage = useMemo(() => createChatBotMessage(wMessage,
    {
      widget: "overview",
      delay: null,
      loading: true
    }), []);
  }

  const saveMessages = (messages, HTMLString) => {                        
    setMessages(messages); 
  };

  let messageAlreadyExists = messages.some(message => message.id === chatBotMessage.id); //works because of the useMemo. Otherwise id were different
  let initialMessages = messages;
  if(!messageAlreadyExists) {
    initialMessages = [...messages, chatBotMessage]; 
  }

  const onAssistantSelected = (assistant) => {
    console.log('onAssistantSelected assistant:', assistant);
    setSelectedAssistant(assistant);
  }

  const config = useMemo(() => {
    return {
      initialMessages: initialMessages,
      botName: chatbotName,
      state : {
        assistants:  assistants ? assistants : [],
        selectedAssistant: selectedAssistant,
      },
      widgets: [
        {
          widgetName: "overview",
          widgetFunc: (props) => <Overview {...props} onAssistantSelected={onAssistantSelected} />,
          mapStateToProps: ['assistants', 'selectedAssistant']
        },
      ],
      customComponents: {
        header : () => <ChatbotHeader selectedAssistant={selectedAssistant} />,
        botAvatar: (props) => <WithAvatar {...props} />, 
      },
      customMessages: { 
                        customWithLinks: (props) => <ChatbotMessageWithLinks {...props} message={props.state.messages.find(msg => (msg.payload === props.payload))}/>,
                        customWithError: (props) => <ChatbotMessageWithError {...props} message={props.state.messages.find(msg => (msg.payload === props.payload))}/>,
                        loaderMessage: (props) => <LoaderMessage {...props} />,
                    }
    }
  }, [saveMessages]);
  


  const toggleChatbot = () => {
      setIsChatbotOpen(!isChatbotOpen);
  };

  const validator = (input) => {
    if (!input.replace(/\s/g, '').length) //check if only composed of spaces
      return false;
    if (input.length > 1) //check if the message is empty
      return true;
    return false
  }

  return (
    <>
      <button
          className="chatbot-toggle-button"
          onClick={toggleChatbot}
      >
        { isChatbotOpen ? 
          <i className="fas fa-times"></i> : 
          <SVG
            src={window.ChatbotData.icon ? window.ChatbotData.icon : "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"}
            width={24}
            height="auto"
            title="React"
          /> }
      </button>
      <div id="chatbot-container" className={isChatbotOpen ? 'chatbot-open' : ''}>
          {isChatbotOpen && (
              <ChatbotStyleWrapper
                  config={config}
                  actionProvider={ActionProvider}
                  messageParser={MessageParser}
                  validator={validator}
                  //headerText={selectedAssistant?.name ? selectedAssistant.name : chatbotName}
                  saveMessages={saveMessages}
              />
          )}
      </div>
  </>
  );
}

export {
  ChatbotStyleWrapper
}

export default VideoAiChatbot;