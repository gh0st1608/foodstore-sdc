import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useCart } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

type MiniCartProps = {
  mode?: "items" | "price";
};

const MiniCart: React.FC<MiniCartProps> = ({ mode = "items" }) => {
  const { cart } = useCart();
  const navigation = useNavigation<any>();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  let displayText = "";
  if (mode === "items") {
    displayText = totalItems.toString();
  } else {
    displayText = "$" + totalPrice.toFixed(2);
  }

  const handlePress = () => {
    navigation.navigate("CartTab"); 
  };

  return (
    <Pressable style={styles.miniCartContainer} onPress={handlePress}>
      <MaterialIcons name="shopping-cart" size={24} color="#fff" />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{displayText}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default MiniCart;

const styles = StyleSheet.create({
  miniCartContainer: {
    position: "absolute",
    right: 20,
    top: 5,
    padding: 10,
    backgroundColor: "tomato",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    marginLeft: 4,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 5,
    alignItems: "center",
  },
  badgeText: {
    color: "tomato",
    fontWeight: "bold",
  },
});
