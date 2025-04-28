import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Text, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();

    const handleLogin = () => {
        setLoading(true);
        const fakeUser = {
            id: 1,
            firstName: "Juan Carlos",
            lastName: "Fernández Gómez",
            profileImage: null,
        };
        setUser(fakeUser);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Logo */}
                <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.logo} />

                <Text style={styles.title}>Bienvenido</Text>
                <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

                {/* Campo de Email */}
                <TextInput
                    label="Correo Electrónico"
                    mode="outlined"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />

                {/* Campo de Contraseña */}
                <TextInput
                    label="Contraseña"
                    mode="outlined"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                />

                {/* Botón de Login */}
                <Button mode="contained" onPress={handleLogin} style={styles.button} disabled={loading}>
                    {loading ? <ActivityIndicator animating color="#fff" /> : "Iniciar Sesión"}
                </Button>

                <Text style={styles.footerText}>¿No tienes una cuenta? Regístrate aquí</Text>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: "gray",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        marginBottom: 10,
    },
    button: {
        width: "100%",
        marginTop: 10,
        backgroundColor: "#6200ee",
    },
    footerText: {
        marginTop: 20,
        color: "gray",
    },
});

export default LoginScreen;
