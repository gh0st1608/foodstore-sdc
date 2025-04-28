
import React from "react";
import { View, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import ProfilePreview from "../components/ProfilePreview";
import MainTabs from "./MainTabs";

type GlobalLayoutProps = {
  children: React.ReactNode;
};

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const route = useRoute(); // Saber la ruta actual

  // Si la pantalla actual es "Checkout", NO se muestra ProfilePreview
  if (route.name === "Checkout") {
    return <View style={styles.container}>{children}</View>;
  }

  // En cualquier otra ruta, muestra ProfilePreview arriba
  return (
    <View style={styles.container}>
      <ProfilePreview />
      {children}
      {/* <MainTabs /> */}
    </View>
  );
};

export default GlobalLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
