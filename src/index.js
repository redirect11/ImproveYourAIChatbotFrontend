
import { ChatbotStyleWrapper } from './components/VideoAiChatbot';
import { createChatBotMessage, createClientMessage, createCustomMessage } from 'react-chatbot-kit';
import MessageParser from './messageParser';
import ActionProvider from './actionProvider';
import SVG from 'react-inlinesvg'; 
import Overview from './components/widgets/Overview/Overview';

import ChatbotMessageWithLinks from './components/widgets/VideoLink';
import LoaderMessage from './components/widgets/LoaderMessage';
import WithAvatar from './components/widgets/WithAvatar';
import ChatbotHeader from './components/widgets/ChatbotHeader';
import ChatbotMessageWithError from './components/widgets/ErrorMessage';

export { MessageParser, 
        ActionProvider, 
        ChatbotMessageWithLinks, 
        LoaderMessage, 
        WithAvatar, 
        ChatbotHeader, 
        ChatbotMessageWithError, 
        Overview, 
        SVG,
        ChatbotStyleWrapper,
        createChatBotMessage,
        createClientMessage,
        createCustomMessage
       };