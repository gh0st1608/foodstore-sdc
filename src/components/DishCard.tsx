
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

interface Dish {
  id: string;
  name: string;
  price: number;
  isVegan?: boolean;
  description?: string;
}

interface DishCardProps {
  dish: Dish;
}

const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { addItem } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const [modalVisible, setModalVisible] = useState(false);

    // Modal para confirmar que se agregó / quitó de favoritos
    const [favModalVisible, setFavModalVisible] = useState(false);
    const [favModalMessage, setFavModalMessage] = useState("");

  const handleAddToCart = () => {
    addItem({ ...dish, quantity: 1 });
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 1000);
  };

  // Maneja el toggle de favoritos y muestra un modal de confirmación
  const handleToggleFavorite = () => {
    if (isFavorite(dish.id)) {
      removeFavorite(dish.id);
      setFavModalMessage(`${dish.name} se quitó de favoritos`);
    } else {
      addFavorite(dish.id);
      setFavModalMessage(`${dish.name} se agregó a favoritos`);
    }

    // Mostrar modal
    setFavModalVisible(true);
    // Ocultarlo tras 1 seg
    setTimeout(() => {
      setFavModalVisible(false);
      setFavModalMessage("");
    }, 1000);
  };

  const favIconName = isFavorite(dish.id) ? "favorite" : "favorite-border";

  return (
    <View style={styles.card}>
      {/* Row con info del plato y un ícono de favorito */}
      <View style={styles.row}>
        <View style={styles.dishInfo}>
          <Text style={styles.cardName}>{dish.name}</Text>
          <Text style={styles.cardPrice}>$ {dish.price}</Text>
          {dish.isVegan && <Text style={styles.veganTag}>Vegan</Text>}
          <Text style={styles.cardDescription}>{dish.description}</Text>
          {/* <Text style={styles.cardSubtitle}>Toca para agregar al carrito</Text> */}
        </View>

        {/* Ícono de favorito a la derecha */}
        <Pressable onPress={handleToggleFavorite}>
          <MaterialIcons name={favIconName} size={24} color="#f33" flex={1} />
        </Pressable>
      </View>

      {/* Área clickeable para agregar al carrito */}
      <Pressable onPress={handleAddToCart} style={styles.addButton}>
        <Text style={styles.addButtonText}>Agregar al Carrito</Text>
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{dish.name} se ha agregado al carrito</Text>
          </View>
        </View>
      </Modal>

            {/* Modal de confirmación para favoritos */}
            <Modal visible={favModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{favModalMessage}</Text>
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
    padding: 5,
    marginBottom: 8,
    borderRadius: 6,
    width: 150,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dishInfo: {
    maxWidth: "80%",
  },
  cardName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardPrice: {
    marginTop: 4,
  },
  cardDescription: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
  veganTag: {
    marginTop: 2,
    fontSize: 12,
    color: "green",
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
  },
  addButton: {
    marginTop: 8,
    backgroundColor: "#6200ee",
    padding: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
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
