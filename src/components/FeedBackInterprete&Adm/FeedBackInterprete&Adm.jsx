import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Heading,
} from "@chakra-ui/react";

export default function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "feedbackAlunos"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedbacks(lista);
    });

    return () => unsub();
  }, []);

  const marcarVisto = async (id) => {
    const ref = doc(db, "feedbackAlunos", id);
    await updateDoc(ref, { visto: true });
  };

  const apagarFeedback = async (id) => {
    const ref = doc(db, "feedbackAlunos", id);
    await deleteDoc(ref);
  };

  return (
    <Box p={4} maxW="800px" mx="auto">
      <Heading mb={4}>Feedbacks</Heading>
      <VStack spacing={4} align="stretch">
        {feedbacks.map((fb) => (
          <Box key={fb.id} p={4} shadow="md" borderWidth="1px" rounded="md">
            <HStack justify="space-between">
              <Text fontWeight="bold">{fb.nome}</Text>
              <Badge colorScheme={fb.visto ? "green" : "yellow"}>
                {fb.visto ? "Visto" : "Não visto"}
              </Badge>
            </HStack>
            <Text mt={2}>{fb.mensagem}</Text>
            <HStack mt={3} spacing={2}>
              {!fb.visto && (
                <Button size="sm" colorScheme="blue" onClick={() => marcarVisto(fb.id)}>
                  Marcar como Visto
                </Button>
              )}
              <Button size="sm" colorScheme="red" onClick={() => apagarFeedback(fb.id)}>
                Apagar
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
