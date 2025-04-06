
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import { useNotifications } from "../context/NotificationsContext";

const AUTO_HIDE_MS = 20000; // 20s

const NotificationModal = () => {
  const { notifications, removeNotification, promotionsOn } = useNotifications();

  const [visible, setVisible] = useState(false);
  const [currentNotif, setCurrentNotif] = useState<any>(null);

  useEffect(() => {
    // Filtrar not read
    const notRead = notifications
      .filter((n) => !n.read)
      .sort((a, b) => b.date - a.date);

    if (notRead.length > 0) {
      // Tomamos la más reciente
      const latest = notRead[0];

      // Si es promo y promosOn== false => no la mostramos
      if (latest.type === "promo" && !promotionsOn) {
        // skip
        setCurrentNotif(null);
        setVisible(false);
        return;
      }

      setCurrentNotif(latest);
      setVisible(true);

      // Auto hide en 20s
      const timer = setTimeout(() => {
        setVisible(false);
        // removeNotification(latest.id);
      }, AUTO_HIDE_MS);

      return () => clearTimeout(timer);
    } else {
      setCurrentNotif(null);
      setVisible(false);
    }
  }, [notifications, promotionsOn]);

  if (!currentNotif) return null;

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{currentNotif.message}</Text>
          <Pressable style={styles.closeBtn} onPress={handleClose}>
            <Text style={styles.closeBtnText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 8,
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeBtn: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 4,
    alignSelf: "center",
  },
  closeBtnText: {
    fontWeight: "bold",
  },
});
