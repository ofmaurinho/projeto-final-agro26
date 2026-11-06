import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, router, useSegments } from "expo-router";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { auth, firebaseConfigured } from "@/firebase";
import { Colors } from "@/constants/theme";
import { ToastMessage } from "@/components/ui/toast-message";

export const unstable_settings = {
  anchor: "(auth)",
};

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [inicializado, setInicializado] = useState(false);
  const segments = useSegments();

  useEffect(() => {
    if (!firebaseConfigured) {
      setInicializado(true);
      return;
    }
    return onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      setInicializado(true);
    });
  }, []);

  useEffect(() => {
    if (!inicializado) return;
    const estaNoLogin = segments[0] === "(auth)";
    if (!user && !estaNoLogin) {
      router.replace("/(auth)");
    } else if (user && estaNoLogin) {
      router.replace("/(tabs)");
    }
  }, [inicializado, segments, user]);

  if (!inicializado) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="sessao-form"
          options={{ headerShown: true, title: "Sessão de estudo" }}
        />
        <Stack.Screen
          name="perfil"
          options={{ headerShown: true, title: "Meu perfil" }}
        />
      </Stack>
      <StatusBar style="dark" />
      <ToastMessage />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  carregando: {
    alignItems: "center",
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: "center",
  },
});
