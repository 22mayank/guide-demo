import React from 'react';
import { Box, Typography, IconButton, styled } from '@mui/material';
import { ThumbUpOutlined, ThumbDownOutlined, Refresh, ContentCopy } from '@mui/icons-material';
import { useChat, conversationSteps } from '../../context/ChatContext';
import InterestSelect from '../CustomInputs/InterestSelect';
import ActivitySelect from '../CustomInputs/ActivitySelect';
import VisitorSelect from '../CustomInputs/VisitorSelect';
import VisitTypeSelect from '../CustomInputs/VisitTypeSelect';
import ConfirmationSelect from '../CustomInputs/ConfirmationSelect';

const ResponseContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '0 16px'  // Reduced padding to match reference
  });
  
  const MainTitle = styled(Typography)({
    fontSize: '16px',
    fontWeight: 500,
    color: '#FFFFFF',
    marginBottom: '16px'
  });
  
  const DayTitle = styled(Typography)({
    fontSize: '14px',
    fontWeight: 500,
    color: '#FFFFFF',
    marginBottom: '16px'
  });
  
  const TimeSection = styled(Box)({
    marginBottom: '16px',
    '&:last-child': {
      marginBottom: '8px'
    }
  });
  
  const TimeTitle = styled(Typography)({
    fontSize: '14px',
    color: '#FFFFFF',
    marginBottom: '8px',
    fontWeight: 500
  });
  
  const BulletList = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingLeft: '8px'
  });
  
  const BulletItem = styled(Typography)({
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '14px',
    color: '#FFFFFF',
    paddingLeft: '16px',
    position: 'relative',
    lineHeight: '1.5',
    '&:before': {
      content: '"•"',
      position: 'absolute',
      left: '0'
    }
  });
  
  const NumberedItem = styled(Typography)({
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '14px',
    color: '#FFFFFF',
    paddingLeft: '24px',
    position: 'relative',
    lineHeight: '1.5',
    marginBottom: '8px',
    '& .number': {
      position: 'absolute',
      left: '0',
      fontWeight: 500
    }
  });
  
  const ActionButtons = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    '& .feedback': {
      display: 'flex',
      gap: '4px'
    },
    '& .actions': {
      display: 'flex',
      gap: '8px'
    }
  });
  
  const ActionButton = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    fontSize: '14px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)'
    }
  });

  const TimeContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });
  
  const BotIcon = styled(Box)({
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#6D7BFB'
  });
  
  const TimeStamp = styled(Typography)({
    fontSize: '12px',
    color: '#A0A0A1'
  });

  const MessageContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '8px 16px',
    color: '#FFFFFF'
  });

  const MessageContent = styled(Box)(({ isUser }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '80%',
    alignSelf: isUser ? 'flex-end' : 'flex-start'
  }));

