import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Image,
  useBreakpointValue,
  Grid,
  GridItem,
  Spinner,
} from "@chakra-ui/react";
import Select from "react-select";
import { uploadVideoToCloudinary } from "../../services/cloudinaryService";
import { salvarVideoNoFirestore } from "../../services/api";
import MenuUsuario from "../../components/Menu/Menu";
import { getAuth } from "firebase/auth";
import bgFuntlibra from "../../image/bgFuntlibra.png";
import Footer from "../../components/Footer/Footer";
import ToolTipContainer from "../../components/ToolTip/ToolTip";
import { RiArrowLeftLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Notificacao } from "../../components/Notificacao/Notificacao";

export function UploadVideo() {
  const [titulo, setTitulo] = useState("");
  const [nomeVideo, setNomeVideo] = useState("");
  const [file, setFile] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [notificacao, setNotificacao] = useState(false);
  const [erro, setErro] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaCustomizada, setCategoriaCustomizada] = useState("");
  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const docRef = doc(db, "videos", "libra");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const listaVideos = data.lista || [];
          console.log(listaVideos);

          const listaCategorias = listaVideos.map((video) => {
            const categoriaKey = video.categoria || "sem_categoria";
            return {
              label: categoriaKey.toUpperCase(),
              value: categoriaKey,
            };
          });

          const categoriasUnicas = listaCategorias.filter(
            (categoria, index, self) =>
              index === self.findIndex((t) => t.value === categoria.value)
          );

          const categoriasComOutros = [
            ...categoriasUnicas,
            { label: "OUTROS", value: "outros" },
          ];

          setCategorias(categoriasComOutros);
        } else {
          setCategorias([{ label: "OUTROS", value: "outros" }]);
        }
      } catch (error) {
        setCategorias([{ label: "OUTROS", value: "outros" }]);
      }
    };

    fetchCategorias();
  }, []); 

  const handleUpload = async () => {

    const categoriaFinal =
      titulo === "outros" ? categoriaCustomizada.trim() : titulo.trim();

    if (!categoriaFinal || !nomeVideo.trim() || !file) {
      setErro("Preencha todos os campos e selecione um vídeo.");
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const { videoUrl, thumbnailUrl } = await uploadVideoToCloudinary(file);

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("Usuário não está logado!");
      }

      await salvarVideoNoFirestore(
        categoriaFinal, 
        videoUrl,
        nomeVideo,
        thumbnailUrl,
        user.uid,
        user.email
      );

      setNotificacao({
        msg: "Vídeo enviado para aprovação!",
        tipo:'sucesso'});

      setTitulo("");
      setNomeVideo("");
      setFile("");
      setCategoriaCustomizada("");
      setErro("");
    } catch (error) {
      setNotificacao({msg: "Erro ao enviar o vídeo.", tipo:'erro'});
    }
    setCarregando(false);
  };

  return (
    <Grid w="100%" h="100%" templateColumns="repeat(1, 6fr)">
      <GridItem w="100%" h="100">
        <MenuUsuario />
      </GridItem>
      <GridItem w="100%" h="100%">
        <Flex
          w="100%"
          h="100vh"
          alignItems="center"
          justify="center"
          flexDirection={{ base: "column", md: "row" }}
          bg="#F3F5FC"
        >
          <Flex
            w={{ base: "100%", lg: "50%" }}
            h="100%"
            alignItems={"center"}
            flexDirection="column"
            position="relative"
            zIndex={1}
          >
            <Flex w="100%" h="20%" justify="start" align="center" pl="2rem">
              <ToolTipContainer descricao="voltar pagina">
                <Button
                  w={{ sm: "15%", lg: "20%" }}
                  bg="#579b3e"
                  onClick={() => navigate("/login")}
                >
                  <RiArrowLeftLine />
                </Button>
              </ToolTipContainer>
            </Flex>
            <Flex
              w={{ base: "300px", md: "350px", lg: "500px" }}
              h="auto"
              p="2rem"
              align={"center"}
              alignContent={"center"}
              justify={"center"}
              flexDirection="column"
              bg={"#F3F5FC"}
              borderRadius={"25px"}
              boxShadow="3px 2px 2px 4px #e8eaf3"
            >
              <Flex
                w={{ base: "300px", s: "150px", md: "350px", lg: "500px" }}
                flexDirection="column"
              >
                <Text
                  fontSize="21px"
                  padding={{ lg: "1rem" }}
                  textAlign="center"
                  color="#000"
                  fontWeight="bold"
                >
                  Cadastro de Vídeo
                </Text>
              </Flex>

              <Box w={{ base: "200px", md: "250px", lg: "350px" }} mb={3} >
                <Select
                  options={categorias}
                  placeholder="Selecione a Linguagem"
                  value={categorias.find((option) => option.value === titulo)}
                  onChange={(selectedOption) => {
                    const newValue = selectedOption ? selectedOption.value : "";
                    setTitulo(newValue);

                    if (newValue !== "outros") {
                      setCategoriaCustomizada("");
                    }
                  }}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minHeight: isMobile ? "40px" : "50px",
                      boxShadow: "none",
                      borderColor: erro ? "#ff0000" : "#DEF5DE",
                      backgroundColor: "#F3F5FC",
                      "&:hover": {
                        borderColor: "#cbd5e0",
                      },
                    }),
                  }}
                />
              </Box>

              {titulo === "outros" && (
                <Input
                  placeholder="Digite o nome da nova categoria"
                  w={{ base: "200px", md: "250px", lg: "350px" }}
                  mb={3}
                  borderColor={erro ? "red.400" : "#DEF5DE"}
                  value={categoriaCustomizada}
                  onChange={(e) => setCategoriaCustomizada(e.target.value)}
                  size={isMobile ? "md" : "lg"}
                />
              )}
              <Input
                placeholder="Nome do termo (ex.: elif)"
                w={{ base: "200px", md: "250px", lg: "350px" }}
                mb={3}
                borderColor={erro ? "red.400" : "#DEF5DE"}
                value={nomeVideo}
                onChange={(e) => setNomeVideo(e.target.value)}
                size={isMobile ? "md" : "lg"}
              />

              <Input
                type="file"
                accept="video/*"
                w={{ base: "200px", md: "250px", lg: "350px" }}
                mb={3}
                onChange={(e) => setFile(e.target.files[0])}
                size={isMobile ? "md" : "lg"}
                color={erro ? "red.400" : "#DEF5DE"}
              />
              <Text color="gray" mb='1rem'> O video precisa ter o máximo 10s de duração.</Text>
              {erro && <Text color="red.500" mb='1rem'>{erro}</Text>}
              {!carregando ? (
                <Button
                  w={{ base: "200px", md: "250px", lg: "350px" }}
                  mb="1rem"
                  bg={"#6AB04C"}
                  color="#fff"
                  onClick={handleUpload}
                  size={isMobile ? "md" : "lg"}
                >
                  Enviar vídeo
                </Button>
              ) : (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="green.500"
                  size="lg"
                />
              )}
            </Flex>
          </Flex>
          {notificacao && (
            <Notificacao
              msg={notificacao?.msg}
              tipo={notificacao?.tipo}
              descricao={notificacao?.descricao}
              onClose={() => setNotificacao(null)}
            />
          )}
          {!isMobile && (
            <Flex w="50%">
              <Image w="1000px" h="100vh" src={bgFuntlibra}></Image>
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
