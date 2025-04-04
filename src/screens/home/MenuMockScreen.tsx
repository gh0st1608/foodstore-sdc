
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { Snackbar } from "react-native-paper";
import { useCart } from "../../context/CartContext";

const dishesMock = [
  { id: "dish1", name: "Pizza Margarita", price: 10 },
  { id: "dish2", name: "Hamburguesa Doble", price: 12 },
];

const MenuMockScreen = () => {
  const { addItem } = useCart();
  // Estados para el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [addedDishName, setAddedDishName] = useState<string | null>(null);
  const handleAddDish = (dish: any) => {
    addItem({ ...dish, quantity: 1 }); // Estructura CartItem


    setAddedDishName(dish.name);
    setModalVisible(true);

    // Cerramos el modal automáticamente tras 2s
    setTimeout(() => {
      setModalVisible(false);
      setAddedDishName(null);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Platos Mock</Text>
      {dishesMock.map((dish) => (
        <Pressable
          key={dish.id}
          style={styles.card}
          onPress={() => handleAddDish(dish)}
        >
          <Text style={styles.cardText}>{dish.name} - $ {dish.price}</Text>
          <Text style={styles.cardSubtitle}>Toca para agregar</Text>
        </Pressable>
      ))}

<Modal
        visible={modalVisible}
        transparent
        animationType="fade"  // o 'slide'
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {addedDishName} se ha agregado al carrito
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MenuMockScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#fafafa",
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  cardText: { fontSize: 16, fontWeight: "bold" },
  cardSubtitle: { fontSize: 12, color: "#666" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // semitransparente
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
