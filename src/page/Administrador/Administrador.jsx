import { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Spinner,
  Image,
  Button,
  Box,
  GridItem,
  Grid,
} from "@chakra-ui/react";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { MenuUsuario } from "../../components/Menu/menu";
import { Notificacao } from "../../components/Notificacao/Notificacao";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiCloseFill, RiArrowLeftLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export function Administrador() {
  const [pendentes, setPendentes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [videoAberto, setVideoAberto] = useState(null); // Controle de qual vídeo está aberto
  const navigate = useNavigate()

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

      setMensagem("✅ Vídeo aprovado!");
      setTimeout(() => setMensagem(""), 5000);
      setVideoAberto(null);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const recusar = async (video) => {
    try {
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

      setMensagem(" Vídeo recusado!");
      setTimeout(() => setMensagem(""), 5000);
      setVideoAberto(null);
    } catch (error) {
      console.error("Erro:", error);
    }
  };
const videoSelecionado = pendentes.find((vid) => vid.id === videoAberto);
  
return (
    <Grid w="100%" h="100%" templateColumns="repeat(1, 5fr)" gap={3}>
      <GridItem w="100%" h="100">
        <MenuUsuario />
      </GridItem>

      {!categoriaSelecionada ? (<GridItem
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
            navigate("/tradutor")
          }}
        >
          <RiArrowLeftLine />
        </Button>
      </GridItem>):
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
      }

      <GridItem w="100%" h="100" p="1rem">
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          mb={6}
          textAlign="center"
        >
          Moderação de Vídeos Pendentes
        </Text>

        {carregando ? (
          <Spinner size="lg" color="#6AB04C" />
        ) : (
          <>
            {!categoriaSelecionada ? (
              <Flex
                w="100%"
                minH="100%"
                justify="center"
                align="center"
                gap={3}
              >
                {categorias.map((cat) => (
                  <Box
                    key={cat.nome}
                    maxH="50%"
                    bg="#fff"
                    border="2px solid #6AB04C"
                    borderRadius="md"
                    p="1rem"
                    cursor="pointer"
                    boxShadow="md"
                    onClick={() => setCategoriaSelecionada(cat.nome)}
                    _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
                  >
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      mb={2}
                      color="#6AB04C"
                    >
                      {cat.nome.toUpperCase()}
                    </Text>
                    <Text fontSize="md">
                      {cat.quantidade} vídeo(s) pendente(s)
                    </Text>
                  </Box>
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
                          h="150px"
                        />

                        <Flex minW="50%" mt="1rem" p=".4rem" direction="column" >
                          <Text fontWeight="bold" fontSize="lg" >
                            {v.titulo.toUpperCase()}
                          </Text>
                          {/* <Text fontSize="sm" color="gray.500">
                            Intérprete: {v.interpete || "Não informado"}
                          </Text> */}
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
                                    color="white"
                                    onClick={() => aprovar(v)}
                                  >
                                    Aprovar
                                  </Button>
                                  <Button
                                    w="20%"
                                    bg="red"
                                    color="white"
                                    onClick={() => recusar(v)}
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

      {mensagem && (
        <Notificacao mensagem={mensagem} onClose={() => setMensagem("")} />
      )}
    </Grid>
  );
}
