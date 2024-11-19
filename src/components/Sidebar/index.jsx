import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  IconButton,
  Chip,
  styled 
} from '@mui/material';
import {
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useSidebar } from '../../context/SidebarContext';
import { useChat } from '../../context/ChatContext';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 260,
  height: '100vh',
  backgroundColor: theme.palette.background.default,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  padding: theme.spacing(0, 2),
  marginTop: theme.spacing(2),
}));

const Sidebar = () => {
  const { credits = 0, useCase = {}, pipeline = {}, version = {}, updateUseCaseDetails } = useSidebar();
  const { messages = [], startNewChat } = useChat();

  // Filter messages to create chat history
  const chatHistory = messages
    .filter(msg => msg.type === 'user' && msg.content)
    .map((msg, index) => ({
      id: index,
      title: msg.content.slice(0, 30) + (msg.content.length > 30 ? '...' : ''),
      timestamp: msg.timestamp
    }));

  return (
    <SidebarContainer>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Genesis
        </Typography>
        <Chip 
          label={`${credits} Credits left`}
          sx={{ 
            bgcolor: 'grey.800',
            color: 'primary.main',
          }} 
        />
      </Box>

      <Box>
        <SectionTitle>USE CASE</SectionTitle>
        <List dense>
          <ListItem>
            <ListItemText primary={useCase.name || 'Hyper Personalised Travel Assistant'} />
            <IconButton 
              size="small" 
              onClick={() => updateUseCaseDetails('useCase')}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </ListItem>
        </List>

        <SectionTitle>PIPELINE</SectionTitle>
        <List dense>
          <ListItem>
            <ListItemText primary={pipeline.name || 'Demo-Travel Assistant'} />
            <IconButton 
              size="small" 
              onClick={() => updateUseCaseDetails('pipeline')}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </ListItem>
        </List>

        <SectionTitle>VERSION</SectionTitle>
        <List dense>
          <ListItem>
            <ListItemText primary={version.name || 'Version01-Travel Assistant'} />
            <IconButton 
              size="small" 
              onClick={() => updateUseCaseDetails('version')}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </ListItem>
        </List>
      </Box>

      <Button
        startIcon={<AddIcon />}
        onClick={startNewChat}
        sx={{
          mx: 2,
          mt: 2,
          bgcolor: '#000',
          color: 'common.white',
          '&:hover': {
            bgcolor: 'grey.900',
          },
        }}
      >
        New chat
      </Button>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <SectionTitle>CHAT SESSION HISTORY</SectionTitle>
        <List dense>
          {chatHistory.map((chat) => (
            <ListItem
              key={chat.id}
              secondaryAction={
                <IconButton edge="end" size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemText 
                primary={chat.title}
                primaryTypographyProps={{
                  sx: { fontSize: '0.875rem' }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;