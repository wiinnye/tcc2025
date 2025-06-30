import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { uploadVideoToCloudinary } from "../../services/cloudinaryService";
import { salvarVideoNoFirestore } from "../../services/api";

export function UploadVideo() {
  const [titulo, setTitulo] = useState("");       // Categoria (ex: html)
  const [nomeVideo, setNomeVideo] = useState(""); // Nome do vídeo
  const [file, setFile] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleUpload = async () => {
    if (!titulo.trim() || !nomeVideo.trim() || !file) {
      setMensagem("⚠️ Preencha todos os campos e selecione um vídeo.");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      const url = await uploadVideoToCloudinary(file);
      await salvarVideoNoFirestore(titulo, url, nomeVideo);

      setMensagem("✅ Vídeo enviado com sucesso!");
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
    <Flex
      direction="column"
      p={6}
      bg="gray.50"
      borderRadius="md"
      shadow="md"
      w="100%"
      maxW={{ base: "100%", md: "480px" }}
      mx="auto"
      mt={8}
    >
      <Text
        fontSize={{ base: "lg", md: "xl" }}
        mb={4}
        fontWeight="bold"
        color="blue.700"
        textAlign="center"
      >
        Cadastro de Vídeo - Intérprete Libras
      </Text>

      <Input
        placeholder="Categoria (ex.: html)"
        mb={3}
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        size={isMobile ? "md" : "lg"}
      />

      <Input
        placeholder="Nome descritivo do vídeo"
        mb={3}
        value={nomeVideo}
        onChange={(e) => setNomeVideo(e.target.value)}
        size={isMobile ? "md" : "lg"}
      />

      <Input
        type="file"
        accept="video/*"
        mb={3}
        onChange={(e) => setFile(e.target.files[0])}
        size={isMobile ? "md" : "lg"}
      />

      <Button
        colorScheme="blue"
        onClick={handleUpload}
        isLoading={carregando}
        loadingText="Enviando..."
        mb={3}
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
  );
}
