import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Flex, Text, Image, Button, Grid, GridItem, Box, Input } from "@chakra-ui/react";
import { db } from "../../services/firebase";
import { doc, getDoc,updateDoc } from "firebase/firestore";
import MenuUsuario  from "../../components/Menu/Menu";
import { RiCloseFill, RiArrowLeftLine } from "react-icons/ri";
import { SpinnerPage } from "../../components/Spinner/Spinner";
import Footer from "../../components/Footer/Footer"
import { getAuth } from "firebase/auth";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Notificacao } from "../../components/Notificacao/Notificacao";
import  ToolTipContainer  from "../../components/ToolTip/ToolTip";

export function VideoMostrar() {
  const { categoria } = useParams();
  const [videos, setVideos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [videoSelecionado, setVideoSelecionado] = useState(null);
  const [notificacao, setNotificacao] = useState(false);
  const [busca, setBusca] = useState("");
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const videosFiltrados = videos.filter((video) =>
    video.titulo?.toLowerCase().includes(busca.toLowerCase())
  );


useEffect(() => {
  const buscarUsuario = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsuario(docSnap.data());
      }
    }
  };

  buscarUsuario();
}, []);

  useEffect(() => {
    const buscarVideos = async () => {
      setCarregando(true);
      try {
        const docRef = doc(db, "videos", "libra");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // AGORA PEGA DA `lista`
          const listaVideos = data.lista || [];

          const filtrados = listaVideos.filter(
            (video) =>
              video.categoria &&
              video.categoria.toLowerCase() === categoria.toLowerCase()
          );

          setVideos(filtrados);
        }
      } catch (erro) {
        console.error("Erro ao buscar vídeos:", erro);
      }
      setCarregando(false);
    };

    buscarVideos();
  }, [categoria]);

  const excluirVideo = async (video) => {
  try {
    const docRef = doc(db, "videos", "libra");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const novaLista = (data.lista || []).filter(v => v.url !== video.url); 
      
      await updateDoc(docRef, { lista: novaLista });
      setVideos(novaLista); 

    setNotificacao(true) 
    navigate('/categorias')
    }
  } catch (erro) {
    notificacao("Erro ao excluir vídeo:", erro);
  }
};

  return (
    <Grid w="100%" h="100vh" templateColumns="repeat(1, 2fr)" >
      <GridItem w="100%" h="100%">
        <MenuUsuario />
      </GridItem> 
      <GridItem w="100%" h="100%" mt={{lg:'4rem'}} p='5'>
        <Flex 
          w="100%"
          justify='space-between'
          align={{base:"start",lg:'center'}}
          gap={{base:"3"}}>
          <ToolTipContainer descricao='voltar pagina'>
            <Button
            w={{ base: "15%", lg: "10%" }}
            bg="#4cb04c"
            onClick={() => {
              navigate("/categorias");
            }}
          >
            <RiArrowLeftLine />
          </Button>
          </ToolTipContainer>
          <Input
          placeholder="Buscar vídeo pelo nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          w={{ base: "50%", md: "30%" }}
          display="block"
        />
        </Flex>
    
      </GridItem>

      <GridItem w="100%" h="100%">
        {/* <Flex w="100%" justify="center" mb={6}> */}
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" textAlign='center'>
            Vídeos da categoria: {categoria.toUpperCase()}
          </Text>
        {/* </Flex> */}
      </GridItem>
      <GridItem w="100%" h="100%">
        {carregando ? (
          <SpinnerPage />
        ) : videosFiltrados.length === 0 ? (
          <Text textAlign="center" mt="4">Nenhum vídeo encontrado.</Text>
        ) : (
          <Flex wrap="wrap" justify="center" align='center' gap={6} w="100%" p='3rem'>
            {videosFiltrados.map((video, index) => (
              <Flex
                key={index}
                direction="column"
                bg="#fff"
                border="1px solid #e2e8f0"
                borderRadius="md"
                boxShadow="md"
                overflow="hidden"
                w="100%"
                maxW="250px"
                p='2rem'
                // align='center'
              >
                <Image
                  src={video.thumbnail}
                  alt="Thumb do vídeo"
                  objectFit="cover"
                  w="100%"
                  h="150px"
                />
                <Flex  justify='space-between' p={4}>
                  <Text fontWeight="bold" fontSize="md" textAlign='center' noOfLines={1}>
                    {video.titulo.toUpperCase()}
                  </Text>
                  {usuario?.tipo === "adm" && (
                    <Box>
                    <RiDeleteBin6Line
                      size={24}
                      color="#ff0000"
                      style={{  cursor: "pointer" }}
                      onClick={() => excluirVideo(video)}
                    />
                    </Box>
                  )}
                </Flex>
                <Button
                    w='70%'
                    bg="#6AB04C"
                    size="sm"
                    color="white"
                    m='1rem'
                    alignSelf='center'
                    _hover={{ bg: "#5CA13E" }}
                    onClick={() => setVideoSelecionado(video)}
                  >
                    Assistir vídeo
                  </Button>
              </Flex>
            ))}
          </Flex>
        )}

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
              <Flex w="100%" justify="space-between" mb={4}>
                <Text fontWeight="bold" fontSize="xl">
                  {videoSelecionado.titulo.toUpperCase()}
                </Text>
                <ToolTipContainer descricao='fechar'>
                <RiCloseFill
                  color="#6AB04C"
                  cursor="pointer"
                  size="30px"
                  onClick={() => setVideoSelecionado(null)}
                />
                </ToolTipContainer>
              </Flex>
              <video
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "100vh",
                  borderRadius: "8px",
                }}
                controls
              >
                <source src={videoSelecionado.url} type="video/mp4" />
                Seu navegador não suporta vídeo.
              </video>
            </Flex>
          </Flex>
        )}

        {notificacao && (
        <Notificacao
          mensagem="Vídeo Excluído com sucesso!"
          onClose={() => setNotificacao(false)}
        />
      )}
      </GridItem>
        <Footer/>
    </Grid>
  );

}