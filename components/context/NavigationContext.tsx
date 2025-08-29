import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context
interface NavigationContextProps {
  categoryId: string | undefined;     // id for this question attempt
  setCategoryId: React.Dispatch<React.SetStateAction<string | undefined>>;
  categoryName: string | undefined;   // name for this question attempt
  setCategoryName: React.Dispatch<React.SetStateAction<string | undefined>>;
  subCategoryId: string | undefined;     // id for this question attempt
  setSubCategoryId: React.Dispatch<React.SetStateAction<string | undefined>>;
  subCategoryName: string | undefined;   // name for this question attempt
  setSubCategoryName: React.Dispatch<React.SetStateAction<string | undefined>>;
  unitId: string | undefined;     // id for this question attempt
  setUnitId: React.Dispatch<React.SetStateAction<string | undefined>>;
  unitName: string | undefined;   // name for this question attempt
  setUnitName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// Create the context with default values
const NavigationContext = createContext<NavigationContextProps>({
  categoryId: undefined,
  setCategoryId: () => {},
  categoryName: undefined,
  setCategoryName: () => {},
  subCategoryId: undefined,
  setSubCategoryId: () => {},
  subCategoryName: undefined,
  setSubCategoryName: () => {},
  unitId: undefined,
  setUnitId: () => {},
  unitName: undefined,
  setUnitName: () => {},
});

// Custom hook to use the context
export const useNavigationContext = () => useContext(NavigationContext);

// Provider component to wrap the app or specific parts of the app
export const NavigationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [categoryName, setCategoryName] = useState<string | undefined>(undefined);
  const [subCategoryId, setSubCategoryId] = useState<string | undefined>(undefined);
  const [subCategoryName, setSubCategoryName] = useState<string | undefined>(undefined);
  const [unitId, setUnitId] = useState<string | undefined>(undefined);
  const [unitName, setUnitName] = useState<string | undefined>(undefined);

  return (
    <NavigationContext.Provider value={{ 
      categoryId,  setCategoryId , 
      subCategoryId, setSubCategoryId,
      categoryName, setCategoryName,
      subCategoryName, setSubCategoryName
      , unitId, setUnitId,
      unitName, setUnitName
    
     }}
      >
      {children}
    </NavigationContext.Provider>
  );
};