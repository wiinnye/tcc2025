import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { GridItem, Text, Grid } from "@chakra-ui/react";

export function NotificacaoFeedBackAluno({ user, onClose }) {
  const [notificacao, setNotificacao] = useState("");

  useEffect(() => {

    const q = query(
      collection(db, "feedbackAlunos"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.visto) {
          setNotificacao("Seu feedback foi recebido e lido!");
        }
      });
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (notificacao) {
      const timer = setTimeout(() => {
        setNotificacao("");
        if (onClose) onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notificacao, onClose]);

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
        <Text>Obrigado pelo feedback!</Text>
      </GridItem>
    </Grid>
  );
}



