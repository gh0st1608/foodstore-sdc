import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './navigation/MainNavigator';
import { AuthProvider } from './hooks/useAuth';

export default function App() {
    console.log("App se esta renderizando");
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app! src</Text>
    //   <Button title="Click me" 
    //     onPress={() => 
    //     {
    //         console.log('Hola devlfer')
    //         alert('Hola devlfer')
    //     }
    //     }
    //   />
    //   <StatusBar style="auto" />
    // </View>
    <AuthProvider>
        <AppNavigator />
    </AuthProvider>
  );
}

