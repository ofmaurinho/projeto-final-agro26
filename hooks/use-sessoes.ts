import { useCallback, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import { auth, db, firebaseConfigured } from "@/firebase";

export interface SessaoEstudo {
  id: string;
  titulo: string;
  materiaId: string;
  data: Timestamp;
  duracaoMinutos: number;
  descricao?: string;
  uid: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function useSessoes() {
  const [sessoes, setSessoes] = useState<SessaoEstudo[]>([]);
  const [carregando, setCarregando] = useState(false);

  const carregarSessoes = useCallback(async () => {
    const user = auth.currentUser;
    if (!firebaseConfigured || !user) {
      setSessoes([]);
      return;
    }

    setCarregando(true);
    try {
      const resultado = await getDocs(
        query(
          collection(db, "sessoes_estudo"),
          where("uid", "==", user.uid),
        ),
      );
      setSessoes(
        resultado.docs
          .map((registro) => ({
            id: registro.id,
            ...registro.data(),
          }) as SessaoEstudo)
          .sort((a, b) => b.data.toMillis() - a.data.toMillis()),
      );
    } catch {
      Toast.show({
        type: "error",
        text1: "Não foi possível carregar as sessões",
        text2: "Verifique sua conexão e as regras do Firestore.",
      });
    } finally {
      setCarregando(false);
    }
  }, []);

  return { sessoes, carregando, carregarSessoes };
}
