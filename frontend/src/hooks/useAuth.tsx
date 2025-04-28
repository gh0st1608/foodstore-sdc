import React, { createContext, useContext, useState, ReactNode } from "react";

// Definir el tipo del contexto de autenticación
interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

// Crear el contexto con valor inicial `undefined`
const AuthContext = createContext<AuthContextType | null>(null);

// Usuario de prueba reutilizable
const fakeUser = {
  id: 1,
  firstName: "Juan Carlos",
  lastName: "Fernández Gómez",
  profileImage: null, // Simulando que no ha subido imagen
};

// Proveedor del contexto de autenticación
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

// Exportar `fakeUser` para reutilizar en `LoginScreen.tsx`
export { fakeUser };
