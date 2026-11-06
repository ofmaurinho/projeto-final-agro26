import { useCallback, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import { ActionButton } from "@/components/ui/action-button";
import { Colors } from "@/constants/theme";
import { useFocusRefresh } from "@/hooks/use-focus-refresh";
import { useMaterias } from "@/hooks/use-materias";
import { auth, db, firebaseConfigured } from "@/firebase";
import { converterDataBrasileira, formatarData } from "@/utils/date";

export default function SessaoFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { materias, carregarMaterias } = useMaterias();
  const [titulo, setTitulo] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [data, setData] = useState(formatarData(new Date()));
  const [duracao, setDuracao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const carregarFormulario = useCallback(async () => {
    if (!id) {
      setTitulo("");
      setMateriaId("");
      setData(formatarData(new Date()));
      setDuracao("");
      setDescricao("");
      return;
    }

    setCarregando(true);
    try {
      const resultado = await getDoc(doc(db, "sessoes_estudo", id));
      const user = auth.currentUser;
      if (!resultado.exists() || !user || resultado.data().uid !== user.uid) {
        Toast.show({
          type: "error",
          text1: "Sessão não encontrada ou sem permissão.",
        });
        router.back();
        return;
      }
      const sessao = resultado.data();
      setTitulo(sessao.titulo);
      setMateriaId(sessao.materiaId);
      setData(formatarData((sessao.data as Timestamp).toDate()));
      setDuracao(String(sessao.duracaoMinutos));
      setDescricao(sessao.descricao ?? "");
    } catch {
      Toast.show({
        type: "error",
        text1: "Não foi possível carregar a sessão.",
      });
      router.back();
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useFocusRefresh(carregarFormulario);
  useFocusRefresh(carregarMaterias);

  async function salvar() {
    const user = auth.currentUser;
    const duracaoNumerica = Number(duracao);
    if (!firebaseConfigured || !user) {
      Toast.show({
        type: "error",
        text1: "Entre na conta e configure o Firebase antes de salvar.",
      });
      return;
    }
    if (!titulo.trim()) {
      Toast.show({ type: "error", text1: "Informe o título da sessão." });
      return;
    }
    if (!materiaId || !materias.some((materia) => materia.id === materiaId)) {
      Toast.show({
        type: "error",
        text1: "Selecione uma matéria cadastrada.",
      });
      return;
    }
    const dataDaSessao = converterDataBrasileira(data);
    if (!dataDaSessao) {
      Toast.show({
        type: "error",
        text1: "Informe uma data válida no formato DD/MM/AAAA.",
      });
      return;
    }
    if (!Number.isSafeInteger(duracaoNumerica) || duracaoNumerica <= 0) {
      Toast.show({
        type: "error",
        text1: "A duração deve ser um número inteiro maior que zero.",
      });
      return;
    }

    setSalvando(true);
    try {
      const referenciaMateria = await getDoc(doc(db, "materias", materiaId));
      if (
        !referenciaMateria.exists() ||
        referenciaMateria.data().uid !== user.uid
      ) {
        Toast.show({
          type: "error",
          text1: "A matéria selecionada não está disponível para sua conta.",
        });
        return;
      }

      const campos = {
        titulo: titulo.trim(),
        materiaId,
        data: Timestamp.fromDate(dataDaSessao),
        duracaoMinutos: duracaoNumerica,
        descricao: descricao.trim(),
        uid: user.uid,
        updatedAt: serverTimestamp(),
      };
      if (id) {
        await updateDoc(doc(db, "sessoes_estudo", id), campos);
      } else {
        await addDoc(collection(db, "sessoes_estudo"), {
          ...campos,
          createdAt: serverTimestamp(),
        });
      }
      Toast.show({
        type: "success",
        text1: id ? "Sessão alterada." : "Sessão cadastrada.",
      });
      router.back();
    } catch {
      Toast.show({
        type: "error",
        text1: "Não foi possível salvar a sessão.",
        text2: "Confira sua conexão e as regras do Firestore.",
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>
        {id ? "Alterar sessão" : "Nova sessão de estudo"}
      </Text>

      <Text style={styles.rotulo}>Título</Text>
      <TextInput
        onChangeText={setTitulo}
        placeholder="Ex.: Revisão de funções"
        placeholderTextColor={Colors.muted}
        style={styles.input}
        value={titulo}
      />

      <Text style={styles.rotulo}>Matéria</Text>
      {materias.length ? (
        <View style={styles.opcoes}>
          {materias.map((materia) => (
            <TouchableOpacity
              key={materia.id}
              onPress={() => setMateriaId(materia.id)}
              style={[
                styles.opcao,
                materiaId === materia.id && styles.opcaoSelecionada,
              ]}
            >
              <Text
                style={[
                  styles.textoOpcao,
                  materiaId === materia.id && styles.textoOpcaoSelecionada,
                ]}
              >
                {materia.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.ajuda}>
          Cadastre uma matéria na aba Matérias antes de criar uma sessão.
        </Text>
      )}

      <Text style={styles.rotulo}>Data (DD/MM/AAAA)</Text>
      <TextInput
        onChangeText={setData}
        placeholder="30/04/2026"
        placeholderTextColor={Colors.muted}
        style={styles.input}
        value={data}
      />

      <Text style={styles.rotulo}>Duração em minutos</Text>
      <TextInput
        keyboardType="number-pad"
        onChangeText={setDuracao}
        placeholder="Ex.: 45"
        placeholderTextColor={Colors.muted}
        style={styles.input}
        value={duracao}
      />

      <Text style={styles.rotulo}>Descrição (opcional)</Text>
      <TextInput
        multiline
        onChangeText={setDescricao}
        placeholder="Anotações sobre o que estudou"
        placeholderTextColor={Colors.muted}
        style={[styles.input, styles.campoDescricao]}
        value={descricao}
      />

      <ActionButton
        disabled={salvando || materias.length === 0}
        label={salvando ? "Salvando..." : id ? "Salvar alterações" : "Cadastrar sessão"}
        onPress={salvar}
        variant="positive"
      />
      <ActionButton
        label="Cancelar"
        onPress={() => router.back()}
        variant="outline"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  carregando: {
    alignItems: "center",
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: "center",
  },
  container: { backgroundColor: Colors.background, flexGrow: 1, gap: 10, padding: 20 },
  titulo: { color: Colors.text, fontSize: 24, fontWeight: "800", marginBottom: 8 },
  rotulo: { color: Colors.text, fontSize: 14, fontWeight: "700", marginTop: 5 },
  input: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 9,
    borderWidth: 1,
    color: Colors.text,
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  campoDescricao: { minHeight: 90, textAlignVertical: "top" },
  opcoes: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  opcao: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  opcaoSelecionada: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  textoOpcao: { color: Colors.text, fontSize: 14 },
  textoOpcaoSelecionada: { color: Colors.surface, fontWeight: "700" },
  ajuda: { color: Colors.muted, lineHeight: 20 },
});
