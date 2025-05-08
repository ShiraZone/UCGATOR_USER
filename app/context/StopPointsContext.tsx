import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context data
interface StopPointsContextType {
  stopPoints: string[];
  addStopPoint: (point: string) => void;
  removeStopPoint: (index: number) => void;
  // Optional: Add functions to remove or clear points if needed later
}

// Create the context with a default value (can be undefined or a default object)
const StopPointsContext = createContext<StopPointsContextType | undefined>(undefined);

// Create a provider component
interface StopPointsProviderProps {
  children: ReactNode;
}

export const StopPointsProvider: React.FC<StopPointsProviderProps> = ({ children }) => {
  const [stopPoints, setStopPoints] = useState<string[]>([]);

  const addStopPoint = (point: string) => {
    // Avoid adding duplicates
    if (!stopPoints.includes(point)) {
      setStopPoints(prevPoints => [...prevPoints, point]);
    }
  };

  const removeStopPoint = (indexToRemove: number) => {
    setStopPoints(prevPoints => prevPoints.filter((_, index) => index !== indexToRemove));
  };

  // Value provided to consuming components
  const value = {
    stopPoints,
    addStopPoint,
    removeStopPoint,
  };

  return (
    <StopPointsContext.Provider value={value}>
      {children}
    </StopPointsContext.Provider>
  );
};

// Custom hook for easy consumption
export const useStopPoints = (): StopPointsContextType => {
  const context = useContext(StopPointsContext);
  if (context === undefined) {
    throw new Error('useStopPoints must be used within a StopPointsProvider');
  }
  return context;
}; 