import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CartScreen from "../../screens/cart/CartScreen";
import EditProfileScreen from "../../screens/profile/EditProfileScreen";
import MyOrders from "../../screens/orders/MyOrders";
import MainTabs from "../MainTabs";


const Stack = createStackNavigator();

const EditProfileTab = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
    id={undefined}
    >
      {/* <Stack.Screen name="Cart" component={CartScreen} /> */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      

    </Stack.Navigator>
    
  );
};

export default EditProfileTab;
