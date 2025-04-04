// Ejemplo de GlobalStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GlobalLayout from "./GlobalLayout";
import MainTabs from "./MainTabs";  
// import CheckoutScreen from "../screens/checkout/CheckoutScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import MyOrders from "../screens/orders/MyOrders";
import CartScreen from "../screens/cart/CartScreen";
import MiniCart from "../components/MiniCart";
import CartTab from "./stacks/CartTab";


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

      <Stack.Screen
        name="EditProfile"
        children={() => (
          <GlobalLayout>
            <EditProfileScreen />
            {/* <MainTabs /> */}
          </GlobalLayout>
        )}
      />
            <Stack.Screen
        name="CartTab"
        children={() => (
          <GlobalLayout>
            <CartScreen />
            {/* <MainTabs /> */}
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

    </Stack.Navigator>
  );
};

export default GlobalStack;