const Message = ({ message, onSelectionSubmitState }) => {
  const { currentStep, regenerateItinerary } = useChat();
  const isUser = message.type === 'user';

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    
    return `${formattedHours}.${minutes} ${period}, ${day} ${month}`;
  };

  const handleRegenerate = () => {
    regenerateItinerary();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const renderInteractiveContent = () => {
    if (!message.interactionType) return null;

    const props = {
      value: message.preferences?.[message.interactionType] || 
             (message.interactionType === 'visitors' ? { adults: 0, kids: 0, seniors: 0 } : []),
      onChange: (value) => message.onInteraction?.(value),
      onSubmit: onSelectionSubmitState
    };

    switch (message.interactionType) {
      case 'interests':
        return <InterestSelect {...props} />;
      case 'activities':
        return <ActivitySelect {...props} />;
      case 'visitors':
        return <VisitorSelect {...props} />;
      case 'visitType':
        return <VisitTypeSelect {...props} />;
      case 'confirmation':
        return <ConfirmationSelect {...props} />;
      default:
        return null;
    }
  };

  const renderFinalResponse = (content) => {
    if (!content) return null;
    if (!content) return null;

    // For loading state, show only loading message
    if (message.interactionType === 'loading') {
      return (
        <MessageContainer>
          <TimeContainer>
            <BotIcon />
            <TimeStamp>{formatTimestamp(message.timestamp)}</TimeStamp>
          </TimeContainer>
          <Typography sx={{ color: '#FFFFFF', fontSize: '14px' }}>
            {content}
          </Typography>
        </MessageContainer>
      );
    }
    const processContent = () => {
      let mainContent = content.split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .join('\n');
      
      // Get only the last occurrence if duplicated
      const splitPoint = mainContent.lastIndexOf("Disneyland Family-Friendly Itinerary");
      if (splitPoint > 0) {
        mainContent = mainContent.substring(splitPoint);
      }
  
      const lines = mainContent.split('\n');
      const sections = [];
      let currentSection = null;
      let currentTimeSlot = null;
  
      lines.forEach(line => {
        if (line.startsWith("Day 1")) {
          currentSection = { type: 'day', title: line, timeSlots: {} };
          sections.push(currentSection);
        } 
        else if (line.endsWith(":") && !line.startsWith("Tips")) {
          currentTimeSlot = line.slice(0, -1);
          if (currentSection?.type === 'day') {
            currentSection.timeSlots[currentTimeSlot] = [];
          }
        }
        else if (line.startsWith("•") && currentSection?.type === 'day' && currentTimeSlot) {
          currentSection.timeSlots[currentTimeSlot].push(line);
        }
        else if (line === "Tips for a Smooth Trip") {
          currentSection = { type: 'tips', title: line, items: [] };
          sections.push(currentSection);
          currentTimeSlot = null;
        }
        else if (line.match(/^\d+\./) && currentSection?.type === 'tips') {
          currentSection.items.push(line);
        }
        else if (line.startsWith("Enjoy your magical")) {
          sections.push({ type: 'footer', content: line });
        }
      });
  
      return sections;
    };
    const sections = processContent();
    if (sections.length === 0) return null;
    return (
      <ResponseContainer>
        <TimeContainer>
          <BotIcon />
          <TimeStamp>{formatTimestamp(message.timestamp)}</TimeStamp>
        </TimeContainer>

        <MainTitle>Disneyland Family-Friendly Itinerary</MainTitle>

        {sections.map((section, index) => {
          if (section.type === 'footer') {
            return (
              <Typography key={index} sx={{ color: '#FFFFFF', mt: 2 }}>
                {section.content}
              </Typography>
            );
          }
  
          if (section.type === 'day') {
            return (
              <Box key={index}>
                <DayTitle>{section.title}</DayTitle>
                {Object.entries(section.timeSlots).map(([timeSlot, items], idx) => (
                  <TimeSection key={idx}>
                    <TimeTitle>{timeSlot}</TimeTitle>
                    <BulletList>
                      {items.map((item, i) => (
                        <BulletItem key={i}>
                          {item.replace(/^[•]\s*/, '')}
                        </BulletItem>
                      ))}
                    </BulletList>
                  </TimeSection>
                ))}
              </Box>
            );
          }
  
          if (section.type === 'tips') {
            return (
              <Box key={index}>
                <DayTitle>{section.title}</DayTitle>
                <BulletList>
                  {section.items.map((item, idx) => {
                    const [number, ...text] = item.split('.');
                    return (
                      <NumberedItem key={idx}>
                        <span className="number">{number}.</span>
                        {text.join('.').trim()}
                      </NumberedItem>
                    );
                  })}
                </BulletList>
              </Box>
            );
          }
  
          return null;
        })}
  
        <ActionButtons>
          <div className="feedback">
            <IconButton size="small" sx={{ color: '#FFFFFF' }}>
              <ThumbUpOutlined />
            </IconButton>
            <IconButton size="small" sx={{ color: '#FFFFFF' }}>
              <ThumbDownOutlined />
            </IconButton>
          </div>
          <div className="actions">
            <ActionButton onClick={handleRegenerate}>
              <Refresh fontSize="small" />
              Regenerate
            </ActionButton>
            <ActionButton onClick={handleCopy}>
              <ContentCopy fontSize="small" />
              Copy
            </ActionButton>
          </div>
        </ActionButtons>
      </ResponseContainer>
    );
  };

  if (currentStep === conversationSteps.COMPLETE && !isUser && !message.interactionType) {
    return renderFinalResponse(message.content);
  }

  return (
    <MessageContainer>
      {!isUser && (
        <TimeContainer>
          <BotIcon />
          <TimeStamp>{formatTimestamp(message.timestamp)}</TimeStamp>
        </TimeContainer>
      )}

      <MessageContent isUser={isUser}>
        <Typography sx={{ color: '#FFFFFF', fontSize: '14px' }}>
          {message.content}
        </Typography>
        {renderInteractiveContent()}
      </MessageContent>
    </MessageContainer>
  );
};

export default Message;