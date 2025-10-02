import { useState } from "react";
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
import { uploadVideoToCloudinary } from "../../services/cloudinaryService";
import { salvarVideoNoFirestore } from "../../services/api";
import { MenuUsuario } from "../../components/Menu/menu";
import { getAuth } from "firebase/auth";
import bgFuntlibra from "../../image/bgFuntlibra.png";
import { Footer } from "../../components/Footer/Footer";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../services/firebase";

export function UploadVideo() {
  const [titulo, setTitulo] = useState(""); // Categoria (ex: html)
  const [nomeVideo, setNomeVideo] = useState("");
  const [file, setFile] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  // const [categorias, setCategorias] = useState([]);

  const isMobile = useBreakpointValue({ base: true, md: false });

  // useEffect(() => {
  //   const fetchCategorias = async () => {
  //     try {
  //       const docRef = doc(db, "videos", "libra");
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         const data = docSnap.data();

  //         const listaVideos = data.lista || [];
  //         console.log(listaVideos);

  //         // const listaCategorias = listaVideos.map((video) => ({
  //         //   label: video.categoria.toUpperCase(),
  //         //   value: video.categoria.toUpperCase(),
  //         // }));

  //         const listaCategorias = listaVideos.map((video) => {
  //           const categoriaKey = video.categoria || "sem_categoria";
  //           return {
  //             label: categoriaKey.toUpperCase(),
  //             value: categoriaKey,
  //           };
  //         });

  //         setCategorias(listaCategorias);
  //       } else {
  //         console.log("❌ Documento não encontrado!");
  //       }
  //     } catch (error) {
  //       console.error("Erro ao buscar categorias:", error);
  //     }
  //   };

  //   fetchCategorias();
  // }, []);

  // const handleUpload = async () => {
  //   if (!titulo.trim() || !nomeVideo.trim() || !file) {
  //     setMensagem("⚠️ Preencha todos os campos e selecione um vídeo.");
  //     return;
  //   }

  //   setCarregando(true);
  //   setMensagem("");

  //   try {
  //      const { videoUrl, thumbnailUrl } = await uploadVideoToCloudinary(file);
  //       await salvarVideoNoFirestore(titulo, videoUrl, nomeVideo, thumbnailUrl);

  //     setMensagem("✅ Vídeo enviado com sucesso!");
  //     setTitulo("");
  //     setNomeVideo("");
  //     setFile(null);
  //   } catch (error) {
  //     console.error("Erro no upload:", error);
  //     setMensagem("❌ Erro ao enviar o vídeo.");
  //   }

  //   setCarregando(false);
  // };
  const handleUpload = async () => {
    if (!titulo.trim() || !nomeVideo.trim() || !file) {
      setMensagem("⚠️ Preencha todos os campos e selecione um vídeo.");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      const { videoUrl, thumbnailUrl } = await uploadVideoToCloudinary(file);

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("Usuário não está logado!");
      }
      await salvarVideoNoFirestore(
        titulo,
        videoUrl,
        nomeVideo,
        thumbnailUrl,
        user.uid,
        user.email
      );

      setMensagem("✅ Vídeo enviado para aprovação do administrador!");
      setTitulo("");
      setNomeVideo("");
      setFile("");
    } catch (error) {
      setMensagem("Erro ao enviar o vídeo.");
    }

    setCarregando(false);
  };

  return (
    <Grid w="100%" h="100%" templateColumns="repeat(1, 6fr)">
      <GridItem w="100%" h="100">
        <MenuUsuario />
      </GridItem>
      <GridItem w="100%" h="100%" mt="3.2rem">
        <Flex justify="center">
          {isMobile && (
            <Box
              position="absolute"
              top={0}
              left={0}
              w="100vw"
              h="100%"
              backgroundImage={`url(${bgFuntlibra})`}
              backgroundSize="cover"
              backgroundPosition="center"
              zIndex={-1}
            />
          )}
          <Flex
            w={{ base: "100%", lg: "50%" }}
            h="100%"
            alignItems="center"
            justify="center"
            flexDirection="column"
            position="relative"
            zIndex={1}
            pt={{ base: "70px", md: "90px", lg: "80px" }}
          >
            <Flex
              w={{ base: "300px", s: "150px", md: "350px", lg: "500px" }}
              h="500px"
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

              {/* <Select.Root
                w={{ base: "200px", md: "250px", lg: "600px" }}
                size={isMobile ? "md" : "lg"}
                width="320px"
                mb="1rem"
                value={titulo}
                onValueChange={(value) => setTitulo(value)}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Selecionar a Linguagem" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>

                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {categorias.map((categoria) => (
                        <Select.Item
                          key={categoria.value}
                          item={{ value: categoria.value, label: categoria.label }}
                        >
                          <Select.ItemText>{categoria.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root> */}

              <Input
                placeholder="Nome da Linguaguem (ex.: html)"
                w={{ base: "200px", md: "250px", lg: "350px" }}
                mb={3}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                size={isMobile ? "md" : "lg"}
              /> 

              <Input
                placeholder="Nome de termo"
                w={{ base: "200px", md: "250px", lg: "350px" }}
                mb={3}
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
              />
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
              {mensagem && (
                <Box
                  bg={mensagem.includes("❌") ? "red.100" : "green.100"}
                  color={mensagem.includes("❌") ? "red.600" : "green.600"}
                  p={3}
                  borderRadius="md"
                  textAlign="center"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {mensagem}
                </Box>
              )}
            </Flex>
          </Flex>
          {!isMobile && (
            <Flex w="50%" zIndex={-1}>
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
