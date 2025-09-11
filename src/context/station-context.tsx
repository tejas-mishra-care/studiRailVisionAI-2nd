
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a station object
interface Station {
  code: string;
  name: string;
}

// Define the shape of the context state
interface StationContextType {
  station: Station;
  setStation: (station: Station) => void;
}

// Create the context with a default value
const StationContext = createContext<StationContextType | undefined>(undefined);

// Define the props for the provider component
interface StationProviderProps {
  children: ReactNode;
}

// Create the provider component
export const StationProvider: React.FC<StationProviderProps> = ({ children }) => {
  const [station, setStation] = useState<Station>({
    code: 'NDLS',
    name: 'New Delhi Railway Station',
  });

  return (
    <StationContext.Provider value={{ station, setStation }}>
      {children}
    </StationContext.Provider>
  );
};

// Create a custom hook for using the station context
export const useStation = (): StationContextType => {
  const context = useContext(StationContext);
  if (context === undefined) {
    throw new Error('useStation must be used within a StationProvider');
  }
  return context;
};
