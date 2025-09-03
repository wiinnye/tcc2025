import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { uploadVideoToCloudinary } from "../../services/cloudinaryService";
import { salvarVideoNoFirestore } from "../../services/api";
import { MenuUsuario } from "../../components/Menu/menu";
import { getAuth } from "firebase/auth";
import bgFuntlibra from "../../image/bgFuntlibra.png";

export function UploadVideo() {
  const [titulo, setTitulo] = useState(""); // Categoria (ex: html)
  const [nomeVideo, setNomeVideo] = useState(""); // Nome do vídeo
  const [file, setFile] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const isMobile = useBreakpointValue({ base: true, md: false });

  // const handleUpload = async () => {
  //   if (!titulo.trim() || !nomeVideo.trim() || !file) {
  //     setMensagem("⚠️ Preencha todos os campos e selecione um vídeo.");
  //     return;
  //   }

  //   setCarregando(true);
  //   setMensagem("");

  //   try {
  //      const { videoUrl, thumbnailUrl } = await uploadVideoToCloudinary(file);
  //       await salvarVideoNoFirestore(titulo, videoUrl, nomeVideo, thumbnailUrl);

  //     setMensagem("✅ Vídeo enviado com sucesso!");
  //     setTitulo("");
  //     setNomeVideo("");
  //     setFile(null);
  //   } catch (error) {
  //     console.error("Erro no upload:", error);
  //     setMensagem("❌ Erro ao enviar o vídeo.");
  //   }

  //   setCarregando(false);
  // };
  const handleUpload = async () => {
    if (!titulo.trim() || !nomeVideo.trim() || !file) {
      setMensagem("⚠️ Preencha todos os campos e selecione um vídeo.");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      const { videoUrl, thumbnailUrl } = await uploadVideoToCloudinary(file);

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("Usuário não está logado!");
      }

      await salvarVideoNoFirestore(
        titulo,
        videoUrl,
        nomeVideo,
        thumbnailUrl,
        user.uid,
        user.email // pega o email do interprete logado
      );

      setMensagem("✅ Vídeo enviado para aprovação do administrador!");
      setTitulo("");
      setNomeVideo("");
      setFile(null);
    } catch (error) {
      console.error("Erro no upload:", error);
      setMensagem("❌ Erro ao enviar o vídeo.");
    }

    setCarregando(false);
  };

  return (
    <Flex minH='100vh' direction="column">
      <MenuUsuario />
      <Flex justify='center'> 
      {isMobile && (
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          backgroundImage={`url(${bgFuntlibra})`}
          backgroundSize="cover"
          backgroundPosition="center"
          zIndex={-1}
        />
      )}
      <Flex
        w={{ base: "100%", lg: "50%" }}
        h="100%"
        alignItems="center"
        justify='center'
        flexDirection="column"
        position="relative"
        zIndex={1}
        pt={{ base: "70px", md: "90px", lg: "120px" }}
      >
        <Flex
          w={{ base: "300px", s: "150px", md: "350px", lg: "500px" }}
          h="500px"
          align={"center"}
          alignContent={"center"}
          justify={"center"}
          flexDirection="column"
          bg={"#F3F5FC"}
          borderRadius={"25px"}
          boxShadow="3px 2px 2px 4px #e8eaf3"
        >
          <Flex
            w={{ base: "300px", s: "150px", md: "350px", lg: "500px" }}
            flexDirection="column"
          >
            <Text
              fontSize="21px"
              padding={{ lg: "1rem" }}
              textAlign="center"
              color="#000"
              fontWeight="bold"
            >
              Cadastro de Vídeo
            </Text>
          </Flex>

          <Input
            placeholder="Nome da Linguaguem (ex.: html)"
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb={3}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            size={isMobile ? "md" : "lg"}
          />

          <Input
            placeholder="Nome de termo"
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb={3}
            value={nomeVideo}
            onChange={(e) => setNomeVideo(e.target.value)}
            size={isMobile ? "md" : "lg"}
          />

          <Input
            type="file"
            accept="video/*"
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb={3}
            onChange={(e) => setFile(e.target.files[0])}
            size={isMobile ? "md" : "lg"}
          />

          <Button
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            bg={"#6AB04C"}
            color="#fff"
            onClick={handleUpload}
            isLoading={carregando}
            loadingText="Enviando..."
            size={isMobile ? "md" : "lg"}
          >
            Enviar vídeo
          </Button>

          {mensagem && (
            <Box
              bg={mensagem.includes("❌") ? "red.100" : "green.100"}
              color={mensagem.includes("❌") ? "red.600" : "green.600"}
              p={3}
              borderRadius="md"
              textAlign="center"
              fontSize={{ base: "sm", md: "md" }}
            >
              {mensagem}
            </Box>
          )}
        </Flex>
      </Flex>
      {!isMobile && (
        <Flex w="50%" zIndex={-1}>
          <Image w="1000px" h="100vh" src={bgFuntlibra}></Image>
        </Flex>
      )}
      </Flex>
    </Flex>
  );
}
