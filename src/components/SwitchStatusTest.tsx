
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Switch } from "react-native-paper";
import { useNotifications } from "../context/NotificationsContext";

const SwitchStatusTest = () => {
  const { simulateOrderStatus } = useNotifications();

  const [statusFlowOn, setStatusFlowOn] = useState(false);

  const handleToggleStatus = () => {
    const newVal = !statusFlowOn;
    setStatusFlowOn(newVal);

    if (newVal) {
      // Al encender, disparamos la simulación
      simulateOrderStatus?.();
    }
  };

  return (
    <View style={styles.menuItem}>
      <Text style={styles.menuText}>Simular Status Pedidos</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#6200ee" }}
        thumbColor={statusFlowOn ? "#ffffff" : "#f4f4f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={handleToggleStatus}
        value={statusFlowOn}
      />
    </View>
  );
};

export default SwitchStatusTest;

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
