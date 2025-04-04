
import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
    ReactNode,
  } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  // Tipo de cada ítem en el carrito
  interface CartItem {
    id: string;          // ID del plato/pedido
    name: string;        // Nombre del plato
    price: number;       // Precio unitario
    quantity: number;    // Cantidad elegida
  }
  
  // Tipo de estado del carrito (array de items)
  type CartState = CartItem[];
  
  // Acciones del reducer
  type CartAction =
    | { type: "ADD_ITEM"; payload: CartItem }
    | { type: "REMOVE_ITEM"; payload: { id: string } }
    | { type: "INCREMENT_ITEM"; payload: { id: string } }
    | { type: "DECREMENT_ITEM"; payload: { id: string } }
    | { type: "LOAD_CART"; payload: CartItem[] };
  
  const CART_STORAGE_KEY = "@myapp_cart";
  
  // Reducer del carrito
  function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
      case "LOAD_CART":
        return action.payload;
  
      case "ADD_ITEM": {
        const existingItem = state.find((item) => item.id === action.payload.id);
        if (existingItem) {
          // El ítem ya está, incrementamos su cantidad
          return state.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          );
        } else {
          // Ítem nuevo
          return [...state, action.payload];
        }
      }
  
      case "REMOVE_ITEM":
        return state.filter((item) => item.id !== action.payload.id);
  
      case "INCREMENT_ITEM":
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
  
      case "DECREMENT_ITEM":
        return state
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0);
  
      default:
        return state;
    }
  }
  
  // Tipo del contexto
  interface CartContextType {
    cart: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    incrementItem: (id: string) => void;
    decrementItem: (id: string) => void;
    loadCart: () => Promise<void>;
    clearCartStorage: () => Promise<void>;
  }
  
  // Crear el contexto
  const CartContext = createContext<CartContextType | undefined>(undefined);
  
  // Provider
  export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, []);
  
    // Cargar el carrito desde AsyncStorage
    const loadCart = useCallback(async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          const parsed = JSON.parse(storedCart);
          dispatch({ type: "LOAD_CART", payload: parsed });
        }
      } catch (error) {
        console.log("Error al cargar el carrito:", error);
      }
    }, []);
  
    // Guardar el carrito en AsyncStorage
    const saveCartToStorage = useCallback(
      async (newCart: CartState) => {
        try {
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
        } catch (error) {
          console.log("Error al guardar el carrito:", error);
        }
      },
      []
    );
  
    // Cada vez que 'cart' cambie, lo guardamos en AsyncStorage
    useEffect(() => {
      saveCartToStorage(cart);
    }, [cart, saveCartToStorage]);
  
    // Cargar el carrito al iniciar
    useEffect(() => {
      loadCart();
    }, [loadCart]);
  
    // Acciones
    const addItem = (item: CartItem) => {
      dispatch({ type: "ADD_ITEM", payload: item });
    };
  
    const removeItem = (id: string) => {
      dispatch({ type: "REMOVE_ITEM", payload: { id } });
    };
  
    const incrementItem = (id: string) => {
      dispatch({ type: "INCREMENT_ITEM", payload: { id } });
    };
  
    const decrementItem = (id: string) => {
      dispatch({ type: "DECREMENT_ITEM", payload: { id } });
    };
  
    const clearCartStorage = async () => {
      try {
        await AsyncStorage.removeItem(CART_STORAGE_KEY);
        dispatch({ type: "LOAD_CART", payload: [] });
      } catch (error) {
        console.log("Error al limpiar el carrito:", error);
      }
    };
  
    return (
      <CartContext.Provider
        value={{
          cart,
          addItem,
          removeItem,
          incrementItem,
          decrementItem,
          loadCart,
          clearCartStorage,
        }}
      >
        {children}
      </CartContext.Provider>
    );
  };
  
  // Hook personalizado para usar el contexto
  export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return context;
  };
  