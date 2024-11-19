import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import { useChat } from '../../context/ChatContext';
import Message from './Message';
import MessageInput from './MessageInput';
import WelcomeScreen from './WelcomeScreen';

const ChatContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
}));

const ChatArea = () => {
  const { messages, loading } = useChat();
  const [canSend, setCanSend] = useState(false);

  const handleSelectionSubmitState = (enabled) => {
    console.log('Setting can send:', enabled); // Debug log
    setCanSend(enabled);
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          messages.map((message, index) => (
            <Message 
              key={index} 
              message={message} 
              onSelectionSubmitState={handleSelectionSubmitState}
            />
          ))
        )}
      </MessagesContainer>
      <MessageInput 
        isTyping={loading}
        canSend={canSend}
        onSend={() => setCanSend(false)}
      />
    </ChatContainer>
  );
};

export default ChatArea;