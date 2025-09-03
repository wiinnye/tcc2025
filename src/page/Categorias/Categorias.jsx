import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Text } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { MenuUsuario } from "../../components/Menu/menu";
import bgCategoria from "../../image/bgCategoria.png"
import { SpinnerPage } from "../../components/Spinner/Spinner";
import { Footer } from "../../components/Footer/Footer"

export function Categorias() {
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
          const todasCategorias = listaVideos.map((video) => video.categoria);

          // Remove duplicadas (ignorando maiúsculas/minúsculas)
          const categoriasMap = new Map();
          todasCategorias.forEach((cat) => {
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
    <Flex
      w="100%"
      h="100vh"
      direction="column"
      justify="center"
      align="center"
      bg='#fcf9f9'
    >
      <MenuUsuario />
      <Flex
        w='100%'
        h="100%"
        justify="center"
        align="center"
        mt='2.5rem'
      >
          {carregando ? (
            <SpinnerPage />
          ) : (
            <Flex w='100%' h={{base:'50%',lg:'100%'}} justify="center" align='center' gap="1rem" mt="2rem" wrap="wrap">
              {categorias.map((categoria, index) => (
                <Flex
                  key={index}
                  cursor="pointer"
                  w={{ base: "120px", md: "300px" }}
                  h={{ base: "120px", md: "50%" }}
                  direction="column"
                  align="center"
                  justify="center"
                  _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
                  backgroundImage={`url(${bgCategoria})`}
                  backgroundSize="contain"
                  backgroundRepeat="no-repeat"
                  backgroundPosition="center"
                  onClick={() => navigate(`/traducao/categoria/${categoria}`)}
                >
                  <Text
                    mb={{base:'3rem',md:'124px', lg:'110px'}}
                    fontWeight="bold"
                    color="#fff"
                    fontSize={{base:'md',md:'24px',lg:"26px"}}
                    textAlign='center'
                  >
                    {categoria.toUpperCase()}
                  </Text>
                </Flex>
              
              ))}
            </Flex>
          )}
      </Flex>
    <Footer/>
      </Flex>
  );
}
