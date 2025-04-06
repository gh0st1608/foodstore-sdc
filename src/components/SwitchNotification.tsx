
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Switch } from "react-native-paper";
import { useNotifications } from "../context/NotificationsContext";

const SwitchNotification = () => {
  const { promotionsOn, togglePromotions, addNotification } = useNotifications();

  const handleTogglePromos = () => {
    const newVal = !promotionsOn;
    togglePromotions(newVal);

    // Ejemplo: Disparar una promo en el momento de encender
    if (newVal) {
      addNotification("promo", "¡Nueva promo en Pizzas! 2x1 hoy");
    }
  };

  return (
    <View style={styles.menuItem}>
      <Text style={styles.menuText}>Notificaciones Promo</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#6200ee" }}
        thumbColor={promotionsOn ? "#ffffff" : "#f4f4f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={handleTogglePromos}
        value={promotionsOn}
      />
    </View>
  );
};

export default SwitchNotification;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
});
