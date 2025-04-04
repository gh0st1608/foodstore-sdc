import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../screens/home/HomeScreen";
import EditProfileScreen from "../../screens/profile/EditProfileScreen";
import MyOrders from "../../screens/orders/MyOrders";


const Stack = createStackNavigator();

const HomeTab = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
    id={undefined}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* <Stack.Screen name="EditProfile" component={EditProfileScreen} /> */}
      {/* <Stack.Screen name="MyOrders" component={MyOrders} /> */}
    </Stack.Navigator>
  );
};

export default HomeTab;
