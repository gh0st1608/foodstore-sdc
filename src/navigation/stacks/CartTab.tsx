import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CartScreen from "../../screens/cart/CartScreen";
import EditProfileScreen from "../../screens/profile/EditProfileScreen";
import MyOrders from "../../screens/orders/MyOrders";


const Stack = createStackNavigator();

const CartTab = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
    id={undefined}
    >
      <Stack.Screen name="CartScreen" component={CartScreen} />
      {/* <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="MyOrders" component={MyOrders} /> */}

    </Stack.Navigator>
  );
};

export default CartTab;
