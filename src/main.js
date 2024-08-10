import React from 'react';
import { createRoot } from 'react-dom/client';
import VideoAiChatbot from './components/VideoAiChatbot';
import { StrictMode } from 'react';
import './main.css';

const root = createRoot(document.getElementById('openai-chatbot'));
root.render(<StrictMode>
  <VideoAiChatbot />
</StrictMode>);