import { db } from "../services/firebase";
import { doc, getDocs, getDoc, addDoc, collection} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase"; // seu firebase.js
import { onAuthStateChanged } from "firebase/auth"

/**
 * Salvar vídeo no documento 'libra' da coleção 'videos'
 * @param {string} titulo - Nome do campo
 * @param {string} url - URL do vídeo
 * @param {string} categoria - URL do vídeo
 *  @param {string} thumbnail - thumbnail do vídeo
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
 try {
    const docRef = doc(db, "videos", "libra");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const todosVideos = docSnap.data().videos || [];
      const filtrados = todosVideos.filter(
        (video) => video.categoria.toLowerCase() === categoria.toLowerCase()
      );
      return filtrados;
    } else {
      console.warn("Documento 'libra' não encontrado.");
      return [];
    }
  } catch (erro) {
    console.error("Erro ao buscar vídeos:", erro);
    return [];
  }
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
export async function salvarVideoNoFirestore(categoria, videoUrl, nomeVideo, thumbnailUrl, interpreteId, interpreteEmail) {
  await addDoc(collection(db, "videos_pendentes"), {
    titulo: nomeVideo,
    url: videoUrl,
    categoria,
    thumbnail: thumbnailUrl || null,
    interpreteId,
    interpreteEmail,
    status: "pendente",
    createdAt: new Date()
  });
}

export async function salvarVideoPendente(titulo, url, categoria, interpreteId, interpreteEmail) {
  await addDoc(collection(db, "videos_pendentes"), {
    titulo,
    url,
    categoria,
    interpreteId,
    interpreteEmail,
    status: "pendente",
    createdAt: new Date()
  });
}

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
      } else {
        setUsuario(null);
      }
      setCarregando(false);
    });

    return () => unsubscribe(); // Limpa o listener quando desmontar
  }, []);

  return { usuario, carregando };
}

