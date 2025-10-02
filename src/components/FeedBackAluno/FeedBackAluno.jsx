import { useState } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Box,
  Textarea,
  Button,
  VStack,
  // useToast
} from "@chakra-ui/react";
import { getAuth } from "firebase/auth";

function FeedbackAluno() {
  const [mensagem, setMensagem] = useState("");
  // const toast = useToast();
  const auth = getAuth();
  const user = auth.currentUser;

  const enviarFeedback = async () => {
    if (!mensagem.trim()) {
      // toast({
      //   title: "Mensagem vazia",
      //   description: "Digite algo antes de enviar.",
      //   status: "warning",
      //   duration: 3000,
      //   isClosable: true,
      // });
      console.log("digite algo antes de enviar")
      return;
    }

    try {
      await addDoc(collection(db, "feedbackAlunos"), {
        userId: user.uid,
        nome: user.displayName || "Aluno",
        mensagem,
        criadoEm: serverTimestamp(),
        visto: false,
        respondido: false
      });

      setMensagem("");
      // toast({
      //   title: "Feedback enviado!",
      //   description: "Seu feedback foi enviado para os intérpretes.",
      //   status: "success",
      //   duration: 3000,
      //   isClosable: true,
      // });
      console.log("Seu feedback foi enviado para os intérpretes")
    } catch (err) {
      console.error("Erro ao enviar feedback:", err);
      // toast({
      //   title: "Erro",
      //   description: "Não foi possível enviar seu feedback.",
      //   status: "error",
      //   duration: 3000,
      //   isClosable: true,
      // });
      console.log("Não foi possível enviar seu feedback")
    }
  };

  return (
    <Box p={4} maxW="500px" mx="auto">
      <VStack spacing={4}>
        <Textarea
          placeholder="Escreva seu feedback ou solicitação de sinal"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          size="lg"
        />
        <Button colorScheme="blue" w="full" 
        onClick={enviarFeedback}
        >
          Enviar Feedback
        </Button>
      </VStack>
    </Box>
  );
}

export default FeedbackAluno;
