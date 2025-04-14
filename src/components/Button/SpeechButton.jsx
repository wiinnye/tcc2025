// SpeechButton.js
import React, { useState, useRef } from "react";
import { Button, Box, Stack, Flex, Textarea } from "@chakra-ui/react";

export function SpeechButton({
  text,
  setText,
  mostraValor,
  setMostraValor,
  setValor,
  handleButtonClick,
}) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

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

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Resultado:", transcript);
      setText(transcript);
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

  // const handleStop = () => {
  //   if (recognitionRef.current) {
  //     recognitionRef.current.stop();
  //     setListening(false);
  //   }
  // };

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
      </Flex>
    </Box>
  );
}
