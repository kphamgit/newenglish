import { QueryClient } from '@tanstack/react-query';
//import { PaperProvider } from 'react-native-paper';


import { View } from 'react-native';
///import { Provider } from 'react-redux';
//import { PersistGate } from 'redux-persist/integration/react';
import Home from '../components/Home';
//import { persistor, store } from '../redux/store/store';


const queryClient = new QueryClient();

export default function Index() {
    {/* Expo Router will handle navigation automatically */}
  // the file index.tsx is the entry point for the app
  return (

            <View style={{ flex: 1 }}>  
                <Home />
            </View>

  );
}
