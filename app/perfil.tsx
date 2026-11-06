import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import { ActionButton } from "@/components/ui/action-button";
import { Colors } from "@/constants/theme";
import { useFocusRefresh } from "@/hooks/use-focus-refresh";
import { auth, db, firebaseConfigured } from "@/firebase";

export default function PerfilScreen() {
  const [nomeExibicao, setNomeExibicao] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const carregarPerfil = useCallback(async () => {
    const user = auth.currentUser;
    if (!user || !firebaseConfigured) {
      setCarregando(false);
      return;
    }

    setCarregando(true);
    try {
      const perfil = await getDoc(doc(db, "perfis", user.uid));
      setNomeExibicao(
        perfil.exists() ? String(perfil.data().nomeExibicao ?? "") : "",
      );
    } catch {
      Toast.show({
        type: "error",
        text1: "Não foi possível carregar seu perfil.",
      });
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusRefresh(carregarPerfil);

  async function salvarPerfil() {
    const user = auth.currentUser;
    const nomeLimpo = nomeExibicao.trim();
    if (!user || !firebaseConfigured) {
      Toast.show({
        type: "error",
        text1: "Entre na conta e configure o Firebase antes de salvar.",
      });
      return;
    }
    if (!nomeLimpo) {
      Toast.show({ type: "error", text1: "Informe seu nome de exibição." });
      return;
    }

    setSalvando(true);
    try {
      await setDoc(
        doc(db, "perfis", user.uid),
        {
          uid: user.uid,
          nomeExibicao: nomeLimpo,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setNomeExibicao(nomeLimpo);
      Toast.show({ type: "success", text1: "Perfil atualizado." });
    } catch {
      Toast.show({
        type: "error",
        text1: "Não foi possível salvar seu perfil.",
      });
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Meu perfil</Text>
        <Text style={styles.rotulo}>E-mail da conta</Text>
        <Text selectable style={styles.email}>
          {auth.currentUser?.email ?? "E-mail indisponível"}
        </Text>
        <Text style={styles.rotulo}>Nome de exibição</Text>
        <TextInput
          onChangeText={setNomeExibicao}
          placeholder="Como quer ser chamado?"
          placeholderTextColor={Colors.muted}
          style={styles.input}
          value={nomeExibicao}
        />
        <ActionButton
          disabled={salvando}
          label={salvando ? "Salvando..." : "Salvar perfil"}
          onPress={salvarPerfil}
          variant="positive"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carregando: {
    alignItems: "center",
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    padding: 20,
    paddingTop: 24,
  },
  card: { backgroundColor: Colors.surface, borderRadius: 14, gap: 12, padding: 20 },
  titulo: { color: Colors.text, fontSize: 24, fontWeight: "800", marginBottom: 8 },
  rotulo: { color: Colors.muted, fontSize: 13, fontWeight: "700" },
  email: { color: Colors.primary, fontSize: 16, marginBottom: 6 },
  input: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderRadius: 9,
    borderWidth: 1,
    color: Colors.text,
    minHeight: 46,
    paddingHorizontal: 12,
  },
});
