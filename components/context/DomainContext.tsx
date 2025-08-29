import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context
interface DomainContextProps {
  domain: string | undefined;     // id for this question attempt
  setDomain: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// Create the context with default values
const DomainContext = createContext<DomainContextProps>({
  domain: undefined,
  setDomain: () => {},
});

// Custom hook to use the context
export const useDomainContext = () => useContext(DomainContext);

// Provider component to wrap the app or specific parts of the app
export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [domain, setDomain] = useState<string | undefined>(undefined);
 
  return (
    <DomainContext.Provider value={{ domain, setDomain }}>
      {children}
    </DomainContext.Provider>
  );
};