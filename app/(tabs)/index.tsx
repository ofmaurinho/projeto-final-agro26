import { useCallback, useState } from "react";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { ActionButton } from "@/components/ui/action-button";
import { useFocusRefresh } from "@/hooks/use-focus-refresh";
import { useMaterias } from "@/hooks/use-materias";
import { useSessoes } from "@/hooks/use-sessoes";
import { auth, db, firebaseConfigured } from "@/firebase";
import { Colors } from "@/constants/theme";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

function formatarDuracao(minutos: number) {
  const horas = Math.floor(minutos / 60);
  const restante = minutos % 60;
  return horas > 0 ? `${horas} h ${restante} min` : `${restante} min`;
}

export default function InicioScreen() {
  const { sessoes, carregando, carregarSessoes } = useSessoes();
  const { materias, carregarMaterias } = useMaterias();
  const [nomeExibicao, setNomeExibicao] = useState("");
  const [confirmarLogout, setConfirmarLogout] = useState(false);
  const [saindo, setSaindo] = useState(false);

  const carregarNomeExibicao = useCallback(async () => {
    const user = auth.currentUser;
    if (!user || !firebaseConfigured) {
      setNomeExibicao("");
      return;
    }

    try {
      const perfil = await getDoc(doc(db, "perfis", user.uid));
      setNomeExibicao(
        perfil.exists() ? String(perfil.data().nomeExibicao ?? "").trim() : "",
      );
    } catch {
      Toast.show({
        type: "error",
        text1: "Não foi possível carregar seu nome de exibição.",
      });
    }
  }, []);

  useFocusRefresh(carregarSessoes);
  useFocusRefresh(carregarMaterias);
  useFocusRefresh(carregarNomeExibicao);

  const totaisPorMateria = materias
    .map((materia) => ({
      id: materia.id,
      nome: materia.nome,
      minutos: sessoes
        .filter((sessao) => sessao.materiaId === materia.id)
        .reduce((total, sessao) => total + sessao.duracaoMinutos, 0),
    }))
    .filter((item) => item.minutos > 0);

  const sair = useCallback(async () => {
    setSaindo(true);
    try {
      await signOut(auth);
      router.replace("/(auth)");
      setConfirmarLogout(false);
    } catch {
      Toast.show({
        type: "error",
        text1: "Não foi possível encerrar a sessão",
      });
    } finally {
      setSaindo(false);
    }
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topo}>
          <View>
            <Text style={styles.eyebrow}>SEU PROGRESSO</Text>
            <Text style={styles.titulo}>
              Olá, {nomeExibicao || "estudante"}
            </Text>
          </View>
          <View style={styles.acoesTopo}>
            <ActionButton
              label="Perfil"
              onPress={() => router.push("/perfil")}
              variant="outline"
            />
            <ActionButton
              label="Sair"
              onPress={() => setConfirmarLogout(true)}
              variant="outline"
            />
          </View>
        </View>

        {carregando ? (
          <ActivityIndicator color={Colors.primary} size="large" />
        ) : (
          <View style={styles.metricas}>
            <View style={styles.metrica}>
              <Text style={styles.numero}>{sessoes.length}</Text>
              <Text style={styles.rotulo}>sessões registradas</Text>
            </View>
            <View style={[styles.metrica, styles.metricaVerde]}>
              <Text style={styles.numero}>
                {formatarDuracao(
                  sessoes.reduce(
                    (total, sessao) => total + sessao.duracaoMinutos,
                    0,
                  ),
                )}
              </Text>
              <Text style={styles.rotulo}>tempo estudado</Text>
            </View>
          </View>
        )}

        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Tempo por matéria</Text>
          {totaisPorMateria.length ? (
            totaisPorMateria.map((item) => (
              <View key={item.id} style={styles.linhaMateria}>
                <Text style={styles.nomeMateria}>{item.nome}</Text>
                <Text style={styles.tempoMateria}>
                  {formatarDuracao(item.minutos)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.vazio}>
              Seus totais por matéria aparecerão depois que você registrar
              sessões.
            </Text>
          )}
        </View>

        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Continue sua trilha</Text>
          <Text style={styles.vazio}>
            Cadastre matérias e sessões para acompanhar sua rotina de estudos.
          </Text>
          <ActionButton
            label="Registrar sessão"
            onPress={() => router.push("/sessao-form")}
            variant="positive"
          />
        </View>
      </ScrollView>
      <ConfirmationModal
        confirmLabel="Sair"
        loading={saindo}
        message="Deseja encerrar sua sessão?"
        onCancel={() => setConfirmarLogout(false)}
        onConfirm={sair}
        title="Sair da conta"
        visible={confirmarLogout}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flexGrow: 1,
    gap: 20,
    padding: 20,
    paddingTop: 28,
  },
  topo: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eyebrow: { color: Colors.positive, fontSize: 11, fontWeight: "800" },
  titulo: { color: Colors.text, fontSize: 26, fontWeight: "800", marginTop: 4 },
  acoesTopo: { flexDirection: "row", gap: 8 },
  metricas: { flexDirection: "row", gap: 12 },
  metrica: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderLeftColor: Colors.accent,
    borderLeftWidth: 4,
    flex: 1,
    gap: 6,
    padding: 16,
  },
  metricaVerde: { borderLeftColor: Colors.positive },
  numero: { color: Colors.primary, fontSize: 22, fontWeight: "800" },
  rotulo: { color: Colors.muted, fontSize: 13 },
  secao: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    gap: 12,
    padding: 18,
  },
  tituloSecao: { color: Colors.text, fontSize: 18, fontWeight: "700" },
  linhaMateria: {
    borderBottomColor: Colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  nomeMateria: { color: Colors.text, fontSize: 15 },
  tempoMateria: { color: Colors.positive, fontSize: 15, fontWeight: "700" },
  vazio: { color: Colors.muted, fontSize: 14, lineHeight: 21 },
});
