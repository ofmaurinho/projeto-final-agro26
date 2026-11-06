import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import Toast from "react-native-toast-message";
import { ActionButton } from "@/components/ui/action-button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Colors } from "@/constants/theme";
import { useFocusRefresh } from "@/hooks/use-focus-refresh";
import { useMaterias, type Materia } from "@/hooks/use-materias";
import { auth, db, firebaseConfigured } from "@/firebase";

export default function MateriasScreen() {
  const { materias, carregando, carregarMaterias } = useMaterias();
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [materiaParaExcluir, setMateriaParaExcluir] =
    useState<Materia | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  useFocusRefresh(carregarMaterias);

  async function cadastrarMateria() {
    const user = auth.currentUser;
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) {
      Toast.show({ type: "error", text1: "Informe o nome da matéria." });
      return;
    }
    if (!firebaseConfigured || !user) {
      Toast.show({
        type: "error",
        text1: "Entre na conta e configure o Firebase antes de salvar.",
      });
      return;
    }

    setSalvando(true);
    try {
      await addDoc(collection(db, "materias"), {
        nome: nomeLimpo,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      setNome("");
      Toast.show({ type: "success", text1: "Matéria cadastrada." });
      await carregarMaterias();
    } catch {
      Toast.show({
        type: "error",
        text1: "Não foi possível cadastrar a matéria.",
      });
    } finally {
      setSalvando(false);
    }
  }

  async function excluirMateria() {
    const user = auth.currentUser;
    if (!materiaParaExcluir || !user || !firebaseConfigured) {
      Toast.show({
        type: "error",
        text1: "Não foi possível validar a exclusão da matéria.",
      });
      return;
    }

    setExcluindo(true);
    try {
      const resultado = await getDocs(
        query(
          collection(db, "sessoes_estudo"),
          where("uid", "==", user.uid),
        ),
      );
      const possuiSessoes = resultado.docs.some(
        (sessao) => sessao.data().materiaId === materiaParaExcluir.id,
      );

      if (possuiSessoes) {
        setMateriaParaExcluir(null);
        Toast.show({
          type: "error",
          text1: "Esta matéria ainda possui sessões",
          text2: "Exclua ou altere as sessões vinculadas antes de removê-la.",
        });
        return;
      }

      await deleteDoc(doc(db, "materias", materiaParaExcluir.id));
      setMateriaParaExcluir(null);
      Toast.show({ type: "success", text1: "Matéria excluída." });
      await carregarMaterias();
    } catch (error: unknown) {
      Toast.show({
        type: "error",
        text1: "Não foi possível excluir a matéria.",
        text2:
          error instanceof FirebaseError && error.code === "permission-denied"
            ? "Publique as regras atualizadas do Firestore e tente novamente."
            : "Verifique sua conexão e tente novamente.",
      });
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <>
      <FlatList
        contentContainerStyle={styles.lista}
        data={materias}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {carregando
              ? "Carregando matérias..."
              : "Nenhuma matéria cadastrada. Adicione a primeira acima."}
          </Text>
        }
        ListHeaderComponent={
          <View style={styles.formulario}>
            <Text style={styles.titulo}>Suas matérias</Text>
            <Text style={styles.descricao}>
              Organize as matérias que você está estudando.
            </Text>
            <TextInput
              onChangeText={setNome}
              placeholder="Nome da matéria"
              placeholderTextColor={Colors.muted}
              style={styles.input}
              value={nome}
            />
            <ActionButton
              disabled={salvando}
              label={salvando ? "Salvando..." : "Adicionar matéria"}
              onPress={cadastrarMateria}
              variant="positive"
            />
            <Text style={styles.subtitulo}>Matérias cadastradas</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.indicador} />
            <Text style={styles.nome}>{item.nome}</Text>
            <TouchableOpacity
              accessibilityLabel={`Excluir matéria ${item.nome}`}
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setMateriaParaExcluir(item)}
              style={styles.botaoExcluir}
            >
              <Ionicons
                color={Colors.danger}
                name="trash-outline"
                size={18}
              />
            </TouchableOpacity>
          </View>
        )}
        style={styles.container}
      />
      <ConfirmationModal
        confirmLabel="Excluir matéria"
        loading={excluindo}
        message={
          materiaParaExcluir
            ? `Deseja excluir "${materiaParaExcluir.nome}"? Matérias com sessões vinculadas não podem ser excluídas.`
            : ""
        }
        onCancel={() => setMateriaParaExcluir(null)}
        onConfirm={excluirMateria}
        title="Excluir matéria"
        visible={materiaParaExcluir !== null}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background },
  lista: { flexGrow: 1, gap: 10, padding: 18, paddingTop: 24 },
  formulario: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    gap: 12,
    marginBottom: 8,
    padding: 18,
  },
  titulo: { color: Colors.text, fontSize: 24, fontWeight: "800" },
  descricao: { color: Colors.muted, fontSize: 14, lineHeight: 20 },
  input: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderRadius: 9,
    borderWidth: 1,
    color: Colors.text,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  subtitulo: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 12,
  },
  card: {
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
    padding: 12,
  },
  botaoExcluir: {
    alignItems: "center",
    borderRadius: 18,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  indicador: {
    backgroundColor: Colors.accent,
    borderRadius: 3,
    height: 34,
    width: 5,
  },
  nome: { color: Colors.text, flex: 1, fontSize: 16, fontWeight: "600" },
  vazio: {
    color: Colors.muted,
    lineHeight: 21,
    paddingHorizontal: 4,
    paddingVertical: 16,
  },
});
