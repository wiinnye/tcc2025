import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import MenuUsuario from "../../components/Menu/Menu";
import bgCategoria from "../../image/bgCategoria.png";
import { SpinnerPage } from "../../components/Spinner/Spinner";
import Footer from "../../components/Footer/Footer";
import { RiArrowLeftLine } from "react-icons/ri";
import ToolTipContainer from "../../components/ToolTip/ToolTip";

export function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

useEffect(() => {
    const buscarCategorias = async () => {
      try {
        const docRef = doc(db, "videos", "libra");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          const listaVideos = data.lista || [];

          const todasCategorias = listaVideos.map((video) => video.categoria);

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
    <Grid w="100%" minH="100vh" templateColumns="repeat(1, 2fr)">
      <GridItem w="100%" h="100%">
        <MenuUsuario />
      </GridItem>
      <GridItem w="100%" mt={{ lg: '4rem' }} p='5'>
        <Flex
          w="100%"
          justify='space-between'
          align={{ base: "start", lg: 'center' }}
          gap={{ base: "3" }}
        >
          <ToolTipContainer descricao="voltar pagina">
            <Button
              w={{ base: "15%", lg: "10%" }}
              bg="#4cb04c"
              mb={4}
              onClick={() => {
                navigate("/tradutor");
              }}
            >
              <RiArrowLeftLine />
            </Button>
          </ToolTipContainer>
          {/* <Filtro
            busca={busca}
            setBusca={setBusca}
            placeholder={"buscar categoria pelo nome..."}
          /> */}
        </Flex>
        <GridItem>
           <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            textAlign="center"
          >
            Confira as Linguagens Disponíveis:
          </Text>
        </GridItem>
      </GridItem>
      <GridItem w="100%" h="100%" >
        {carregando ? (
          <SpinnerPage />
        ) : (
          <>
            <Flex
              w="100%"
              minH="100%"
              justify="center"
              align="center"
              gap={3}
            >
              {categorias.map((categoria, index) => (
                <Flex
                  key={index}
                  cursor="pointer"
                  w={{ base: "120px", md: "200px", lg: "300px" }}
                  h={{ base: "120px", md: "200px", lg: "350px" }}
                  direction="column"
                  align="center"
                  justify="center"
                  p="3rem"
                  _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
                  backgroundImage={`url(${bgCategoria})`}
                  backgroundSize="contain"
                  backgroundRepeat="no-repeat"
                  backgroundPosition="center"
                 onClick={() => navigate(`/traducao/categoria/${categoria}`)}
                >
                  <Text
                    mb={{ base: "3rem", md: "124px", lg: "110px" }}
                    fontWeight="bold"
                    color="#fff"
                    fontSize={{ base: "md", md: "24px", lg: "26px" }}
                    textAlign="center"
                    className="notranslate"
                    w="100%"
                    whiteSpace="normal"
                    wordBreak="break-word"
                  >
                    {categoria.toUpperCase()}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </>
        )}
      </GridItem>
      <GridItem>
        <Footer />
      </GridItem>
    </Grid>
  );
}
