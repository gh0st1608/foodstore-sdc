
import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useNotifications, NotificationItem } from "../../context/NotificationsContext";

const NotificationsScreen = () => {
  const { notifications, removeNotification, clearAll, promotionsOn } = useNotifications();

  // Filtrar notificaciones válidas
  const now = Date.now();
  const validNotifications = notifications.filter((n) => {
    // Si la notificación venció, la descartamos
    if (n.validUntil && n.validUntil < now) return false;

    // Si es promo pero promosOff => no la mostramos
    if (n.type === "promo" && !promotionsOn) return false;

    return true;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>

      {validNotifications.length === 0 ? (
        <Text>No hay notificaciones disponibles</Text>
      ) : (
        <FlatList
          data={validNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItemRow item={item} removeNotification={removeNotification} />}
        />
      )}

      <Pressable onPress={clearAll} style={styles.clearAllBtn}>
        <Text style={styles.clearAllText}>Limpiar todas</Text>
      </Pressable>
    </View>
  );
};

function NotificationItemRow({
  item,
  removeNotification,
}: {
  item: NotificationItem;
  removeNotification: (id: string) => void;
}) {
  return (
    <View style={styles.notifItem}>
      <Text style={styles.notifMessage}>{item.message}</Text>
      <Pressable onPress={() => removeNotification(item.id)} style={styles.removeBtn}>
        <Text style={styles.removeBtnText}>X</Text>
      </Pressable>
    </View>
  );
}

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    position: "relative",
    top: 100,
    paddingBottom: 160
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  notifItem: {
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 6,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notifMessage: {
    fontSize: 16,
    flex: 1,
  },
  removeBtn: {
    marginLeft: 8,
    backgroundColor: "#ddd",
    borderRadius: 4,
    padding: 5,
  },
  removeBtnText: {
    fontWeight: "bold",
  },
  clearAllBtn: {
    marginTop: 20,
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 4,
  },
  clearAllText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
