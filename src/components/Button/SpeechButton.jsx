// SpeechButton.js
import React, { useState, useRef } from "react";
import { Button, Box, Stack, Flex, Textarea } from "@chakra-ui/react";
// import { traduzirParaLibras } from "../../utils/traduzirParaLibras";
import { librasMock } from "../../utils/librasMock";

export function SpeechButton({
  text,
  setText,
  mostraValor,
  setMostraValor,
  setValor,
  handleButtonClick,
}) {
  const [listening, setListening] = useState(false);
  const [descricao, setDescricao] = useState("");
  const recognitionRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const initializeRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      console.log("Reconhecimento de voz iniciado...");
    };

    // recognition.onresult = (event) => {
    //   const transcript = event.results[0][0].transcript;
    //   console.log("Texto reconhecido:", transcript);

    //   setText(transcript);
    //   const traducao = traduzirParaLibras(transcript);
    //   setMostraValor(traducao);

    //     // Busca no JSON
    //     const chave = transcript.toLowerCase().trim();
    //     const video = librasMock[chave]?.video || null;
    //     setVideoUrl(video);
    // };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const chave = transcript.toLowerCase().trim();

      setText(transcript);

      // Se existir no JSON
      if (librasMock[chave]) {
        setMostraValor(librasMock[chave].fraseLibras);
        setDescricao(librasMock[chave].descricao);
        setVideoUrl(librasMock[chave].video);
      } else {
        setMostraValor("Sinal não encontrado.");
        setDescricao("");
        setVideoUrl(null);
      }
    };

    recognition.onend = () => {
      setListening(false);
      console.log("Reconhecimento de voz finalizado.");
    };

    recognition.onerror = (event) => {
      console.error("Erro:", event.error);
      setListening(false);
    };

    return recognition;
  };

  const handleStart = () => {
    setValor("");
    setMostraValor("");
    setText("");

    if (!listening) {
      const recognition = initializeRecognition();
      if (recognition) {
        recognition.start();
        recognitionRef.current = recognition;
      }
    }
  };

  return (
    <Box w="100%" textAlign="center" mt={8}>
      <Stack direction="row" spacing={4} justify="center">
        <Button
          w={{ base: "120px", s: "200px", md: "200px", lg: "200px" }}
          bg="#6ab04c"
          onClick={handleButtonClick}
        >
          Traduzir Texto
        </Button>
        <Button
          w={{ base: "120px", s: "200px", md: "200px", lg: "200px" }}
          bg={listening ? "red.400" : "#6ab04c"}
          color="white"
          onClick={handleStart}
          isDisabled={listening}
        >
          {listening ? "Ouvindo..." : "Falar"}
        </Button>
      </Stack>

      <Flex w="100%" direction="column" align="center">
        <Textarea
          w={{ base: "300px", s: "450px", md: "450px", lg: "450px" }}
          h="200px"
          bg="#fff"
          mt="3rem"
          p=".7rem"
          value={mostraValor || text}
          readOnly
          aria-label="libras-texto"
        />

        {descricao && (
          <Box mt={4} color="gray.700">
            <strong>Descrição:</strong> {descricao}
          </Box>
        )}

        {videoUrl && (
          <video
            width="320"
            height="240"
            controls
            autoPlay
            style={{ marginTop: "1rem" }}
          >
            <source src={videoUrl} type="video/mp4" />
            Seu navegador não suporta vídeo.
          </video>
        )}
      </Flex>
    </Box>
  );
}
