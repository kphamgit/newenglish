import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context
interface QuestionAttemptContextProps {
  id: string | undefined;     // id for this question attempt
  format: string | undefined;
  answerKey: string | undefined;
  setId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFormat: React.Dispatch<React.SetStateAction<string | undefined>>;
  setAnswerKey: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// Create the context with default values
const QuestionAttemptContext = createContext<QuestionAttemptContextProps>({
  id: undefined,
  format: undefined,
  answerKey: undefined,
  setId: () => {},
  setFormat: () => {},
  setAnswerKey: () => {},
});

// Custom hook to use the context
export const useQuestionAttemptContext = () => useContext(QuestionAttemptContext);

// Provider component to wrap the app or specific parts of the app
export const QuestionAttemptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [id, setId] = useState<string | undefined>(undefined);
  const [format, setFormat] = useState<string | undefined>(undefined);
  const [answerKey, setAnswerKey] = useState<string | undefined>(undefined);
 

  return (
    <QuestionAttemptContext.Provider value={{ id, format, answerKey, setId, setFormat, setAnswerKey }}>
      {children}
    </QuestionAttemptContext.Provider>
  );
};