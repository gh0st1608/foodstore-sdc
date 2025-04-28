
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import GlobalStack from "./GlobalStack";
import { useAuth } from "../hooks/useAuth";

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user ? <GlobalStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
