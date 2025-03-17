import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NotificationsScreen from "../../screens/notifications/NotificationsScreen";
import EditProfileScreen from "../../screens/profile/EditProfileScreen";
import MyOrders from "../../screens/orders/MyOrders";

const Stack = createStackNavigator();

const NotificationsTab = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
    id={undefined}
    >
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="MyOrders" component={MyOrders} />
    </Stack.Navigator>
  );
};

export default NotificationsTab;
