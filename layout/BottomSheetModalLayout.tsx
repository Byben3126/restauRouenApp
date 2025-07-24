import React, { ReactNode, forwardRef, useImperativeHandle, useRef, useCallback, createContext, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { SharedValue } from 'react-native-reanimated';
import { BottomSheetView, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Container } from '../components/atoms';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { BottomSheetModalProps } from '@gorhom/bottom-sheet';

type BottomSheetModalLayoutProps<T = any> = BottomSheetModalProps<T> & {
  disablePadding?: boolean;
  children: ReactNode;
};

// interface BottomSheetModalLayoutProps {
//   index?: number;
//   snapPoints?: Array<string | number> | SharedValue<Array<string | number>> | Readonly<(string | number)[] | SharedValue<(string | number)[]>>;
//   onChange?: (index: number) => void;
//   children: ReactNode;
//   disablePadding?: Boolean;
// }

interface BottomSheetContextProps {
  close: () => void;
  bottomSheetModalRef: React.MutableRefObject<BottomSheetModalMethods>;
}

const BottomSheetContext = createContext<BottomSheetContextProps | undefined>(undefined);

const BottomSheetModalLayout = forwardRef<BottomSheetModal, BottomSheetModalLayoutProps>(({children, disablePadding=false, ...rest}, ref) => {

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);


    useImperativeHandle(ref, () => ({
      present: () => bottomSheetModalRef.current?.present(),
      dismiss: () => bottomSheetModalRef.current?.dismiss(),
      snapToIndex: (index: number) => bottomSheetModalRef.current?.snapToIndex(index),
      snapToPosition: (position: number) => bottomSheetModalRef.current?.snapToPosition(position),
      expand: () => bottomSheetModalRef.current?.expand(),
      collapse: () => bottomSheetModalRef.current?.collapse(),
      close: () => bottomSheetModalRef.current?.forceClose(),
      forceClose: () => bottomSheetModalRef.current?.forceClose(),
    }));

    const close = useCallback(() => {
      bottomSheetModalRef.current?.close()
    }, []);

    return (
      
        
        <BottomSheetModal
          ref={bottomSheetModalRef}
          backgroundStyle={styles.backgroundStyle}
          handleStyle={styles.handleStyle}
          handleIndicatorStyle={styles.handleIndicatorStyle}
          style={styles.bottomSheetModal}
          {...rest}
        
        >
          <BottomSheetView style={styles.bottomSheetView}>
            <Container.DismissKeyboard>
              <LinearGradient  style={[styles.linearGradient, { paddingHorizontal: disablePadding ? 0 : 25}]} colors={['#F4E9FF', '#FFFFFF']} locations={[0, 0.36]}>
                  <BottomSheetContext.Provider value={{close, bottomSheetModalRef}}>
                    {children}
                  </BottomSheetContext.Provider>
              </LinearGradient>
            </Container.DismissKeyboard>
          </BottomSheetView>
        </BottomSheetModal>
   
    );
  }
);

export const useBottomSheetContext = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheetContext must be used within a BottomSheetModalLayout');
  }
  return context;
};

const styles = StyleSheet.create({
  bottomSheetModal : {
    borderTopRightRadius: 33, 
    borderTopLeftRadius: 33, 
    overflow: 'hidden',
    borderTopWidth: 2,
    borderColor : '#fff',
    backgroundColor : '#F4E9FF',
  },
  backgroundStyle : {
    borderRadius : 33,
    overflow:'hidden',
    backgroundColor : '#F4E9FF',
  },

  handleStyle : {
    marginHorizontal: 40,
    // backgroundColor : 'red',
    paddingTop: 10,
    paddingBottom: 15,
  },

  handleIndicatorStyle : {
    color: '#fff',
    backgroundColor : '#fff',
    width : 74,
    height: 4,
  },

  bottomSheetView: {
    flexGrow: 1,
  },

  linearGradient : {
    flexGrow: 1,
  }
});



export default BottomSheetModalLayout;
