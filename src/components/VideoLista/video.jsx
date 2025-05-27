import { useEffect, useState } from "react";
import { db } from "../../services/api";
import { collection, query, where, getDocs } from "../../services/firebase";
import { Box, Text } from "@chakra-ui/react";

export function VideoList({ busca }) {
  const [videos, setVideos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  useEffect(() => {
    const buscarVideo = async () => {
      if (!busca || busca.trim() === "") {
        setVideos([]);
        setNaoEncontrado(false);
        return;
      }

      setCarregando(true);
      setNaoEncontrado(false);
      try {
        const q = query(collection(db, "videos"), where("libra", "==", busca.toLowerCase()));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setNaoEncontrado(true);
          setVideos([]);
        } else {
          const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setVideos(lista);
        }
      } catch (erro) {
        console.error("Erro ao buscar vídeo:", erro);
        setNaoEncontrado(true);
      }
      setCarregando(false);
    };

    buscarVideo();
  }, [busca]);

  return (
    <Box mt={8} w="100%" display="flex" flexDirection="column" alignItems="center">
      {carregando && <Text>Buscando vídeo...</Text>}
      {naoEncontrado && <Text>Nenhum vídeo encontrado com esse título.</Text>}

      {videos.map(video => (
        <Box key={video.id} mb={6}>
          <Text fontWeight="bold" mb={2}>{video.titulo}</Text>
          <video width="320" height="240" controls>
            <source src={video.url} type="video/mp4" />
            Seu navegador não suporta vídeo.
          </video>
        </Box>
      ))}
    </Box>
  );
}
