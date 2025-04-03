
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.text}>🏠 SearchScreen</Text>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
        position: "relative",
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
        // justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        position: "absolute",
        top: 90,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default SearchScreen;
