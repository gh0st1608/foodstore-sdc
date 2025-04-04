import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, Pressable } from "react-native";
import { useAuth } from "../hooks/useAuth";
import ProfileSidebar from "./ProfileSideBar";
import MiniCart from "./MiniCart";

const { width, height } = Dimensions.get("window");
const defaultProfileImage = require("../../assets/images/default-profile.png");

function getFirstName(fullName: string) {
  return fullName.split(" ")[0];
}
function getFirstLastName(fullName: string) {
  return fullName.split(" ")[0];
}

const ProfilePreview: React.FC = () => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  // Si no hay usuario, retornamos null o algo simple
  if (!user) return null;

  return (

    <View style={styles.container}>

      <View style={styles.headerRow}>
        {/* Preview (solo se ve si no está expandido) */}
        {!isExpanded && (
          <Pressable onPress={toggleSidebar} style={styles.previewContainer}>
            <Text style={styles.name}>
              {getFirstName(user.firstName)} {getFirstLastName(user.lastName)}
            </Text>
            <Image
              source={user.profileImage ? { uri: user.profileImage } : defaultProfileImage}
              style={styles.profileImage}
            />
          </Pressable>
        )}

        <MiniCart />
      </View>

      {isExpanded && (
        <>

          <View style={styles.sidebar}>
            <View style={styles.sidebarContent}>
              <Text style={styles.sidebarTitle}>
                Perfil de {getFirstName(user.firstName)} {getFirstLastName(user.lastName)}
              </Text>
              <Image
                source={user.profileImage ? { uri: user.profileImage } : defaultProfileImage}
                style={styles.largeProfileImage}
              />
            </View>
            <ProfileSidebar />
          </View>
          <Pressable style={styles.overlay} onPress={toggleSidebar} />
        </>
      )}
    </View>
  );
};

export default ProfilePreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 5,
    left: 0,
    width,
    zIndex: 50,
  },
  headerRow: {

    marginTop: 30,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 51,
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.8,
    height: height,
    backgroundColor: "#fff",
    zIndex: 999,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  sidebarContent: {
    padding: 30,
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
    zIndex: 998,
  },
});
