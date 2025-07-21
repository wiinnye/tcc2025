import { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { MenuUsuario } from "../../components/Menu/menu";

export function Home() {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        const docRef = doc(db, "videos", "libra"); // único documento
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // 🚩 NOVO: acessa a lista diretamente
          const listaVideos = data.lista || [];

          // Pega todas as categorias dos vídeos
          const todasCategorias = listaVideos.map(video => video.categoria);
          console.log("Categorias encontradas:", todasCategorias);

          // Remove duplicadas (ignorando maiúsculas/minúsculas)
          const categoriasMap = new Map();
          todasCategorias.forEach(cat => {
            const chave = cat.trim().toLowerCase();
            if (!categoriasMap.has(chave)) {
              categoriasMap.set(chave, cat.trim());
            }
          });

          const categoriasUnicas = Array.from(categoriasMap.values());

          setCategorias(categoriasUnicas);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarCategorias();
  }, []);

  return (
    <>
      <MenuUsuario />
      <Flex
        h="100vh"
        direction={{ base: "column-reverse", lg: "row" }}
        justify="center"
        align="center"
        px={4}
        py={6}
      >
        <Flex
          w="100%"
          h="100%"
          direction="column"
          justify="center"
          align="center"
        >
          {carregando ? (
            <Spinner size="lg" color="#6AB04C" />
          ) : (
            <Flex wrap="wrap" justify="center" gap="1rem" mt="2rem">
              {categorias.map((categoria, index) => (
                <Flex
                  key={index}
                  onClick={() =>
                    navigate(`/traducao/categoria/${categoria}`)
                  }
                  cursor="pointer"
                  w={{ base: "120px", md: "150px" }}
                  h={{ base: "120px", md: "150px" }}
                  direction="column"
                  align="center"
                  justify="center"
                  bg="#F3F5FC"
                  border="2px solid #6AB04C"
                  borderRadius="20px"
                  boxShadow="lg"
                  _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
                >
                  <Text mt="1rem" fontWeight="bold" color="#6AB04C" fontSize="lg">
                    {categoria.toUpperCase()}
                  </Text>
                </Flex>
              ))}
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
}
