import React, { useEffect, useState, useMemo } from 'react';
import Chatbot, { createChatBotMessage, createClientMessage, createCustomMessage } from 'react-chatbot-kit';
import MessageParser from '../messageParser';
import ActionProvider from '../actionProvider';
import 'react-chatbot-kit/build/main.css';
import SVG from 'react-inlinesvg';
import Overview from './widgets/Overview/Overview';
import ChatbotMessageWithLinks from './widgets/VideoLink';
import LoaderMessage from './widgets/LoaderMessage';
import WithAvatar from './widgets/WithAvatar';
import ChatbotHeader from './widgets/ChatbotHeader';
import ChatbotMessageWithError from './widgets/ErrorMessage';
import moment from 'moment';
import { useSelector } from 'react-redux';

const ChatbotStyleWrapper = (props) => {
  return (
    <div className="chatbot-custom-theme" style={{ width: '100%', height: '100%' }}>
      <Chatbot {...props} />
    </div>
  );
}


const VideoAiChatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const assistants = useSelector(state => state.rootReducer.assistants.assistants);
  const lastAssistantId = window.ChatbotData.lastAssistantId ? window.ChatbotData.lastAssistantId : null;
  const lastAssistant = assistants.find(assistant => assistant.id === lastAssistantId);
  const assistantToSelect = lastAssistant ? lastAssistant : (assistants && assistants.length === 1 ? assistants[0] : null);
  const [selectedAssistant, setSelectedAssistant] = useState(assistantToSelect);

  console.log( 'chatbotdata', window.ChatbotData);

  let oldMessages = window.ChatbotData.messages.data.messages.data ? window.ChatbotData.messages.data.messages.data : [];
  let isHandover =  useSelector(state => state.rootReducer.handover.handover);


  console.log('oldMessages:', oldMessages);
  
  let wMessage = window.ChatbotData.welcomeMessage ? window.ChatbotData.welcomeMessage : "";
  
  let messageHistory = [];
  for(let i = 0; i < oldMessages.length; i++) {
    if(oldMessages[i].role === "user" && !(oldMessages[i].metadata?.postprompt === "true"	)) {
      messageHistory.push(createClientMessage(oldMessages[i].content[0].text.value, { 
          payload: { 
            originalId: oldMessages[i].id, 
            created_at: oldMessages[i].created_at,
            is_handover_message: oldMessages[i]?.metadata?.handover_message ? oldMessages[i].metadata.handover_message : false 
          } 
      }));
    } else if (oldMessages[i].role === "assistant") {
      messageHistory.push(createCustomMessage(oldMessages[i].content[0].text.value,
                                              "customWithLinks", 
                                              {
                                                payload: { 
                                                  message: oldMessages[i].content[0].text.value, 
                                                  originalId: oldMessages[i].id,
                                                  created_at: oldMessages[i].created_at,
                                                  is_handover_message: oldMessages[i]?.metadata?.handover_message ? oldMessages[i].metadata.handover_message : false 
                                                } }));
    } 
  }

  console.log('messageHistory:', messageHistory);


  const [messages, setMessages] = useState(messageHistory.reverse());
  console.log('messages:', messages);

  let chatbotName = window.ChatbotData.chatbotName ? window.ChatbotData.chatbotName : "Chatbot";
  let chatBotMessage;

  console.log('isHandover:', isHandover);
  
  if(assistants.length === 0) {
    chatBotMessage = useMemo(() => createChatBotMessage("No assistants available", { payload: { originalId: 0, created_at: moment().unix() }}), []);
  } else if(assistants.length === 1) {
    chatBotMessage = useMemo(() => createChatBotMessage(wMessage, { payload: { originalId: 0, created_at: moment().unix()  }}), []);
  } else if(!isHandover) {	
    chatBotMessage = useMemo(() => createChatBotMessage(wMessage,
    {
      widget: "overview",
      delay: null,
      loading: true,
      payload: { originalId: 0, created_at: moment().unix()  }
    }), []);
  } 
   else {
    chatBotMessage = useMemo(() => createChatBotMessage("Chat con operatore", { payload: { originalId: 0, created_at: moment().unix()  }}), []);
  }


  let messageAlreadyExists = messages.some(message => message.id === chatBotMessage.id); //works because of the useMemo. Otherwise id were different
  let initialMessages = messages;
  if(!messageAlreadyExists) {
    initialMessages = [...messages, chatBotMessage]; 
  }
 
  const [config, setConfig] = useState({
      initialMessages: initialMessages,
      botName: chatbotName,
      state : {
        assistants:  assistants ? assistants : [],
        selectedAssistant: selectedAssistant,
        isHandover: isHandover
      },
      widgets: [
        {
          widgetName: "overview",
          widgetFunc: (props) => <Overview {...props} onAssistantSelected={onAssistantSelected} />,
          mapStateToProps: ['assistants', 'selectedAssistant']
        },
      ],
      customComponents: {
        header : () => <ChatbotHeader selectedAssistant={selectedAssistant} isHandover={isHandover}/>,
        botAvatar: (props) => <WithAvatar {...props} isHandover={isHandover} />, 
      },
      customMessages: { 
                        customWithLinks: (props) => <ChatbotMessageWithLinks {...props} message={props.state.messages.find(msg => (msg.payload === props.payload))}/>,
                        customWithError: (props) => <ChatbotMessageWithError {...props} message={props.state.messages.find(msg => (msg.payload === props.payload))}/>,
                        loaderMessage: (props) => <LoaderMessage {...props} />,
                    }
    }
  );

  
  console.log('config:', config);
  const saveMessages = (messages, HTMLString) => {                 
    setMessages(messages); 
  };


  const onAssistantSelected = (assistant) => {
    console.log('onAssistantSelected assistant:', assistant);
    setSelectedAssistant(assistant);
  }

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