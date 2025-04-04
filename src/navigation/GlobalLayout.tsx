
import React from "react";
import { View, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import ProfilePreview from "../components/ProfilePreview";
import MainTabs from "./MainTabs";
import MiniCart from "../components/MiniCart";

type GlobalLayoutProps = {
  children: React.ReactNode;
};

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const route = useRoute(); // Saber la ruta actual

  if (route.name === "Checkout") {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <ProfilePreview />
        {/* <MiniCart /> */}
      </View>
      {children}
      {/* <MainTabs /> */}
    </View>
  );
};

export default GlobalLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
