import { db } from "../services/firebase";
import { doc, query, where, getDocs, addDoc, collection} from "firebase/firestore";


/**
 * Salvar vídeo no documento 'libra' da coleção 'videos'
 * @param {string} titulo - Nome do campo
 * @param {string} url - URL do vídeo
 * @param {string} categoria - URL do vídeo
 */

export async function buscarVideo(titulo) {
  try {
    const docRef = doc(db, "videos", "libra");
    const docSnap = await getDocs(docRef);

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


// 👉 BUSCAR vídeos da categoria (com nome e url)
export async function buscarVideosDaCategoria(categoria) {
  const videosRef = collection(db, "videos");
  const q = query(videosRef, where("categoria", "==", categoria));
  const querySnapshot = await getDocs(q);
  const resultados = [];
  querySnapshot.forEach((doc) => {
    resultados.push(doc.data());
  });
  return resultados;
}
// 👉 BUSCAR por categoria (modo geral)
export async function buscarPorCategoria(categoria) {
  try {
    const docRef = doc(db, "videos", "libra");
    const docSnap = await getDocs(docRef);

    if (docSnap.exists()) {
      const dados = docSnap.data();
      const categoriaFormatada = categoria.toLowerCase();

      const resultados = Object.entries(dados)
        .filter(([titulo]) => titulo.includes(categoriaFormatada))
        .map(([titulo, arrayVideos]) => ({
          titulo,
          total: Array.isArray(arrayVideos) ? arrayVideos.length : 0
        }));

      return resultados;
    } else {
      return [];
    }
  } catch (erro) {
    console.error("Erro ao buscar por categoria:", erro);
    return [];
  }
}


// 👉 SALVAR vídeo (com nome e url)
export const salvarVideoNoFirestore = async (categoria, url, titulo) => {
  await addDoc(collection(db, "videos"), {
    titulo: titulo.toLowerCase(), // para buscas funcionarem melhor
    categoria: categoria.toLowerCase(),
    url,
  });
};