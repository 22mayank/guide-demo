import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { SidebarProvider } from './context/SidebarContext';
import { ChatProvider } from './context/ChatContext';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarProvider>
        <ChatProvider>
          <Box sx={{ 
            display: 'flex', 
            minHeight: '100vh',
            bgcolor: 'background.default'
          }}>
            <Sidebar />
            <ChatArea />
          </Box>
        </ChatProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default App;