import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import Toast from "react-native-toast-message";
import { ActionButton } from "@/components/ui/action-button";
import { Colors } from "@/constants/theme";
import { auth, firebaseConfigured } from "@/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!firebaseConfigured) {
      Toast.show({
        type: "error",
        text1: "Firebase não configurado",
        text2: "Preencha as variáveis locais indicadas em .env.example.",
      });
      return;
    }
    if (!email.trim() || !senha) {
      Toast.show({
        type: "error",
        text1: "Informe e-mail e senha",
      });
      return;
    }

    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch {
      Toast.show({
        type: "error",
        text1: "Não foi possível entrar",
        text2: "Confira o e-mail e a senha e tente novamente.",
      });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.conteudo}>
        <Text style={styles.marca}>Trilha de Estudos</Text>
        <Text style={styles.subtitulo}>Seu caminho de aprendizagem, organizado.</Text>
        <View style={styles.card}>
          <Text style={styles.titulo}>Acesse sua conta</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="E-mail"
            placeholderTextColor={Colors.muted}
            style={styles.input}
            value={email}
          />
          <TextInput
            autoCapitalize="none"
            onChangeText={setSenha}
            placeholder="Senha"
            placeholderTextColor={Colors.muted}
            secureTextEntry
            style={styles.input}
            value={senha}
          />
          {carregando ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <ActionButton label="Entrar" onPress={entrar} />
          )}
        </View>
        <Text style={styles.aviso}>Use uma conta habilitada no Firebase Authentication.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  conteudo: { gap: 12 },
  marca: {
    color: Colors.surface,
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitulo: {
    color: "#E4EDF2",
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    gap: 14,
    padding: 22,
  },
  titulo: { color: Colors.primary, fontSize: 21, fontWeight: "700" },
  input: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderRadius: 9,
    borderWidth: 1,
    color: Colors.text,
    minHeight: 48,
    paddingHorizontal: 13,
  },
  aviso: { color: "#E4EDF2", fontSize: 12, textAlign: "center" },
});
