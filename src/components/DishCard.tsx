
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { useCart } from "../context/CartContext";

interface Dish {
  id: string;
  name: string;
  price: number;
  // más campos si deseas
}

interface DishCardProps {
  dish: Dish;
}

const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { addItem } = useCart();
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddToCart = () => {
    // Agregamos con quantity=1
    addItem({ ...dish, quantity: 1 });
    setModalVisible(true);

    // Ocultar el modal después de 2 seg
    setTimeout(() => {
      setModalVisible(false);
    }, 2000);
  };

  return (
    <View style={styles.card}>
      <Pressable onPress={handleAddToCart}>
        <Text style={styles.cardName}>{dish.name}</Text>
        <Text style={styles.cardPrice}>$ {dish.price}</Text>
        <Text style={styles.cardSubtitle}>Toca para agregar</Text>
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {dish.name} se ha agregado al carrito
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DishCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fafafa",
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardPrice: {
    marginTop: 4,
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
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
