// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Flex, Text, Spinner, Stack } from "@chakra-ui/react";
// import { db } from "../../services/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { MenuUsuario } from "../../components/Menu/menu";

// export function VideoMostrar() {
//   const { categoria } = useParams(); // pega o nome da categoria da URL
//   const [videos, setVideos] = useState([]);
//   const [carregando, setCarregando] = useState(true);

//   useEffect(() => {
//     const buscarVideos = async () => {
//       setCarregando(true);

//       try {
//         const docRef = doc(db, "videos", "libra"); // único documento com todos os vídeos
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const data = docSnap.data();

//           // Converte os vídeos (que estão como objetos) para um array
//           const todosVideos = Object.values(data);

//           // Filtra pelos vídeos da categoria atual
//           const filtrados = todosVideos.filter(
//             (video) =>
//               video.categoria &&
//               video.categoria.toLowerCase() === categoria.toLowerCase()
//           );

//           setVideos(filtrados);
//         }
//       } catch (erro) {
//         console.error("Erro ao buscar vídeos:", erro);
//       }

//       setCarregando(false);
//     };

//     buscarVideos();
//   }, [categoria]);

//   return (
//     <>
//       <MenuUsuario />
//       <Flex
//         minH="100vh"
//         w="100%"
//         direction="column"
//         align="center"
//         justify="center"
//         p={6}
//       >
//         <Text fontSize="2xl" fontWeight="bold" mb={4}>
//           Vídeos da categoria: {categoria}
//         </Text>

//         {carregando ? (
//           <Spinner size="lg" color="#6AB04C" />
//         ) : videos.length === 0 ? (
//           <Text>Nenhum vídeo encontrado.</Text>
//         ) : (
//           <Flex w="50%" h='50%'>
//             {videos.map((video, index) => (
//               <Flex
//                 key={index}
//                 direction="column"
//                 p={4}
//                 // bg="#F3F5FC"
//                 bg='#6AB04C'
//                 border="1px solid #6AB04C"
//                 borderRadius="md"
//                 boxShadow="md"
//               >
//                 <Text fontWeight="bold" mb={2}>
//                   {video.titulo}
//                 </Text>
//                 <video width="50%" controls>
//                   <source src={video.url} type="video/mp4" />
//                 </video>
//               </Flex>
//             ))}
//           </Flex>
//         )}
//       </Flex>
//     </>
//   );
// }
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Flex, Text, Spinner, Image, Button } from "@chakra-ui/react";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { MenuUsuario } from "../../components/Menu/menu";
import { RiCloseFill } from "react-icons/ri";

export function VideoMostrar() {
  const { categoria } = useParams();
  const [videos, setVideos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [videoSelecionado, setVideoSelecionado] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const buscarVideos = async () => {
      setCarregando(true);
      try {
        const docRef = doc(db, "videos", "libra");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const todosVideos = Object.values(data);

          const filtrados = todosVideos.filter(
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

  // const abrirVideo = (video) => {
  //   setVideoSelecionado(video);
  //   onOpen();
  // };

  // const voltar = () => {
  //   navigate(-1);
  // };

 return (
  <>
    <Flex
      minH="100vh"
      w="100%"
      direction="column"
      align="center"
      bg="#F3F5FC"
      px={4}
      py={6}
      pt={{ base: "70px", md: "150px" }}
    >
      <MenuUsuario />

      <Flex w="100%" justify="center" mb={6}>
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
          Vídeos da categoria: {categoria.toUpperCase()}
        </Text>
      </Flex>

      {carregando ? (
        <Spinner size="lg" color="#6AB04C" />
      ) : videos.length === 0 ? (
        <Text>Nenhum vídeo encontrado.</Text>
      ) : (
        <Flex
          wrap="wrap"
          justify="center"
          gap={6}
          w="100%"
          maxW="1200px"
        >
          {videos.map((video, index) => (
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
            >
              <Image
                src={video.thumbnail}
                alt="Thumb do vídeo"
                objectFit="cover"
                w="100%"
                h="150px"
              />
              <Flex direction="column" p={4}>
                <Text
                  fontWeight="bold"
                  fontSize="md"
                  mb={2}
                  noOfLines={1}
                >
                  {video.titulo.toUpperCase()}
                </Text>
                <Button
                  bg="#6AB04C"
                  size="sm"
                  color="white"
                  _hover={{ bg: "#5CA13E" }}
                  onClick={() => setVideoSelecionado(video)}
                >
                  Assistir vídeo
                </Button>
              </Flex>
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
              <RiCloseFill
                color="#6AB04C"
                cursor="pointer"
                size="30px"
                onClick={() => setVideoSelecionado(null)}
              />
            </Flex>
            <video
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "70vh",
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
    </Flex>
  </>
);
}