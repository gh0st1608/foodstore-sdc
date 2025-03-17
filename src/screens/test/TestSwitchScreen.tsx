

import React, { useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";

const TestSwitchScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    console.log("Switch presionado, nuevo estado:", !isEnabled);
    setIsEnabled((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Prueba de Switch en Android</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#6200ee" }}
        thumbColor={isEnabled ? "#ffffff" : "#f4f4f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

export default TestSwitchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});
