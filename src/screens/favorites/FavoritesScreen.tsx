// 📂 src/screens/home/HomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FavoritesScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.text}>🏠 FavoritesScreen</Text>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default FavoritesScreen;
