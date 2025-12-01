import { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Spinner,
  Image,
  Button,
  GridItem,
  Grid,
  Badge,
  Textarea,
} from "@chakra-ui/react";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import bgCategoria from "../../image/bgCategoria.png";
import MenuUsuario from "../../components/Menu/Menu";
import { Notificacao } from "../../components/Notificacao/Notificacao";
import ToolTipContainer from "../../components/ToolTip/ToolTip";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiCloseFill, RiArrowLeftLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

export function Administrador() {
  const [pendentes, setPendentes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [notificacao, setNotificacao] = useState(null);
  const [videoAberto, setVideoAberto] = useState(null);
  const [motivoRecusa, setMotivoRecusa] = useState("");
  const [videoParaRecusar, setVideoParaRecusar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarPendentes = async () => {
      const snapshot = await getDocs(collection(db, "videos_pendentes"));
      const pendentesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPendentes(pendentesArray);

      const grupos = {};
      pendentesArray.forEach((video) => {
        const cat = video.categoria || "Sem Categoria";
        grupos[cat] = grupos[cat] ? grupos[cat] + 1 : 1;
      });

      const listaCategorias = Object.keys(grupos).map((cat) => ({
        nome: cat,
        quantidade: grupos[cat],
      }));

      setCategorias(listaCategorias);
      setCarregando(false);
    };

    buscarPendentes();
  }, []);

  const iniciarRecusa = (video) => {
    setVideoAberto(null);
    setVideoParaRecusar(video);
  };

  const confirmarRecusa = async () => {
    const video = videoParaRecusar;

    const interpreteEmail = video?.interpreteEmail || "email_ausente";
    const interpreteTipo = video?.tipo || "tipo_desconhecido";

    if (!motivoRecusa.trim()) {
      setNotificacao({
        msg: "O motivo da recusa é obrigatório.",
        tipo: "aviso",
      });
      return;
    }

    try {
      await setDoc(doc(db, "notificacoes_recusa", video.id), {
        userId: video.interpreteId,
        motivo: motivoRecusa,
        videoTitulo: video.titulo,
        dataRecusa: serverTimestamp(),
        status: "recusado",
        notificacaoLida: false,
        interpreteEmail: interpreteEmail,
        interpreteTipo: interpreteTipo,
      });

      await deleteDoc(doc(db, "videos_pendentes", video.id));

      const novaLista = pendentes.filter((v) => v.id !== video.id);
      setPendentes(novaLista);

      const grupos = {};
      novaLista.forEach((v) => {
        const cat = v.categoria || "Sem Categoria";
        grupos[cat] = grupos[cat] ? grupos[cat] + 1 : 1;
      });
      setCategorias(
        Object.keys(grupos).map((cat) => ({
          nome: cat,
          quantidade: grupos[cat],
        }))
      );

      // Feedback para o administrador
      setNotificacao({
        msg: "Vídeo recusado",
        descricao: "Notificação enviada para o usuário!",
        tipo: "sucesso",
      });

      // Limpar estados e fechar o modal
      setVideoParaRecusar(null);
      setMotivoRecusa("");
    } catch (error) {
      setNotificacao({ msg: "Erro ao recusar vídeo:", error, tipo: "erro" });
      setTimeout(() => setNotificacao(""), 5000);
    }
  };

  const aprovar = async (video) => {
    try {
      const ref = doc(db, "videos", "libra");
      await updateDoc(ref, {
        lista: arrayUnion({
          titulo: video.titulo,
          url: video.url,
          categoria: video.categoria,
          thumbnail: video.thumbnail || "",
        }),
      });

      await deleteDoc(doc(db, "videos_pendentes", video.id));
      const novaLista = pendentes.filter((v) => v.id !== video.id);
      setPendentes(novaLista);

      const grupos = {};
      novaLista.forEach((v) => {
        const cat = v.categoria || "Sem Categoria";
        grupos[cat] = grupos[cat] ? grupos[cat] + 1 : 1;
      });

      setCategorias(
        Object.keys(grupos).map((cat) => ({
          nome: cat,
          quantidade: grupos[cat],
        }))
      );

      setNotificacao({ msg: "Vídeo aceito!", tipo: "sucesso" });
      setVideoAberto(null);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  // const recusar = async (video) => {
  //   try {
  //     await deleteDoc(doc(db, "videos_pendentes", video.id));
  //     const novaLista = pendentes.filter((v) => v.id !== video.id);
  //     setPendentes(novaLista);

  //     const grupos = {};
  //     novaLista.forEach((v) => {
  //       const cat = v.categoria || "Sem Categoria";
  //       grupos[cat] = grupos[cat] ? grupos[cat] + 1 : 1;
  //     });

  //     setCategorias(
  //       Object.keys(grupos).map((cat) => ({
  //         nome: cat,
  //         quantidade: grupos[cat],
  //       }))
  //     );

  //     setMensagem(" Vídeo recusado!");
  //     setTimeout(() => setMensagem(""), 5000);
  //     setVideoAberto(null);
  //   } catch (error) {
  //     console.error("Erro:", error);
  //   }
  // };
  const videoSelecionado = pendentes.find((vid) => vid.id === videoAberto);

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

  const capitalizeName = (name) => {
    if (!name) return "";

    const lowerName = name.toLowerCase();
    const capitalizedWords = lowerName.split(" ").map((word) => {
      if (word.length === 0) return "";
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalizedWords.join(" ");
  };
  return (
    <Grid
      w="100%"
      minH="100vh"
      templateColumns="1fr"
      templateRows="auto auto 1fr auto"
      gap={3}
    >
      <GridItem w="100%" h={{ lg: "50%" }}>
        <MenuUsuario />
      </GridItem>

      {!categoriaSelecionada ? (
        <GridItem
          w="100%"
          h="100%"
          p={{ base: ".6rem", md: "1rem" }}
          mt={{ base: "3rem", md: "2rem" }}
          gridRow="2"
        >
          <ToolTipContainer descricao="voltar pagina">
            <Button
              w={{ base: "20%", md: "10%" }}
              bg="#4cb04c"
              mb={4}
              onClick={() => {
                navigate("/tradutor");
              }}
            >
              <RiArrowLeftLine />
            </Button>
          </ToolTipContainer>
        </GridItem>
      ) : (
        <GridItem
          w="100%"
          h="100"
          p={{ base: ".6rem", md: "1rem" }}
          mt={{ base: "3rem", md: "2rem" }}
        >
          <Button
            w={{ base: "20%", md: "10%" }}
            bg="#4cb04c"
            mb={4}
            onClick={() => {
              setCategoriaSelecionada(null);
              setVideoAberto(null);
            }}
          >
            <RiArrowLeftLine />
          </Button>
        </GridItem>
      )}

      <GridItem w="100%" p="1rem" gridRow="3 / 4">
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          mb={6}
          textAlign="center"
        >
          Revisão de Vídeos
        </Text>
        {!categoriaSelecionada ? (
          <Text fontSize={{ base: "xl", md: "2xl" }} ml="3rem">
            Verifique as categorias abaixo:
          </Text>
        ) : (
          <Text fontSize={{ base: "xl", md: "2xl" }} ml="3rem">
            Videos para revisão da categoria:{" "}
            {capitalizeName(categoriaSelecionada)}
          </Text>
        )}

        {carregando ? (
          <Spinner size="lg" color="#6AB04C" />
        ) : (
          <>
            {!categoriaSelecionada ? (
              <Flex
                wrap="wrap"
                justify="center"
                align="flex-start"
                gap={3}
                w="100%"
                h="auto"
                overflowY="auto"
              >
                {categorias.map((categ) => (
                  <Flex
                    key={categ.nome}
                    cursor="pointer"
                    w={{ base: "230px", md: "200px", lg: "300px" }}
                    h={{ base: "250px", md: "200px", lg: "350px" }}
                    direction="column"
                    align="center"
                    justify="center"
                    p="3rem"
                    _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
                    backgroundImage={`url(${bgCategoria})`}
                    backgroundSize="contain"
                    backgroundRepeat="no-repeat"
                    backgroundPosition="center"
                    onClick={() => setCategoriaSelecionada(categ.nome)}
                    position="relative"
                  >
                    {categ.quantidade > 0 && (
                      <ToolTipContainer descricao="quantidade video pendente">
                        <Badge
                          bg="#ae1212ff"
                          color="#fff"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="lg"
                          position="absolute"
                          top={{ base: 2, md: 4 }}
                          right={{ base: 2, md: 4 }}
                          zIndex={10}
                        >
                          {categ.quantidade}
                        </Badge>
                      </ToolTipContainer>
                    )}

                    <Text
                      mb={{ base: "5rem", md: "124px", lg: "110px" }}
                      fontWeight="bold"
                      color="#fff"
                      fontSize={{ base: "md", md: "24px", lg: "26px" }}
                      textAlign="center"
                      className="notranslate"
                      w="100%"
                      whiteSpace="normal"
                      wordBreak="break-word"
                    >
                      {categ.nome.toUpperCase()}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            ) : (
              <>
                <Flex wrap="wrap" justify="center" gap={6} mt={8}>
                  {pendentes
                    .filter((v) => v.categoria === categoriaSelecionada)
                    .map((v) => (
                      <Flex
                        key={v.id}
                        direction="column"
                        bg="#fff"
                        border="1px solid #e2e8f0"
                        borderRadius="md"
                        boxShadow="md"
                        overflow="hidden"
                        minW="20%"
                        p={4}
                      >
                        <Image
                          src={v.thumbnail}
                          alt="Thumb do vídeo"
                          objectFit="cover"
                          w="100%"
                          h="180px"
                        />

                        <Flex minW="50%" mt="1rem" p=".4rem" direction="column">
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            className="notranslate"
                          >
                            {v.titulo.toUpperCase()}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Enviado em:: {formatarTimestamp(v.createdAt)}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Enviado por: {v.interpreteEmail || "Não informado"}
                          </Text>
                          <Button
                            mt={2}
                            size="sm"
                            bg="#6AB04C"
                            color="white"
                            onClick={() => setVideoAberto(v.id)}
                          >
                            Abrir Vídeo
                          </Button>
                          {videoSelecionado && (
                            <Flex
                              position="fixed"
                              top="0"
                              left="0"
                              w="100%"
                              h="100%"
                              bg="rgba(0,0,0,0.8)"
                              align="center"
                              justify="center"
                              p={4}
                              zIndex="999"
                            >
                              <Flex
                                direction="column"
                                bg="#fff"
                                borderRadius="md"
                                p={4}
                                w="100%"
                                maxW="600px"
                                maxH="90vh"
                                overflowY="auto"
                                align="center"
                              >
                                <Flex
                                  w="100%"
                                  justify="space-between"
                                  mb={4}
                                  flexDirection="column"
                                  align="end"
                                >
                                  <RiCloseFill
                                    color="#6AB04C"
                                    cursor="pointer"
                                    size="30px"
                                    mb="1rem"
                                    onClick={() => setVideoAberto(null)}
                                  />
                                  <video
                                    style={{
                                      width: "100%",
                                      height: "auto",
                                      maxHeight: "100vh",
                                      borderRadius: "8px",
                                      marginTop: "1rem",
                                    }}
                                    controls
                                  >
                                    <source
                                      src={videoSelecionado.url}
                                      type="video/mp4"
                                    />
                                    Seu navegador não suporta vídeo.
                                  </video>
                                </Flex>
                                <Flex
                                  w="100%"
                                  align="center"
                                  justify="space-around"
                                  mt={4}
                                >
                                  <Button
                                    w="20%"
                                    bg="green"
                                    color="#fff"
                                    onClick={() => aprovar(v)}
                                  >
                                    Aprovar
                                  </Button>

                                  <Button
                                    w="20%"
                                    bg="red"
                                    color="#fff"
                                    onClick={() =>
                                      iniciarRecusa(videoSelecionado)
                                    }
                                  >
                                    <FaRegTrashAlt />
                                  </Button>
                                </Flex>
                              </Flex>
                            </Flex>
                          )}
                        </Flex>
                      </Flex>
                    ))}
                </Flex>
              </>
            )}
          </>
        )}
      </GridItem>

      {videoParaRecusar && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          w="100%"
          h="100%"
          bg="rgba(0,0,0,2)"
          align="center"
          justify="center"
          p={4}
          zIndex="1000"
        >
          <Flex
            direction="column"
            bg="#fff"
            borderRadius="lg"
            p={6}
            w="90%"
            maxW="450px"
            boxShadow="2xl"
          >
            <Text fontSize="xl" fontWeight="bold" mb={4} color="red.600">
              Recusar Vídeo?
            </Text>
            <Text mb={3}>
              Por favor, digite o motivo da recusa. Este motivo será enviado
              para o usuário.
            </Text>
            <Textarea
              placeholder="Ex: O vídeo não está com a iluminação adequada ou a tradução está incorreta."
              value={motivoRecusa}
              onChange={(e) => setMotivoRecusa(e.target.value)}
              mb={6}
              minH="120px"
              resize="none"
            />
            <Flex justify="space-between" w="100%">
              <Button
                bg="red.500"
                p="1rem"
                onClick={() => {
                  setVideoParaRecusar(null);
                  setMotivoRecusa("");
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarRecusa}
                isDisabled={!motivoRecusa.trim()}
                p="1rem"
                bg="green"
                color="#fff"
              >
                Confirmar Recusa
              </Button>
            </Flex>
          </Flex>
        </Flex>
      )}

      <GridItem gridRow="4 / 5">
        <Footer />
      </GridItem>

      {notificacao && (
        <Notificacao
          msg={notificacao?.msg}
          tipo={notificacao?.tipo}
          descricao={notificacao?.descricao}
          onClose={() => setNotificacao(null)}
        />
      )}
    </Grid>
  );
}
