import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Spinner,
  Image,
  Button,
} from "@chakra-ui/react";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { MenuUsuario } from "../../components/Menu/menu";

export function VideoMostrar() {
  const { categoria } = useParams();
  const [videos, setVideos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [videoSelecionado, setVideoSelecionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarVideos = async () => {
      setCarregando(true);
      try {
        const docRef = doc(db, "videos", "libra");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const todosVideos = Object.values(data);

          const filtrados = todosVideos.filter(
            (video) =>
              video.categoria &&
              video.categoria.toLowerCase() === categoria.toLowerCase()
          );

          setVideos(filtrados);
        }
      } catch (erro) {
        console.error("Erro ao buscar vídeos:", erro);
      }
      setCarregando(false);
    };

    buscarVideos();
  }, [categoria]);

  const voltar = () =>{
    navigate(-1);
  }
  return (
    <>
      <MenuUsuario />
      <Flex
        minH="100vh"
        w="100%"
        direction="column"
        align="center"
        justify="center"
        p={6}
        bg="#F3F5FC"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Vídeos da categoria: {categoria.toUpperCase()}
        </Text>

        {carregando ? (
          <Spinner size="lg" color="#6AB04C" />
        ) : videos.length === 0 ? (
          <Text>Nenhum vídeo encontrado.</Text>
        ) : (
          <Flex wrap="wrap" justify="center" gap={6}>
            {videos.map((video, index) => (
              <Flex
                key={index}
                direction="column"
                bg="#fff"
                border="1px solid #e2e8f0"
                borderRadius="md"
                boxShadow="md"
                overflow="hidden"
                maxW="250px"
              >
                <Image
                  src="https://via.placeholder.com/400x200.png?text=Prévia+do+Vídeo"
                  alt="Thumb do vídeo"
                  objectFit="cover"
                  w="100%"
                  h="150px"
                />
                <Flex direction="column" p={4}>
                  <Text fontWeight="bold" fontSize="lg" mb={2}>
                    {video.titulo}
                  </Text>
                  <Button
                    colorScheme="green"
                    size="sm"
                    onClick={() => setVideoSelecionado(video)}
                  >
                    Assistir vídeo
                  </Button>
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}

        {/* POPUP usando Flex */}
        {videoSelecionado && (
          <Flex
            position="fixed"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bg="rgba(0,0,0,0.8)"
            align="center"
            justify="center"
            zIndex="9999"
          >
            <Button onclick={voltar}>Voltar</Button>
            <Flex
              direction="column"
              bg="#fff"
              borderRadius="md"
              p={4}
              maxW="90%"
              maxH="90%"
              overflow="hidden"
            >
              <Text fontWeight="bold" mb={4} fontSize="xl">
                {videoSelecionado.titulo}
              </Text>
              <video width="100%" h='500px' controls>
                <source src={videoSelecionado.url} type="video/mp4" />
                Seu navegador não suporta vídeo.
              </video>
              <Button
                mt={4}
                colorScheme="red"
                onClick={() => setVideoSelecionado(null)}
              >
                Fechar
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>
    </>
  );
}
