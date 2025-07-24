import React, { createContext, useContext, useRef, ReactNode } from 'react';

type BottomSheetRefs = {
  personalInfo: React.RefObject<any>;
  subscription: React.RefObject<any>;
  invoice: React.RefObject<any>;
  accountVinted: React.RefObject<any>;
  language: React.RefObject<any>;
  notification: React.RefObject<any>;
  filters : React.RefObject<any>;
  autocopSetting : React.RefObject<any>;
  deliveryPreference : React.RefObject<any>;
  advencedSettings :  React.RefObject<any>;
  viewArticle :  React.RefObject<any>;
  viewArticleBuy :  React.RefObject<any>;
};

interface BottomSheetRefProviderProps {
    children: ReactNode
}

const BottomSheetContext = createContext<BottomSheetRefs | undefined>(undefined);

const BottomSheetRefProvider: React.FC<BottomSheetRefProviderProps> = ({ children }) => {
  const bottomSheetRefs: BottomSheetRefs = {
    personalInfo: useRef(null),
    subscription: useRef(null),
    invoice: useRef(null),
    accountVinted: useRef(null),
    language: useRef(null),
    notification: useRef(null),
    filters : useRef(null),
    autocopSetting : useRef(null),
    deliveryPreference : useRef(null),
    advencedSettings :  useRef(null),
    viewArticle :  useRef(null),
    viewArticleBuy :  useRef(null),
  };

  return (
    <BottomSheetContext.Provider value={bottomSheetRefs}>
      {children}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetRefProvider

export const useBottomSheetRef = (): BottomSheetRefs => {
    const context = useContext(BottomSheetContext);
    if (context === undefined) {
        throw new Error('useBottomSheet must be used within a BottomSheetProvider');
    }
    return context;
};
