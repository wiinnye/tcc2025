import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
} from "@chakra-ui/react";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const buscarFeedback = onSnapshot(
      collection(db, "feedbackAlunos"),
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeedbacks(lista);
      }
    );

    return () => buscarFeedback();
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
      <Box maxH="400px" overflowY="auto" pr={2}>
        <VStack spacing={4} align="stretch">
          {feedbacks.map((fb) => (
            <Box key={fb.id} p={4} shadow="md" borderWidth="1px" rounded="md">
              <HStack justify="space-between">
                <Text fontSize='20px' fontWeight="bold">{fb.nome}</Text>
                <Badge p='.3rem' bg={fb.visto ? "#4cb04c" : "yellow"}>
                  {fb.visto ? "Visto" : "Não visto"}
                </Badge>
              </HStack>
              <Text mt={2}>{fb.mensagem}</Text>
              <HStack mt={3} spacing={2}>
                {!fb.visto && (
                  <Button
                    size="lg"
                    p=".5rem"
                    bg="#4cb04c"
                    onClick={() => marcarVisto(fb.id)}
                  >
                    Marcar como Visto
                  </Button>
                )}
                <Button
                  size="lg"
                  p=".5rem"
                  bg="#fff"
                  onClick={() => apagarFeedback(fb.id)}
                >
                  <Box>
                    <RiDeleteBin6Line
                      size={24}
                      color="#ff0000"
                      style={{ cursor: "pointer" }}
                    />
                  </Box>
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
