import { useMemo, useState } from "react";
import { router } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FirebaseError } from "firebase/app";
import { deleteDoc, doc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { ActionButton } from "@/components/ui/action-button";
import { Colors } from "@/constants/theme";
import { useFocusRefresh } from "@/hooks/use-focus-refresh";
import { useMaterias } from "@/hooks/use-materias";
import { useSessoes, type SessaoEstudo } from "@/hooks/use-sessoes";
import { db } from "@/firebase";
import { formatarData } from "@/utils/date";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

function dataFormatada(sessao: SessaoEstudo) {
  return formatarData(sessao.data.toDate());
}

export default function SessoesScreen() {
  const { sessoes, carregando, carregarSessoes } = useSessoes();
  const { materias, carregarMaterias } = useMaterias();
  const [pesquisa, setPesquisa] = useState("");
  const [materiaFiltro, setMateriaFiltro] = useState<string | null>(null);
  const [sessaoParaExcluir, setSessaoParaExcluir] =
    useState<SessaoEstudo | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  useFocusRefresh(carregarSessoes);
  useFocusRefresh(carregarMaterias);

  const sessoesVisiveis = useMemo(() => {
    const termo = pesquisa.trim().toLocaleLowerCase();
    return sessoes.filter((sessao) => {
      const correspondeTexto =
        !termo ||
        sessao.titulo.toLocaleLowerCase().includes(termo) ||
        (sessao.descricao ?? "").toLocaleLowerCase().includes(termo);
      return (
        correspondeTexto &&
        (!materiaFiltro || sessao.materiaId === materiaFiltro)
      );
    });
  }, [materiaFiltro, pesquisa, sessoes]);

  async function excluirSessao() {
    if (!sessaoParaExcluir) return;

    setExcluindo(true);
    try {
      await deleteDoc(doc(db, "sessoes_estudo", sessaoParaExcluir.id));
      setSessaoParaExcluir(null);
      Toast.show({ type: "success", text1: "Sessão excluída." });
      await carregarSessoes();
    } catch (error: unknown) {
      Toast.show({
        type: "error",
        text1: "Não foi possível excluir a sessão.",
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
        data={sessoesVisiveis}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {carregando
              ? "Carregando sessões..."
              : sessoes.length
                ? "Nenhuma sessão corresponde à pesquisa ou ao filtro."
                : "Nenhuma sessão registrada. Toque em “Nova sessão” para começar."}
          </Text>
        }
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>Sessões de estudo</Text>
            <TextInput
              onChangeText={setPesquisa}
              placeholder="Pesquisar título ou descrição"
              placeholderTextColor={Colors.muted}
              style={styles.input}
              value={pesquisa}
            />
            <Text style={styles.rotuloFiltro}>Filtrar por matéria</Text>
            <View style={styles.filtros}>
              <TouchableOpacity
                onPress={() => setMateriaFiltro(null)}
                style={[
                  styles.filtro,
                  materiaFiltro === null && styles.filtroSelecionado,
                ]}
              >
                <Text
                  style={[
                    styles.filtroTexto,
                    materiaFiltro === null && styles.filtroTextoSelecionado,
                  ]}
                >
                  Todas
                </Text>
              </TouchableOpacity>
              {materias.map((materia) => (
                <TouchableOpacity
                  key={materia.id}
                  onPress={() => setMateriaFiltro(materia.id)}
                  style={[
                    styles.filtro,
                    materiaFiltro === materia.id && styles.filtroSelecionado,
                  ]}
                >
                  <Text
                    style={[
                      styles.filtroTexto,
                      materiaFiltro === materia.id &&
                        styles.filtroTextoSelecionado,
                    ]}
                  >
                    {materia.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <ActionButton
              label="Nova sessão"
              onPress={() => router.push("/sessao-form")}
              variant="positive"
            />
          </View>
        }
        renderItem={({ item }) => {
          const materia = materias.find(
            (registro) => registro.id === item.materiaId,
          );
          return (
            <View style={styles.card}>
              <View style={styles.cabecalhoCard}>
                <Text style={styles.nomeSessao}>{item.titulo}</Text>
                <Text style={styles.duracao}>{item.duracaoMinutos} min</Text>
              </View>
              <Text style={styles.info}>
                {materia?.nome ?? "Matéria indisponível"} · {dataFormatada(item)}
              </Text>
              {!!item.descricao && (
                <Text style={styles.descricao}>{item.descricao}</Text>
              )}
              <View style={styles.acoes}>
                <View style={styles.botaoAcao}>
                  <ActionButton
                    label="Alterar"
                    onPress={() =>
                      router.push({
                        pathname: "/sessao-form",
                        params: { id: item.id },
                      })
                    }
                    variant="outline"
                  />
                </View>
                <View style={styles.botaoAcao}>
                  <ActionButton
                    label="Excluir"
                    onPress={() => setSessaoParaExcluir(item)}
                    variant="danger"
                  />
                </View>
              </View>
            </View>
          );
        }}
        style={styles.container}
      />
      <ConfirmationModal
        confirmLabel="Excluir sessão"
        loading={excluindo}
        message={
          sessaoParaExcluir
            ? `Deseja excluir "${sessaoParaExcluir.titulo}"? Esta ação não pode ser desfeita.`
            : ""
        }
        onCancel={() => setSessaoParaExcluir(null)}
        onConfirm={excluirSessao}
        title="Excluir sessão"
        visible={sessaoParaExcluir !== null}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background },
  lista: { flexGrow: 1, gap: 10, padding: 18, paddingTop: 24 },
  cabecalho: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    gap: 12,
    marginBottom: 8,
    padding: 18,
  },
  titulo: { color: Colors.text, fontSize: 24, fontWeight: "800" },
  input: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderRadius: 9,
    borderWidth: 1,
    color: Colors.text,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  rotuloFiltro: { color: Colors.text, fontSize: 14, fontWeight: "700" },
  filtros: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filtro: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filtroSelecionado: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filtroTexto: { color: Colors.text, fontSize: 13 },
  filtroTextoSelecionado: { color: Colors.surface, fontWeight: "700" },
  card: {
    backgroundColor: Colors.surface,
    borderLeftColor: Colors.accent,
    borderLeftWidth: 4,
    borderRadius: 12,
    gap: 8,
    padding: 15,
  },
  cabecalhoCard: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nomeSessao: { color: Colors.primary, flex: 1, fontSize: 17, fontWeight: "700" },
  duracao: { color: Colors.positive, fontSize: 14, fontWeight: "700" },
  info: { color: Colors.muted, fontSize: 13 },
  descricao: { color: Colors.text, fontSize: 14, lineHeight: 20 },
  acoes: { flexDirection: "row", gap: 8, marginTop: 4 },
  botaoAcao: { flex: 1 },
  vazio: { color: Colors.muted, lineHeight: 21, padding: 8 },
});
