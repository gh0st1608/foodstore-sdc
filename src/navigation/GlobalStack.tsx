// Ejemplo de GlobalStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GlobalLayout from "./GlobalLayout";
import MainTabs from "./MainTabs";  
// import CheckoutScreen from "../screens/checkout/CheckoutScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import MyOrders from "../screens/orders/MyOrders";
// etc.

const Stack = createStackNavigator();

const GlobalStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
    id={undefined}
    >

      <Stack.Screen
        name="MainTabs"
        children={() => (
          <GlobalLayout>
            <MainTabs />

          </GlobalLayout>
        )}
      />
      {/* <Stack.Screen
        name="Checkout"
        children={() => (
          <GlobalLayout>
            <CheckoutScreen />
          </GlobalLayout>
        )}
      /> */}
      <Stack.Screen
        name="EditProfile"
        children={() => (
          <GlobalLayout>
            <EditProfileScreen />
            <MainTabs />
          </GlobalLayout>
        )}
      />
      <Stack.Screen
        name="MyOrders"
        children={() => (
          <GlobalLayout>
            <MyOrders />
          </GlobalLayout>
        )}
      />
      {/* etc... */}
    </Stack.Navigator>
  );
};

export default GlobalStack;
