import { useState, useEffect } from "react";
import { Flex, Text, Spinner, Image, Button, Box } from "@chakra-ui/react";
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

export function Administrador() {
  const [pendentes, setPendentes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

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

     setMensagem("Vídeo aprovado!");
    setTimeout(() => setMensagem(""), 5000);
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

    setMensagem("Vídeo recusado!");
    setTimeout(() => setMensagem(""), 5000);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <>
      <MenuUsuario />
      <Flex
        minH="100vh"
        w="100%"
        direction="column"
        align="center"
        justify="flex-start"
        p={6}
        pt="150px"
        bg="#F3F5FC"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Moderação de Vídeos Pendentes
        </Text>

        {carregando ? (
          <Spinner size="lg" color="#6AB04C" />
        ) : (
          <>
            {!categoriaSelecionada ? (
              <Flex wrap="wrap" justify="center" gap={6}>
                {categorias.map((cat) => (
                  <Box
                    key={cat.nome}
                    bg="#fff"
                    border="2px solid #6AB04C"
                    borderRadius="md"
                    p={4}
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
                <Button
                  colorScheme="gray"
                  mb={4}
                  onClick={() => setCategoriaSelecionada(null)}
                >
                  Voltar
                </Button>

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
                        maxW="250px"
                        p={4}
                      >
                        <Image
                          src={
                            v.thumbnail ||
                            "https://via.placeholder.com/400x200.png?text=Prévia+do+Vídeo"
                          }
                          alt="Thumb do vídeo"
                          objectFit="cover"
                          w="100%"
                          h="150px"
                        />

                        <Flex
                          w="100%"
                          mt="1rem"
                          px=".4rem"
                          direction="column"
                        >
                          <Text fontWeight="bold" fontSize="lg">
                            {v.titulo.toUpperCase()}
                          </Text>
                          <Text fontWeight="bold" fontSize="sm" color="#b8c2ca">
                            {v.categoria}
                          </Text>
                        </Flex>

                        <Flex w="100%" align="center" justify="space-around" mt={4}>
                          <Button
                            w="100px"
                            bg="green"
                            color="white"
                            onClick={() => aprovar(v)}
                          >
                            Aprovar
                          </Button>
                          <Button
                            w="100px"
                            bg="red"
                            color="white"
                            onClick={() => recusar(v)}
                          >
                            <FaRegTrashAlt />
                          </Button>
                        </Flex>
                      </Flex>
                    ))}
                </Flex>
              </>
            )}
          </>
        )}
      </Flex>
       {mensagem && (
        <Notificacao mensagem={mensagem} onClose={() => setMensagem("")} />
      )}
    </>
  );
}
