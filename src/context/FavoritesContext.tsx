
import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
    ReactNode,
  } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
//   import { mockAddFavorite, mockRemoveFavorite } from "../api/favoritesApi";
  // Tipo de acción y estado
  type FavoritesState = string[]; // Array de dish IDs
  type FavoritesAction =
    | { type: "LOAD_FAVORITES"; payload: string[] }
    | { type: "ADD_FAVORITE"; payload: string }
    | { type: "REMOVE_FAVORITE"; payload: string };
  
  // Key para AsyncStorage
  const FAVORITES_STORAGE_KEY = "@myapp_favorites";
  
  // Reducer
  function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
    switch (action.type) {
      case "LOAD_FAVORITES":
        return action.payload;
  
      case "ADD_FAVORITE":
        // Evitar duplicados
        if (state.includes(action.payload)) return state;
        return [...state, action.payload];
  
      case "REMOVE_FAVORITE":
        return state.filter((id) => id !== action.payload);
  
      default:
        return state;
    }
  }
  
  // Tipo del contexto
  interface FavoritesContextType {
    favorites: string[]; // IDs de platos marcados como favoritos
    addFavorite: (dishId: string) => void;
    removeFavorite: (dishId: string) => void;
    isFavorite: (dishId: string) => boolean;
    loadFavorites: () => Promise<void>;
    clearFavoritesStorage: () => Promise<void>;
  }
  
  // Crear el contexto
  const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
  
  // Provider
  export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [favorites, dispatch] = useReducer(favoritesReducer, []);
  
    // Cargar favoritos de AsyncStorage
    const loadFavorites = useCallback(async () => {
      try {
        const storedFavs = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (storedFavs) {
          const parsed = JSON.parse(storedFavs) as string[];
          dispatch({ type: "LOAD_FAVORITES", payload: parsed });
        }
      } catch (error) {
        console.log("Error al cargar favoritos:", error);
      }
    }, []);
  
    // Guardar en AsyncStorage
    const saveFavoritesToStorage = useCallback(
      async (newFavs: string[]) => {
        try {
          await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavs));
        } catch (error) {
          console.log("Error al guardar favoritos:", error);
        }
      },
      []
    );
  
    // Guardar cada vez que el array cambie
    useEffect(() => {
      saveFavoritesToStorage(favorites);
    }, [favorites, saveFavoritesToStorage]);
  
    // Cargar al inicio
    useEffect(() => {
      loadFavorites();
    }, [loadFavorites]);
  
    // Acciones
    const addFavorite = (dishId: string) => {
      dispatch({ type: "ADD_FAVORITE", payload: dishId });
    };
  
    const removeFavorite = (dishId: string) => {
      dispatch({ type: "REMOVE_FAVORITE", payload: dishId });
    };
  
    const isFavorite = (dishId: string) => {
      return favorites.includes(dishId);
    };

    // Ejemplo

// api simulation
// const addFavorite = async (dishId: string) => {
//   await mockAddFavorite(dishId);
//   dispatch({ type: "ADD_FAVORITE", payload: dishId });
// };

// const removeFavorite = async (dishId: string) => {
//   await mockRemoveFavorite(dishId);
//   dispatch({ type: "REMOVE_FAVORITE", payload: dishId });
// };

  
    const clearFavoritesStorage = async () => {
      try {
        await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
        dispatch({ type: "LOAD_FAVORITES", payload: [] });
      } catch (error) {
        console.log("Error al limpiar favoritos:", error);
      }
    };
  
    return (
      <FavoritesContext.Provider
        value={{
          favorites,
          addFavorite,
          removeFavorite,
          isFavorite,
          loadFavorites,
          clearFavoritesStorage,
        }}
      >
        {children}
      </FavoritesContext.Provider>
    );
  };
  
  // Hook para consumir el contexto
  export const useFavorites = (): FavoritesContextType => {
    const context = useContext(FavoritesContext);
    if (!context) {
      throw new Error("useFavorites debe usarse dentro de un FavoritesProvider");
    }
    return context;
  };
  