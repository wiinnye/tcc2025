import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  Box,
  Text,
  Flex,
  Spinner,
  VStack,
  Grid,
  GridItem,
  Heading,
  Button,
} from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import MenuUsuario from "../../components/Menu/Menu";
import Footer from "../../components/Footer/Footer";
import ToolTipContainer from "../../components/ToolTip/ToolTip";
import { RiArrowLeftLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export function MinhasNotificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState(null);
  const [authInicializado, setAuthInicializado] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  const capitalizeName = (name) => {
    if (!name) return "";

    const lowerName = name.toLowerCase();
    const capitalizedWords = lowerName.split(" ").map((word) => {
      if (word.length === 0) return "";
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalizedWords.join(" ");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthInicializado(true);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const buscarNotificacoes = async () => {
      if (!authInicializado || !user || !user.email || !user.uid) {
        setCarregando(false);
        return;
      }

      try {
        const qRecusa = query(
          collection(db, "notificacoes_recusa"),
          where("interpreteEmail", "==", user.email)
        );

        const qFeedback = query(
          collection(db, "feedbackAlunos"),
          where("userId", "==", user.uid),
          where("visto", "==", true)
        );

        const [snapshotRecusa, snapshotFeedback] = await Promise.all([
          getDocs(qRecusa),
          getDocs(qFeedback),
        ]);

        const listaRecusas = snapshotRecusa.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            tipo: "recusa",
            tituloExibido: capitalizeName(data.videoTitulo) || "Vídeo Recusado",
            dataExibida: data.dataRecusa?.toDate(),
            isLida: data.notificacaoLida || false,
          };
        });

        const listaFeedbacks = snapshotFeedback.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            tipo: "feedback",
            motivo: "Seu feedback foi recebido e lido pelo administrador.",
            tituloExibido: "Feedback de Aluno Visualizado",
            dataExibida: data.timestamp?.toDate() || new Date(),
            isLida: data.notificacaoVistaPeloAluno || false,
          };
        });

        const listaTotal = [...listaRecusas, ...listaFeedbacks];
        listaTotal.sort(
          (a, b) =>
            (b.dataExibida?.getTime() || 0) - (a.dataExibida?.getTime() || 0)
        );

        setNotificacoes(listaTotal);

        const primeiraNaoLida = listaTotal.find((n) => !n.isLida);
        if (primeiraNaoLida) {
          setNotificacaoSelecionada(primeiraNaoLida);
        } else if (listaTotal.length > 0) {
          setNotificacaoSelecionada(listaTotal[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      } finally {
        setCarregando(false);
      }
    };

    if (authInicializado) {
      buscarNotificacoes();
    }
  }, [user, authInicializado]);

  const marcarComoLida = async (notificacao) => {
    let colecao, campoLida;

    if (notificacao.tipo === "recusa") {
      if (notificacao.notificacaoLida) return;
      colecao = "notificacoes_recusa";
      campoLida = "notificacaoLida";
    } else if (notificacao.tipo === "feedback") {
      if (notificacao.notificacaoVistaPeloAluno) return;
      colecao = "feedbackAlunos";
      campoLida = "notificacaoVistaPeloAluno";
    } else {
      return;
    }

    try {
      await updateDoc(doc(db, colecao, notificacao.id), {
        [campoLida]: true,
      });

      setNotificacoes((prev) =>
        prev.map((n) => {
          if (n.id === notificacao.id && n.tipo === notificacao.tipo) {
            return {
              ...n,
              [campoLida]: true,
              isLida: true,
            };
          }
          return n;
        })
      );
    } catch (error) {
      console.error(`Erro ao marcar ${notificacao.tipo} como lida:`, error);
    }
  };

  const handleSelecionarNotificacao = (notificacao) => {
    setNotificacaoSelecionada(notificacao);
    marcarComoLida(notificacao);
  };

  if (!authInicializado || carregando) {
    return (
      <Flex w="100%" h="100vh" justify="center" align="center">
        <Spinner size="xl" color="#4cb04c" />
      </Flex>
    );
  }

  if (!user || !user.email) {
    return (
      <Text status="error" variant="left-accent">
        Acesso negado: Você precisa estar logado para ver as notificações.
      </Text>
    );
  }

  return (
    <Grid
      w="100%"
      minH="100vh"
      templateColumns="1fr"
      templateRows="auto 1fr auto"
      gap={4}
    >
      <GridItem>
        <MenuUsuario />
      </GridItem>

      <GridItem gridRow="2 / 3">
        <Flex w="100%" direction="column" justify="center" p="2rem">
          <ToolTipContainer descricao="voltar pagina">
            <Button
              w={{ base: "20%", lg: "10%" }}
              bg="#4cb04c"
              mb={4}
              onClick={() => {
                navigate("/traducao");
              }}
            >
              <RiArrowLeftLine />
            </Button>
          </ToolTipContainer>
        </Flex>

        <Flex
          p={6}
          maxW="1200px"
          mx="auto"
          flexDirection="column"
          align="center"
        >
          <Heading as="h1" size="xl" mb={8} color="#000" alignSelf="center">
            Central de Notificações
          </Heading>

          {notificacoes.length === 0 ? (
            <Text>Você não tem nenhuma notificação no momento.</Text>
          ) : (
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={8}
              align="flex-start"
              mt="2rem"
              w="100%"
            >
              <Box
                w={{ base: "100%", md: "40%" }}
                maxH="200px"
                overflowY="auto"
                pr={2}
              >
                <Text fontSize="lg" fontWeight="semibold" mb={3}>
                  Histórico:
                </Text>
                <VStack spacing={3} align="stretch">
                  {notificacoes.map((n) => (
                    <Flex
                      key={`${n.tipo}-${n.id}`}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      boxShadow={
                        n.id === notificacaoSelecionada?.id ? "dark-lg" : "md"
                      }
                      bg={
                        n.id === notificacaoSelecionada?.id
                          ? n.tipo === "recusa"
                            ? "red.100"
                            : "green.100"
                          : n.isLida
                          ? "gray.50"
                          : n.tipo === "recusa"
                          ? "red.50"
                          : "green.50"
                      }
                      borderColor={
                        n.id === notificacaoSelecionada?.id
                          ? n.tipo === "recusa"
                            ? "red.400"
                            : "green.400"
                          : "gray.200"
                      }
                      cursor="pointer"
                      align="center"
                      justify="space-between"
                      onClick={() => handleSelecionarNotificacao(n)}
                      transition="all 0.2s"
                    >
                      <Box>
                        <Text
                          fontWeight="bold"
                          color={
                            n.isLida
                              ? "gray.700"
                              : n.tipo === "recusa"
                              ? "red.700"
                              : "green.700"
                          }
                        >
                          {n.tituloExibido}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {n.tipo === "recusa"
                            ? "Recusado em: "
                            : "Visualizado em: "}
                          {n.dataExibida?.toLocaleDateString("pt-BR") ||
                            "Data indisponível"}
                        </Text>
                      </Box>
                      {!n.isLida && (
                        <Text
                          color={n.tipo === "recusa" ? "red.500" : "green.500"}
                          fontWeight="bold"
                          fontSize="sm"
                        >
                          NOVA
                        </Text>
                      )}
                    </Flex>
                  ))}
                </VStack>
              </Box>

              <Box
                w={{ base: "100%", md: "60%" }}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                bg="white"
                boxShadow="xl"
              >
                <Heading as="h2" size="md" mb={4} color="gray.500">
                  Detalhes da Notificação
                </Heading>

                {notificacaoSelecionada ? (
                  <Flex w="100%" align="start" spacing={5} direction="column">
                    <Text fontWeight="medium" fontSize="lg" mb={3}>
                      {notificacaoSelecionada.tipo === "recusa"
                        ? "Vídeo: "
                        : "Assunto: "}
                      <Text as="span" fontWeight="bold">
                        {notificacaoSelecionada.tituloExibido}
                      </Text>
                    </Text>

                    <Box
                      p={4}
                      bg={
                        notificacaoSelecionada.tipo === "recusa"
                          ? "red.50"
                          : "green.50"
                      }
                      borderRadius="md"
                      w="100%"
                      border="1px solid"
                      borderColor={
                        notificacaoSelecionada.tipo === "recusa"
                          ? "red.200"
                          : "green.200"
                      }
                      mt=".8rem"
                    >
                      <Text
                        fontWeight="bold"
                        mb={2}
                        color={
                          notificacaoSelecionada.tipo === "recusa"
                            ? "red.700"
                            : "green.700"
                        }
                      >
                        {notificacaoSelecionada.tipo === "recusa"
                          ? "Comentário do Administrador (Motivo da Recusa):"
                          : "Status do Feedback:"}
                      </Text>
                      <Text whiteSpace="pre-wrap" mt=".8rem">
                        {notificacaoSelecionada.motivo}
                      </Text>
                    </Box>

                    <Text fontSize="sm" color="gray.500" mt="1rem">
                      {notificacaoSelecionada.tipo === "recusa"
                        ? "Recusado em: "
                        : "Data de Visualização do Admin: "}
                      {notificacaoSelecionada.dataExibida?.toLocaleString(
                        "pt-BR"
                      ) || "Data indisponível"}
                    </Text>
                  </Flex>
                ) : (
                  <Text color="gray.500">
                    Selecione uma notificação na lista para ver os detalhes.
                  </Text>
                )}
              </Box>
            </Flex>
          )}
        </Flex>
      </GridItem>

      <GridItem>
        <Footer />
      </GridItem>
    </Grid>
  );
}
