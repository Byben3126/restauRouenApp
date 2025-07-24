import { StyleSheet, ActivityIndicator } from 'react-native'
import React, { createContext, useContext, useCallback, ReactNode, useState, }  from 'react'
import { Container, Icon } from '@/components/atoms'
import { BlurView } from 'expo-blur';
interface LoaderProviderProps {
    children: ReactNode
}

interface LoaderContextProps {
    setLoader: (state: boolean) => void;
}

const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);

const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
    const [display, setDisplay] = useState(false)
    
    const setLoader = useCallback((state:boolean)=> {
        setDisplay(state)
    },[])

  return (
    <LoaderContext.Provider value={{setLoader}}>
      {display && <BlurView style={styles.overlay} intensity={12}>
        <BlurView style={styles.loader} intensity={70}>
            <ActivityIndicator size={'small'} style={{transform: [{scale: 1.6}]}}/>
        </BlurView>
      </BlurView>}
      {children}
    </LoaderContext.Provider>
  );
}

export default LoaderProvider

export const useLoader = (): LoaderContextProps => {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(36, 36, 36, 0.09)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loader: {
    height:150,
    width:150,

    backgroundColor: 'rgba(37, 38, 57, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    overflow:'hidden',
  }
})



