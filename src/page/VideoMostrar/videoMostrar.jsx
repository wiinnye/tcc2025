import { useEffect, useState } from "react";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { buscarVideo } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

export function VideoMostrar() {
  const navigate = useNavigate();
  const { texto } = useParams(); // pega o texto da URL
  const [videoUrl, setVideoUrl] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  useEffect(() => {
    const buscar = async () => {
      if (!texto || texto.trim() === "") {
        setVideoUrl("");
        setNaoEncontrado(false);
        return;
      }

      setCarregando(true);
      setNaoEncontrado(false);

      try {
        const resultado = await buscarVideo(decodeURIComponent(texto));

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
  }, [texto]);

    const handleProduzirNovamente = () => {
    navigate(`/traducao/${texto}`);
  };

  const handleVoltar = () => {
    navigate("/home");
  };

  return (
     <Flex
      minH="100vh"
      w="100%"
      bg="#F3F5FC"
      justify="center"
      align="center"
      p={4}
      direction='column'
    >
      <VStack
        spacing={6}
        bg="#6AB04C"
        p={6}
        borderRadius="lg"
        boxShadow="lg"
        w={{ base: "100%", md: "600px", lg: "700px" }}
      >
        {carregando && <Text>Buscando vídeo...</Text>}
        {naoEncontrado && <Text>Nenhum vídeo encontrado.</Text>}

        {videoUrl && (
          <Box w="100%">
            <video width="100%" controls>
              <source src={videoUrl} type="video/mp4" />
              Seu navegador não suporta vídeo.
            </video>
          </Box>
        )}

        <Text fontSize="2xl" fontWeight="bold" color="#fff">
          {texto}
        </Text>

        <Text textAlign="center" color="#fff">
          Aqui está a tradução da palavra "<strong>{texto}</strong>" para Libras.
          Se desejar, você pode gerar novamente ou voltar para a tela inicial.
        </Text>
      </VStack>
        <Flex gap={4} wrap="wrap" mt='2rem'>
          <Button
            w='200px'
            bg="#6AB04C"
            color="white"
            borderRadius='15px'
            padding='24px'
            _hover={{ bg: "#579b3e" }}
            onClick={handleProduzirNovamente}
          >
            Produzir Novamente
          </Button>
          <Button
            w='200px'
            variant="outline"
            borderColor="#6AB04C"
            borderRadius='15px'
            padding='24px'
            color="#6AB04C"
            _hover={{ bg: "#e8f5e9" }}
            onClick={handleVoltar}
          >
            Voltar
          </Button>
        </Flex>
    </Flex>
  );
}
