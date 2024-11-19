import React, { useState } from 'react';
import { Box, IconButton, styled } from '@mui/material';
import { Send, Mic, Square } from '@mui/icons-material';
import { useChat, conversationSteps } from '../../context/ChatContext';

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

const InputWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  transition: 'border-color 0.2s ease',
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
  },
}));

const StyledInput = styled('input')(({ theme }) => ({
  flex: 1,
  backgroundColor: 'transparent',
  border: 'none',
  color: theme.palette.text.primary,
  fontSize: '0.875rem',
  '&:focus': {
    outline: 'none',
  },
  '&::placeholder': {
    color: theme.palette.text.secondary,
  },
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  padding: theme.spacing(0, 1),
  '& .dots': {
    display: 'inline-flex',
    gap: '3px',
    '& .dot': {
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.main,
      animation: 'typing 1.4s infinite both',
      '&:nth-of-type(2)': {
        animationDelay: '.2s',
      },
      '&:nth-of-type(3)': {
        animationDelay: '.4s',
      },
    },
  },
  '@keyframes typing': {
    '0%, 100%': {
      opacity: 0.3,
    },
    '50%': {
      opacity: 1,
    },
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: theme.spacing(1),
  '&.Mui-disabled': {
    color: theme.palette.text.disabled,
  },
  '&.send-button': {
    color: theme.palette.primary.main,
  },
}));

const MessageInput = ({ isTyping, canSend, onSend }) => {
  const [message, setMessage] = useState('');
  const { handleUserMessage, currentStep } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() || canSend) {
      if (currentStep === conversationSteps.INITIAL) {
        handleUserMessage(message.trim(), 'INITIAL');
      } else if (currentStep === conversationSteps.ADDITIONAL_INFO) {
        handleUserMessage(message.trim(), 'user');
      } else {
        handleUserMessage(message.trim(), 'SUBMIT_SELECTION');
      }
      
      setMessage('');
      onSend?.();
    }
  };

  if (isTyping) {
    return (
      <InputContainer>
        <InputWrapper>
          <TypingIndicator>
            Typing
            <span className="dots">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </span>
          </TypingIndicator>
          <ActionButton size="small">
            <Square />
          </ActionButton>
        </InputWrapper>
      </InputContainer>
    );
  }

  const showTextInput = currentStep === conversationSteps.INITIAL || 
                       currentStep === conversationSteps.ADDITIONAL_INFO;

  return (
    <InputContainer>
      <form onSubmit={handleSubmit}>
        <InputWrapper>
          <StyledInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask your question here"
            disabled={!showTextInput}
          />
          <ActionButton 
            type="button"
            size="small"
          >
            <Mic />
          </ActionButton>
          <ActionButton 
            className="send-button"
            type="submit" 
            disabled={!message.trim() && !canSend}
          >
            <Send sx={{ transform: 'rotate(-45deg)' }} />
          </ActionButton>
        </InputWrapper>
      </form>
    </InputContainer>
  );
};

export default MessageInput;