import { useState } from "react";
import { db } from "../../services/firebase";
 import { doc, getDoc } from "firebase/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Box, Textarea, Button, VStack } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import { Notificacao } from "../Notificacao/Notificacao";

export default function FeedbackAluno() {
  const [mensagem, setMensagem] = useState("");
  const [notificacao, setNotificacao] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const resize = "none";

const enviarFeedback = async () => {
  if (!mensagem.trim()) {
    setNotificacao({
      msg: "Digite seu Feedback antes de enviar",
      tipo: "aviso",
    });
    return;
  }

  try {
    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);
    const nomeUsuario = userSnap.exists() ? userSnap.data().nome : "Aluno";


    await addDoc(collection(db, "feedbackAlunos"), {
        userId: user.uid,
        nome: nomeUsuario || "Aluno",
        email: user.email,
        mensagem,
        criadoEm: serverTimestamp(),
        visto: false,
        respondido: false,
        notificacaoVistaPeloAluno: false
    });

    setMensagem("");
    setNotificacao({
      msg: "Seu feedback foi enviado! Obrigado",
      tipo: "sucesso",
    });
  } catch (err) {
    setNotificacao({
      msg: "Não foi possível enviar seu feedback",
      tipo: "erro",
    });
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
          h="100px"
          resize={resize}
        />
        <Button bg="#4cb04c" w="150px" onClick={enviarFeedback}>
          Enviar Feedback
        </Button>
      </VStack>
      {notificacao && (
        <Notificacao
          msg={notificacao?.msg}
          tipo={notificacao?.tipo}
          onClose={() => setNotificacao(null)}
        />
      )}

    
    </Box>
  );
}
