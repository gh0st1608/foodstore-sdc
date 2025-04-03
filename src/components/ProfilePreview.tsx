import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, Platform } from "react-native";
import { Pressable } from "react-native";
import { useAuth } from "../hooks/useAuth";
import ProfileSidebar from "./ProfileSideBar";


const { width, height } = Dimensions.get("window");

// Imagen por defecto almacenada en assets/images
const defaultProfileImage = require("../../assets/images/default-profile.png");

// Función para extraer el primer nombre y primer apellido
const getFirstName = (fullName: string) => fullName.split(" ")[0];
const getFirstLastName = (fullName: string) => fullName.split(" ")[0];

const ProfilePreview: React.FC = () => {
  const { user } = useAuth(); // Obtener el usuario desde el contexto
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      
      {/* Botón de preview del perfil */}
      {!isExpanded &&       <Pressable onPress={toggleSidebar} style={styles.previewContainer}>
        <Text style={styles.name}>
          {user ? `${getFirstName(user.firstName)} ${getFirstLastName(user.lastName)}` : "Cargando..."}
        </Text>
        <Image 
          source={user?.profileImage ? { uri: user.profileImage } : defaultProfileImage} 
          style={styles.profileImage} 
        />
      </Pressable>}


      {/* Sidebar estático */}
      {isExpanded && user && (
        <>
          <View style={styles.sidebar}>
            <View style={styles.sidebarContent}>
              <Text style={styles.sidebarTitle}>Perfil de {getFirstName(user.firstName)} {getFirstLastName(user.lastName)}</Text>
              <Image 
                source={user.profileImage ? { uri: user.profileImage } : defaultProfileImage} 
                style={styles.largeProfileImage} 
              />
            </View>
            <ProfileSidebar />
          </View>

          {/* Fondo opaco cubriendo solo el 20% restante */}
          <Pressable style={styles.overlay} onPress={toggleSidebar} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 30,
    left: 0,
    zIndex: 10,
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    // elevation: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  sidebar: {
    position: "relative",
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.8,
    height: height,
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 999,
    ...Platform.select({
      ios: {
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.2,
        // shadowRadius: 4,
      },
      android: {
        // elevation: 10,
      },
      web: {
        // borderWidth: 1,
        borderColor: "#ddd",
      },
    }),
  },
  sidebarContent: {
    padding: 20,
    alignItems: "center",
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  largeProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ddd",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: width * 0.8,
    width: width * 0.2,
    height: height,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default ProfilePreview;
