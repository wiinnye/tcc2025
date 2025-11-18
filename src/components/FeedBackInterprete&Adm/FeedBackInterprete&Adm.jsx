import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Tooltip from "../../components/ToolTip/ToolTip";

export default function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState([]);

  const formatarTimestamp = (timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== "function") {
      return "Data indisponível";
    }

    const dataJs = timestamp.toDate();

    const dataFormatada = dataJs.toLocaleDateString("pt-BR");
    const horaFormatada = dataJs.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return `${dataFormatada} às ${horaFormatada}`;
  };

  useEffect(() => {
    const queryList = query(
      collection(db, "feedbackAlunos"),
      orderBy("criadoEm", "desc")
    );

    const buscarFeedback = onSnapshot(queryList, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedbacks(lista);
    });

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
    <Box p={4} maxW="600px" mx="auto" my="auto">
      <Box maxH="400px" overflowY="auto" pr={2}>
        <VStack spacing={4} align="stretch">
          {feedbacks.map((fb) => (
            <Box key={fb.id} p={4} shadow="md" borderWidth="1px" rounded="md">
              <Flex w="100%" justify="space-between">
                <Text mt={2} fontSize="sm" color="gray.500">
                  Enviado em:
                  <Text as="span" fontWeight="semibold" ml={1}>
                    {formatarTimestamp(fb.criadoEm)}
                  </Text>
                </Text>
                <Badge p=".3rem" bg={fb.visto ? "#4cb04c" : "yellow"}>
                  {fb.visto ? "Visto" : "Não visto"}
                </Badge>
              </Flex>
              <HStack justify="space-between" mt="1rem">
                <Text fontSize="20px" fontWeight="bold">
                  {fb.nome}
                </Text>
              </HStack>
              <Flex w="100%" h='auto'>
                <Text mt={2}>{fb.mensagem}</Text>
              </Flex>

              <Flex flexDirection="column" mt="1rem">
                <HStack mt={3} spacing={2}>
                  {!fb.visto && (
                  <Tooltip descricao={"Confirmação de Lido"}>
                    <Button
                      size="lg"
                      p=".5rem"
                      bg="#4cb04c"
                      color="#fff"
                      onClick={() => marcarVisto(fb.id)}
                    >
                      Marcar como Visto
                    </Button>
                  </Tooltip>
                  )}

                  <Flex w="100%" justify="flex-end">
                    <Tooltip descricao={"deletar Feedback"}>
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
                    </Tooltip>
                  </Flex>
                </HStack>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
