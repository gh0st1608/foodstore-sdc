import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FavoritesScreen from "../../screens/favorites/FavoritesScreen";
import EditProfileScreen from "../../screens/profile/EditProfileScreen";
import MyOrders from "../../screens/orders/MyOrders";
import CategoryDishesScreen from "../../screens/category/CategoryDishesScreen";

const Stack = createStackNavigator();

const FavoritesTab = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
    id={undefined}
    >
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="CategoryDishes" component={CategoryDishesScreen} />
      <Stack.Screen name="MyOrders" component={MyOrders} />
    </Stack.Navigator>
  );
};

export default FavoritesTab;
