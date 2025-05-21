import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { buscarVideo } from "../../services/api";

export function VideoList({ busca }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  useEffect(() => {
    const buscar = async () => {
      if (!busca || busca.trim() === "") {
        setVideoUrl("");
        setNaoEncontrado(false);
        return;
      }

      setCarregando(true);
      setNaoEncontrado(false);

      try {
        const resultado = await buscarVideo(busca);

        if (resultado.encontrado) {
          setVideoUrl(resultado.url);
        } else {
          setNaoEncontrado(true);
          setVideoUrl("");
        }
      } catch {
        setNaoEncontrado(true);
        setVideoUrl("");
      }

      setCarregando(false);
    };

    buscar();
  }, [busca]);

  return (
    <Box mt={8} w="100%" display="flex" flexDirection="column" alignItems="center">
      {carregando && <Text>Buscando vídeo...</Text>}
      {naoEncontrado && <Text>Nenhum vídeo encontrado com esse título.</Text>}

      {videoUrl && (
        <Box mb={6}>
          <Text fontWeight="bold" mb={2}>{busca}</Text>
          <video width="320" height="240" controls>
            <source src={videoUrl} type="video/mp4" />
            Seu navegador não suporta vídeo.
          </video>
        </Box>
      )}
    </Box>
  );
}
