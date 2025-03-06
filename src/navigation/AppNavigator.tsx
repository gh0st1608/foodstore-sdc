import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { useAuth } from "../hooks/useAuth"; // ✅ Usa el hook useAuth()

const AppNavigator = () => {
  const { user } = useAuth(); // ✅ Ahora se obtiene correctamente el usuario

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
