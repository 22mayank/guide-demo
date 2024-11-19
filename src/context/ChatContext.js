import { createContext, useContext, useState, useCallback } from 'react';
import { mockApi } from '../services/mockApi';

const ChatContext = createContext();

const conversationSteps = {
  INITIAL: 'initial',
  INTERESTS: 'interests',
  ACTIVITIES: 'activities',
  VISITORS: 'visitors',
  VISIT_TYPE: 'visitType',
  ADDITIONAL_INFO_CONFIRM: 'additionalInfoConfirm',
  ADDITIONAL_INFO: 'additionalInfo',
  GENERATE_CONFIRM: 'generateConfirm',
  GENERATING: 'generating',
  COMPLETE: 'complete'
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(conversationSteps.INITIAL);
  const [selectedInputs, setSelectedInputs] = useState({
    destination: '',
    interests: [],
    activities: [],
    visitors: { adults: 0, kids: 0, seniors: 0 },
    visitType: '',
    additionalInfo: '',
    confirmation: ''
  });
  const [loading, setLoading] = useState(false);

  const addMessage = useCallback((content, type = 'ai', interactionType = null, selections = null) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date(),
      interactionType,
      selections,
      onInteraction: interactionType ? (value) => {
        setSelectedInputs(prev => {
          const newInputs = { ...prev };
          switch (interactionType) {
            case "interests":
              newInputs.interests = value;
              break;
            case "activities":
              newInputs.activities = value;
              break;
            case "visitors":
              newInputs.visitors = value;
              break;
            case "visitType":
              newInputs.visitType = value;
              break;
            case "confirmation":
              newInputs.confirmation = value;
              break;
            default:
              return prev;
          }
          return newInputs;
        });
      } : null
    };

    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const handleUserMessage = useCallback(async (message, type = 'user') => {
    if (type === 'INITIAL') {
      setSelectedInputs(prev => ({ ...prev, destination: message }));
      addMessage(message, 'user');
      setCurrentStep(conversationSteps.INTERESTS);
      addMessage('Select all of your interests', 'ai', 'interests');
      return;
    }

    if (type === 'SUBMIT_SELECTION') {
      const userMessage = addMessage(message, 'user');

      switch (currentStep) {
        case conversationSteps.INTERESTS:
          if (selectedInputs.interests.length > 0) {
            setCurrentStep(conversationSteps.ACTIVITIES);
            addMessage('Select all the activities you would like to do', 'ai', 'activities', selectedInputs);
          }
          break;

        case conversationSteps.ACTIVITIES:
          if (selectedInputs.activities.length > 0) {
            setCurrentStep(conversationSteps.VISITORS);
            addMessage('Select the number of people', 'ai', 'visitors', selectedInputs);
          }
          break;

        case conversationSteps.VISITORS:
          const { adults, kids, seniors } = selectedInputs.visitors;
          if ((adults + kids + seniors) > 0) {
            setCurrentStep(conversationSteps.VISIT_TYPE);
            addMessage('Select the type of visit', 'ai', 'visitType', selectedInputs);
          }
          break;

        case conversationSteps.VISIT_TYPE:
          if (selectedInputs.visitType) {
            setCurrentStep(conversationSteps.ADDITIONAL_INFO_CONFIRM);
            addMessage('Do you want to mention any more things to get the perfect itinerary?', 'ai', 'confirmation', selectedInputs);
          }
          break;

        case conversationSteps.ADDITIONAL_INFO_CONFIRM:
          if (selectedInputs.confirmation === 'yes') {
            setCurrentStep(conversationSteps.ADDITIONAL_INFO);
            addMessage('Okay, Do type your response, and let me know.', 'ai');
          } else if (selectedInputs.confirmation === 'no') {
            setCurrentStep(conversationSteps.GENERATE_CONFIRM);
            addMessage('Okay, Do you want to generate the response now?', 'ai', 'confirmation', selectedInputs);
          }
          break;

        case conversationSteps.GENERATE_CONFIRM:
          if (selectedInputs.confirmation === 'yes') {
            setCurrentStep(conversationSteps.GENERATING);
            await generateItinerary();
          }
          break;
      }
      return;
    }

    if (currentStep === conversationSteps.ADDITIONAL_INFO) {
      setSelectedInputs(prev => ({ ...prev, additionalInfo: message }));
      addMessage(message, 'user');
      setCurrentStep(conversationSteps.GENERATE_CONFIRM);
      addMessage('Okay, Do you want to generate the response now?', 'ai', 'confirmation', selectedInputs);
    }

    if (type === 'feedback') {
      setSelectedInputs(prev => ({
        ...prev,
        feedback: message
      }));
    }
  }, [currentStep, selectedInputs, addMessage]);

  const handleStreamingResponse = async (response, onProgress) => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let partialResponse = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        partialResponse += decoder.decode(value, { stream: true });
        onProgress(partialResponse);
      }
    } catch (error) {
      console.error('Error reading stream:', error);
    }
  };

  const generateItinerary = async (isRegenerate = false) => {
    setLoading(true);
  
    try {
      const response = await mockApi.streamResponse(selectedInputs);
  
      // For regeneration, update existing message
      if (isRegenerate) {
        setMessages(prev => 
          prev.map(msg => msg.canRegenerate ? {
            ...msg,
            content: '',
            interactionType: null
          } : msg)
        );
      }
  
      // Create or find the target message
      const targetMessageId = isRegenerate ? 
        messages.find(msg => msg.canRegenerate)?.id :
        messages.length;
  
      // Initialize the message if not regenerating
      if (!isRegenerate) {
        setMessages(prev => [...prev, {
          id: targetMessageId,
          type: 'ai',
          content: '',
          timestamp: new Date(),
          canRegenerate: true
        }]);
      }
  
      await handleStreamingResponse(response, (partialResponse) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === targetMessageId ? {
              ...msg,
              content: partialResponse,
              interactionType: null,
              canRegenerate: true
            } : msg
          )
        );
      });
  
      setCurrentStep(conversationSteps.COMPLETE);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'ai',
          content: 'Sorry, there was an error generating your itinerary. Please try again.',
          timestamp: new Date(),
          interactionType: 'error'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  

  const regenerateItinerary = async () => {
    await generateItinerary(true);
  };

  const startNewChat = useCallback(() => {
    setMessages([]);
    setCurrentStep(conversationSteps.INITIAL);
    setSelectedInputs({
      destination: '',
      interests: [],
      activities: [],
      visitors: { adults: 0, kids: 0, seniors: 0 },
      visitType: '',
      additionalInfo: '',
      confirmation: ''
    });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        currentStep,
        selectedInputs,
        handleUserMessage,
        startNewChat,
        regenerateItinerary,
        conversationSteps
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export { conversationSteps };