import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function buscarVideo(titulo) {
  try {
    const docRef = doc(db, "videos", "libra"); // nome da coleção e do documento
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dados = docSnap.data();
      const tituloFormatado = titulo.trim().toLowerCase();

      if (dados[tituloFormatado]) {
        return { url: dados[tituloFormatado], encontrado: true };
      } else {
        return { url: null, encontrado: false };
      }
    } else {
      return { url: null, encontrado: false };
    }
  } catch (erro) {
    console.error("Erro ao buscar vídeo:", erro);
    throw erro;
  }
}
