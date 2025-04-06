
import React, {
    createContext,
    useContext,
    useReducer,
    useCallback,
    useEffect,
    ReactNode,
  } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import "react-native-get-random-values";
  import { v4 as uuidv4 } from "uuid"; // Para IDs únicos
  
  export type NotificationType = "promo" | "status";
  
  export interface NotificationItem {
    id: string;
    type: NotificationType;    // "promo" o "status"
    message: string;
    date: number;              // timestamp
    read: boolean;
    validUntil?: number;       // fecha de validez (timestamp), si aplica
  }
  
  // Estado global: si promos están encendidas, y la lista de notifs
  interface NotificationsState {
    promotionsOn: boolean;
    notifications: NotificationItem[];
  }
  
  type NotificationsAction =
    | { type: "LOAD_STATE"; payload: NotificationsState }
    | { type: "TOGGLE_PROMOTIONS"; payload: boolean }
    | { type: "ADD_NOTIFICATION"; payload: NotificationItem }
    | { type: "MARK_AS_READ"; payload: string }
    | { type: "REMOVE_NOTIFICATION"; payload: string }
    | { type: "CLEAR_ALL" };
  
  const NOTIFICATIONS_STORAGE_KEY = "@myapp_notifications_state";
  
  function notificationsReducer(state: NotificationsState, action: NotificationsAction): NotificationsState {
    switch (action.type) {
      case "LOAD_STATE":
        return action.payload;
  
      case "TOGGLE_PROMOTIONS":
        return { ...state, promotionsOn: action.payload };
  
      case "ADD_NOTIFICATION":
        return {
          ...state,
          // añadimos la nueva notificación al inicio
          notifications: [action.payload, ...state.notifications],
        };
  
      case "MARK_AS_READ":
        return {
          ...state,
          notifications: state.notifications.map((notif) =>
            notif.id === action.payload ? { ...notif, read: true } : notif
          ),
        };
  
      case "REMOVE_NOTIFICATION":
        return {
          ...state,
          notifications: state.notifications.filter((n) => n.id !== action.payload),
        };
  
      case "CLEAR_ALL":
        return { ...state, notifications: [] };
  
      default:
        return state;
    }
  }
  
  interface NotificationsContextType {
    promotionsOn: boolean;
    notifications: NotificationItem[];
  
    togglePromotions: (on: boolean) => void;
  
    // Agrega una notificación: type, mensaje, etc.
    addNotification: (type: NotificationType, message: string, validUntil?: number) => void;
  
    markAsRead: (id: string) => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
  
    // Simulación (status) para probar
    simulateOrderStatus?: () => void;
  }
  
  // Crear el contexto
  const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);
  
  export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = React.useReducer(notificationsReducer, {
      promotionsOn: true, // por defecto encendidas
      notifications: [],
    });
  
    // Cargar estado de AsyncStorage
    const loadState = useCallback(async () => {
      try {
        const stored = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        if (stored) {
          const parsed: NotificationsState = JSON.parse(stored);
          dispatch({ type: "LOAD_STATE", payload: parsed });
        }
      } catch (error) {
        console.log("Error al cargar notifs state:", error);
      }
    }, []);
  
    // Guardar en AsyncStorage
    const saveState = useCallback(
      async (newState: NotificationsState) => {
        try {
          await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newState));
        } catch (error) {
          console.log("Error al guardar notifs state:", error);
        }
      },
      []
    );
  
    // Efecto para guardar cuando cambie el state
    useEffect(() => {
      saveState(state);
    }, [state, saveState]);
  
    // Cargar al montar
    useEffect(() => {
      loadState();
    }, [loadState]);
  
    // Acciones
    const togglePromotions = (on: boolean) => {
      dispatch({ type: "TOGGLE_PROMOTIONS", payload: on });
    };
  
    // Agregar notificación
    const addNotification = (type: NotificationType, message: string, validUntil?: number) => {
      const newItem: NotificationItem = {
        id: uuidv4(),
        type,
        message,
        date: Date.now(),
        read: false,
        validUntil,
      };
      dispatch({ type: "ADD_NOTIFICATION", payload: newItem });
    };
  
    const markAsRead = (id: string) => {
      dispatch({ type: "MARK_AS_READ", payload: id });
    };
  
    const removeNotification = (id: string) => {
      dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
    };
  
    const clearAll = () => {
      dispatch({ type: "CLEAR_ALL" });
    };
  
    // Simulación: disparar notifs de "status" a intervalos
    const simulateOrderStatus = () => {
      // Ejemplo
      setTimeout(() => {
        addNotification("status", "Tu pedido está preparándose");
      }, 2000);
      setTimeout(() => {
        addNotification("status", "Tu pedido va en camino");
      }, 7000);
      setTimeout(() => {
        addNotification("status", "Tu pedido fue entregado 🎉");
      }, 12000);
    };
  
    return (
      <NotificationsContext.Provider
        value={{
          promotionsOn: state.promotionsOn,
          notifications: state.notifications,
          togglePromotions,
          addNotification,
          markAsRead,
          removeNotification,
          clearAll,
          simulateOrderStatus,
        }}
      >
        {children}
      </NotificationsContext.Provider>
    );
  };
  
  // Hook para usar el contexto
  export function useNotifications(): NotificationsContextType {
    const context = React.useContext(NotificationsContext);
    if (!context) {
      throw new Error("useNotifications debe usarse dentro de NotificationsProvider");
    }
    return context;
  }
  