import { useCallback, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { auth, db, firebaseConfigured } from "@/firebase";

export interface Materia {
  id: string;
  nome: string;
  cor?: string;
  uid: string;
}

export function useMaterias() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [carregando, setCarregando] = useState(false);

  const carregarMaterias = useCallback(async () => {
    const user = auth.currentUser;
    if (!firebaseConfigured || !user) {
      setMaterias([]);
      return;
    }

    setCarregando(true);
    try {
      const resultado = await getDocs(
        query(collection(db, "materias"), where("uid", "==", user.uid)),
      );
      setMaterias(
        resultado.docs.map((registro) => ({
          id: registro.id,
          ...registro.data(),
        })) as Materia[],
      );
    } catch {
      Toast.show({
        type: "error",
        text1: "Não foi possível carregar as matérias",
        text2: "Verifique sua conexão e as regras do Firestore.",
      });
    } finally {
      setCarregando(false);
    }
  }, []);

  return { materias, carregando, carregarMaterias };
}
