
import React from "react";
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  onPress: () => void;
  additionalInfo?: string; // Prop opcional con info extra
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageUrl, onPress, additionalInfo }) => {
  return (
    <Pressable style={styles.cardContainer} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.cardImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        {additionalInfo && <Text style={styles.info}>{additionalInfo}</Text>}
      </View>
    </Pressable>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: (width / 2) - 20,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  cardImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    padding: 5,
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "100%",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  info: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
  },
});
