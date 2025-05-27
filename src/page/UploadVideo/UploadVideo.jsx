import { useState } from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { uploadVideoToCloudinary } from "../../services/cloudinaryService";
import { salvarVideoNoFirestore } from "../../services/api";

export function UploadVideo() {
  const [titulo, setTitulo] = useState("");
  const [file, setFile] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const handleUpload = async () => {
    if (!titulo || !file) {
      setMensagem("⚠️ Preencha o título e selecione um vídeo.");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      // 1. Upload para o Cloudinary
      const url = await uploadVideoToCloudinary(file);

      // 2. Salvar no Firestore na coleção 'videos', documento 'libra'
      await salvarVideoNoFirestore(titulo, url);

      setMensagem("✅ Vídeo enviado com sucesso!");
      setTitulo("");
      setFile(null);
    } catch (error) {
      console.error("Erro no upload:", error);
      setMensagem("❌ Erro ao enviar o vídeo.");
    }

    setCarregando(false);
  };

  return (
    <Flex direction="column" p={6} bg="gray.50" borderRadius="md" shadow="md" maxW="400px" mx="auto">
      <Text fontSize="xl" mb={4} fontWeight="bold">
        Cadastro de Vídeo - Intérprete Libras
      </Text>

      <Input
        placeholder="Título do vídeo (ex.: html)"
        mb={3}
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <Input
        type="file"
        accept="video/*"
        mb={3}
        onChange={(e) => setFile(e.target.files[0])}
      />

      <Button
        colorScheme="blue"
        onClick={handleUpload}
        isLoading={carregando}
        loadingText="Enviando..."
        mb={3}
      >
        Enviar vídeo
      </Button>

      {mensagem && (
        <Box
          bg={mensagem.includes("❌") ? "red.100" : "green.100"}
          color={mensagem.includes("❌") ? "red.600" : "green.600"}
          p={2}
          borderRadius="md"
          textAlign="center"
        >
          {mensagem}
        </Box>
      )}
    </Flex>
  );
}
