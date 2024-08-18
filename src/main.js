import React from 'react';
import { createRoot } from 'react-dom/client';
import VideoAiChatbot from './components/VideoAiChatbot';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import './main.css';

const root = createRoot(document.getElementById('openai-chatbot'));
root.render(<StrictMode>
  <Provider store={store}>
  <VideoAiChatbot />
  </Provider>
</StrictMode>);