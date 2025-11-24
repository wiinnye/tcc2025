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

export function NotificacaoVideo() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  const [authInicializado, setAuthInicializado] = useState(false);

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
    // Listener para saber quando o Auth está pronto
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthInicializado(true);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const buscarNotificacoes = async () => {
      //Se o Auth não está inicializado ou o usuário não está logado/sem email, interrompe.
      if (!authInicializado || !user || !user.email) {
        setCarregando(false);
        return;
      }

      try {
        const q = query(
          collection(db, "notificacoes_recusa"),
          //Filtra todas as notificações pelo email do usuário logado.
          where("interpreteEmail", "==", user.email)
        );

        const snapshot = await getDocs(q);
        const listaNotificacoes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Ordena da mais recente para a mais antiga
        listaNotificacoes.sort(
          (a, b) => b.dataRecusa.toDate() - a.dataRecusa.toDate()
        );

        setNotificacoes(listaNotificacoes);

        // Define a notificação mais recente como selecionada por padrão
        if (listaNotificacoes.length > 0) {
          setNotificacaoSelecionada(listaNotificacoes[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      } finally {
        setCarregando(false);
      }
    };

    // Só busca se a autenticação já inicializou
    if (authInicializado) {
      buscarNotificacoes();
    }
  }, [user, authInicializado]);

  const marcarComoLida = async (notificacao) => {
    if (notificacao.notificacaoLida) return;

    try {
      await updateDoc(doc(db, "notificacoes_recusa", notificacao.id), {
        notificacaoLida: true,
      });
      setNotificacoes((prev) =>
        prev.map((n) =>
          n.id === notificacao.id ? { ...n, notificacaoLida: true } : n
        )
      );
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  const handleSelecionarNotificacao = (notificacao) => {
    setNotificacaoSelecionada(notificacao);
    marcarComoLida(notificacao);
  };

  // --- Renderização Principal ---
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
      <GridItem>
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
      </GridItem>

      <GridItem>
        <Flex
          p={6}
          maxW="1200px"
          mx="auto"
          flexDirection="column"
          align="center"
        >
          <Heading as="h1" size="xl" mb={8} color="#000" alignSelf="center">
            Minhas Notificações de Recusa de Vídeo
          </Heading>

          {notificacoes.length === 0 ? (
            <Text status="info" variant="left-accent">
              Você não tem nenhuma notificação de recusa de vídeo.
            </Text>
          ) : (
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={8}
              align="center"
              mt="2rem"
            >
              <Box
                w={{ base: "100%", md: "60%" }}
                maxH="200px"
                overflowY="auto"
                pr={2}
              >
                <Text fontSize="lg" fontWeight="semibold" mb={3}>
                  Histórico de notificações:
                </Text>
                <VStack spacing={3} align="stretch">
                  {notificacoes.map((n) => (
                    <Flex
                      key={n.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      boxShadow={
                        n.id === notificacaoSelecionada?.id ? "dark-lg" : "md"
                      }
                      bg={
                        n.id === notificacaoSelecionada?.id
                          ? "red.100"
                          : n.notificacaoLida
                          ? "gray.50"
                          : "red.50"
                      }
                      borderColor={
                        n.id === notificacaoSelecionada?.id
                          ? "red.400"
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
                          color={n.notificacaoLida ? "gray.700" : "red.700"}
                        >
                          {capitalizeName(n.videoTitulo)}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Enviado em:{" "}
                          {n.dataRecusa?.toDate().toLocaleDateString("pt-BR") ||
                            "Data indisponível"}
                        </Text>
                      </Box>
                      {!n.notificacaoLida && (
                        <Text color="red.500" fontWeight="bold" fontSize="sm">
                          NOVA
                        </Text>
                      )}
                    </Flex>
                  ))}
                </VStack>
              </Box>

              <Box
                w={{ base: "100%", md: "600px" }}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                bg="white"
              >
                <Heading as="h2" size="md" mb={4} color="gray.500">
                  Detalhes e Comentário sobre:
                </Heading>

                {notificacaoSelecionada ? (
                  <Flex w="100%" align="start" spacing={5} direction="column">
                    <Text fontWeight="medium" fontSize="lg">
                      Vídeo:{" "}
                      {capitalizeName(notificacaoSelecionada.videoTitulo)}
                    </Text>

                    <Box
                      p={4}
                      bg="red.50"
                      borderRadius="md"
                      w="100%"
                      border="1px solid"
                      borderColor="red.200"
                      mt=".8rem"
                    >
                      <Text fontWeight="bold" mb={2} color="red.700">
                        Comentário do Administrador:
                      </Text>
                      <Text whiteSpace="pre-wrap" mt=".8rem">
                        {notificacaoSelecionada.motivo}
                      </Text>
                    </Box>

                    <Text fontSize="sm" color="gray.500" mt="1rem">
                      Recusado em:{" "}
                      {notificacaoSelecionada.dataRecusa
                        ?.toDate()
                        .toLocaleString("pt-BR") || "Data indisponível"}
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
