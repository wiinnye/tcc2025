import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { GridItem, Text, Grid } from "@chakra-ui/react";

export function NotificacaoFeedBackAluno({ user, onClose }) {
  const [notificacao, setNotificacao] = useState("");
  const [feedbackIdParaAtualizar, setFeedbackIdParaAtualizar] = useState(null);

  useEffect(() => {

    const q = query(
      collection(db, "feedbackAlunos"),
      where("userId", "==", user.uid),
      where("visto", "==", true),
      where("notificacaoVistaPeloAluno", "==", false)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docNotificavel = snapshot.docs[0];
        setFeedbackIdParaAtualizar(docNotificavel.id); 
        
        setNotificacao("Seu feedback foi recebido e lido!");
      }
    });

    return () => unsub();
  }, [user]);

 useEffect(() => {
    if (notificacao && feedbackIdParaAtualizar) {
    
      const timer = setTimeout(() => {
        setNotificacao("");
        if (onClose) onClose();

        const ref = doc(db, "feedbackAlunos", feedbackIdParaAtualizar);
        updateDoc(ref, { notificacaoVistaPeloAluno: true })
          .then(() => {
            console.log(`Notificação marcada como vista para o ID: ${feedbackIdParaAtualizar}`);
          })
          .catch((error) => {
            console.error("Erro ao atualizar status de notificação:", error);
          });
          
        setFeedbackIdParaAtualizar(null); 
        
      }, 4000); 

      return () => clearTimeout(timer);
    }
  }, [notificacao, feedbackIdParaAtualizar, onClose]);

  if (!notificacao) {
    return null;
  }

  return (
    <Grid
      h="10%"
      position="fixed"
      bottom="150px"
      right="30px"
      bg="green.500"
      color="white"
      px={4}
      py={2}
      borderRadius="md"
      boxShadow="md"
      zIndex={9999}
      justifyItems="center"
      alignItems="center"
    >
      <GridItem>
        <Text fontSize="20px">{notificacao}</Text>
      </GridItem>
    </Grid>
  );
}



