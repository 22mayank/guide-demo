import { createContext, useContext, useState, useCallback } from 'react';
import { mockApi } from '../services/mockApi';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [credits, setCredits] = useState(null);
  const [useCase, setUseCase] = useState({ name: "Hyper Personalised Travel Assistant" });
  const [pipeline, setPipeline] = useState({ name: "Demo-Travel Assistant" });
  const [version, setVersion] = useState({ name: "Version01-Travel Assistant" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCredits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await mockApi.getCredits();
      setCredits(data.credits);
    } catch (error) {
      setError('Failed to fetch credits');
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUseCaseDetails = useCallback(async (type, value) => {
    try {
      switch (type) {
        case 'useCase':
          setUseCase({ name: value });
          break;
        case 'pipeline':
          setPipeline({ name: value });
          break;
        case 'version':
          setVersion({ name: value });
          break;
        default:
          break;
      }
    } catch (error) {
      setError('Failed to update details');
      console.error('Error updating details:', error);
    }
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        credits,
        useCase,
        pipeline,
        version,
        loading,
        error,
        fetchCredits,
        updateUseCaseDetails,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};