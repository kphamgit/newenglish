import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context
interface QuizAttemptContextProps {
  id: string | undefined;     // id for this question attempt
  setId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// Create the context with default values
const QuizAttemptContext = createContext<QuizAttemptContextProps>({
  id: undefined,
  setId: () => {},
 

});

// Custom hook to use the context
export const useQuizAttemptContext = () => useContext(QuizAttemptContext);

// Provider component to wrap the app or specific parts of the app
export const QuizAttemptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [id, setId] = useState<string | undefined>(undefined);
 

  return (
    <QuizAttemptContext.Provider value={{ id, setId}}>
      {children}
    </QuizAttemptContext.Provider>
  );
};