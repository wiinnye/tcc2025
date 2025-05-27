import { db } from "../services/firebase";
import { doc, getDoc, setDoc} from "firebase/firestore";

/**
 * Salvar vídeo no documento 'libra' da coleção 'videos'
 * @param {string} titulo - Nome do campo
 * @param {string} url - URL do vídeo
 */

export async function buscarVideo(titulo) {
  try {
    const docRef = doc(db, "videos", "libra");
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
    console.error("❌ Erro ao buscar vídeo:", erro);
    throw erro;
  }
}


export async function salvarVideoNoFirestore(titulo, url) {
  try {
    const docRef = doc(db, "videos", "libra");

    await setDoc(docRef, {
      [titulo.toLowerCase()]: url
    }, { merge: true }); // 👈 Garante que não sobrescreva os outros campos

    console.log("✅ Vídeo salvo com sucesso no Firestore!");
  } catch (error) {
    console.error("❌ Erro ao salvar no Firestore:", error);
    throw error;
  }
}