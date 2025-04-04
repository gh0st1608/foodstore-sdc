// src/screens/cart/CartScreen.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useCart } from "../../context/CartContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {
    const { cart, removeItem, incrementItem, decrementItem } = useCart();
    const navigation = useNavigation();
    const renderItem = ({ item }: any) => (
        
        <View style={styles.itemContainer}>

            <Text style={styles.itemName}>
                {item.name} (x{item.quantity})
            </Text>
            <Text style={styles.itemPrice}>$ {item.price}</Text>

            <View style={styles.actions}>
                <Pressable style={styles.actionBtn} onPress={() => decrementItem(item.id)}>
                    <Text style={styles.actionText}>-</Text>
                </Pressable>

                <Pressable style={styles.actionBtn} onPress={() => incrementItem(item.id)}>
                    <Text style={styles.actionText}>+</Text>
                </Pressable>

                <Pressable style={[styles.actionBtn, { backgroundColor: "red" }]}
                    onPress={() => removeItem(item.id)}
                >
                    <Text style={styles.actionText}>Remove</Text>
                </Pressable>
            </View>
        </View>
    );

    const getTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="black" />
      </Pressable>
                <Text style={styles.header}>Carrito de Compras</Text>

                {cart.length === 0 ? (
                    <Text style={styles.emptyText}>El carrito está vacío</Text>
                ) : (
                    <>
                        <FlatList
                            data={cart}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                        />
                        <Text style={styles.totalText}>Total: $ {getTotal().toFixed(2)}</Text>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    backButton: {
        
    },
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
        position: "relative",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
        position: "absolute",
        top: 90,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    emptyText: {
        marginTop: 20,
        fontSize: 16,
    },
    itemContainer: {
        backgroundColor: "#fafafa",
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    itemPrice: {
        marginTop: 5,
    },
    actions: {
        flexDirection: "row",
        marginTop: 8,
    },
    actionBtn: {
        backgroundColor: "#6200ee",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
        marginRight: 8,
    },
    actionText: {
        color: "#fff",
    },
    totalText: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "right",
    },
});
