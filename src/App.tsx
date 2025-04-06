import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
// import MainNavigator from './navigation/MainNavigator';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { NotificationsProvider } from './context/NotificationsContext';
import NotificationModal from './components/NotificationModal';

export default function App() {
    console.log("App se esta renderizando");
  return (

    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <NotificationsProvider>
            <NotificationModal />
            <AppNavigator />
          </NotificationsProvider>

        </FavoritesProvider>

      </CartProvider>
    </AuthProvider>
  );
}

