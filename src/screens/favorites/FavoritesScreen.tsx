
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryCard from "../../components/CategoryCard";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";


type NavigationProps = StackNavigationProp<RootStackParamList, "Favorites">;

interface CategoryData {
  id: number;
  title: string;
  imageUrl: string;
  additionalInfo?: string;
}

const categories: CategoryData[] = [
  {
    id: 1,
    title: "Pizzas",
    imageUrl: "https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg",
  },
  {
    id: 2,
    title: "Hamburguesas",
    imageUrl: "https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg",
    additionalInfo: "Opcional Info", 
  },
  {
    id: 3,
    title: "Ensaladas",
    imageUrl: "https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg",
  },
  {
    id: 4,
    title: "Sopas",
    imageUrl: "https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg",
  },
  {
    id: 5,
    title: "Bebidas",
    imageUrl: "https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg",
  },
  {
    id: 6,
    title: "Postres",
    imageUrl: "https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg",
  },
];

const FavoritesScreen = () => {
  const navigation = useNavigation<NavigationProps>();

  const handlePressCategory = (categoryId: number) => {
    // Navegar a la pantalla de platos, enviando el ID de la categoría
    navigation.navigate("CategoryDishes", { categoryId });
  };

  const renderItem = ({ item }: { item: CategoryData }) => (
    <CategoryCard
      title={item.title}
      imageUrl={item.imageUrl}
      additionalInfo={item.additionalInfo}
      onPress={() => handlePressCategory(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Tus Categorías Favoritas</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2} // 2 columnas
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 10,
    textAlign: "center",
  },
  listContent: {
    // Aplica un pequeño padding al contenido
    paddingTop: 20,
    paddingBottom: 20,
  },
});
