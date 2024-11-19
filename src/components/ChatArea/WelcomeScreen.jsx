import React from 'react';
import { Box, Typography, styled } from '@mui/material';

const WelcomeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const MessageBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const WelcomeScreen = () => {
  return (
    <WelcomeContainer>
      <MessageBox>
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: '24px', 
            fontWeight: 500,
            lineHeight: 1.5,
            marginBottom: '8px',
            color: '#F8F8F8'
          }}
        >
          Welcome back!
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '14px',
            lineHeight: 1.5,
            color: '#A0A0A1'
          }}
        >
          I am your hyper personalised travel assistant! I can help you plan your travel. 
          Let's understand more about you and your plans for trip.
        </Typography>
      </MessageBox>
    </WelcomeContainer>
  );
};

export default WelcomeScreen;