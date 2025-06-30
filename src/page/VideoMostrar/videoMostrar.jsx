// import { useEffect, useState } from "react";
// import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
// import { buscarVideo } from "../../services/api";
// import { useNavigate, useParams } from "react-router-dom";

// export function VideoMostrar() {
//   const navigate = useNavigate();
//   const { texto } = useParams(); // pega o texto da URL
//   const [videoUrl, setVideoUrl] = useState("");
//   const [carregando, setCarregando] = useState(false);
//   const [naoEncontrado, setNaoEncontrado] = useState(false);

//   useEffect(() => {
//     const buscar = async () => {
//       if (!texto || texto.trim() === "") {
//         setVideoUrl("");
//         setNaoEncontrado(false);
//         return;
//       }

//       setCarregando(true);
//       setNaoEncontrado(false);

//       try {
//         const resultado = await buscarVideo(decodeURIComponent(texto));

//         if (resultado.encontrado) {
//           setVideoUrl(resultado.url);
//         } else {
//           setNaoEncontrado(true);
//           setVideoUrl("");
//         }
//       } catch {
//         setNaoEncontrado(true);
//         setVideoUrl("");
//       }

//       setCarregando(false);
//     };

//     buscar();
//   }, [texto]);

//     const handleProduzirNovamente = () => {
//     navigate(`/traducao/${texto}`);
//   };

//   const handleVoltar = () => {
//     navigate("/traducao");
//   };

//   return (
//      <Flex
//       minH="100vh"
//       w="100%"
//       bg="#F3F5FC"
//       justify="center"
//       align="center"
//       p={4}
//       direction='column'
//     >
//       <VStack
//         spacing={6}
//         bg="#6AB04C"
//         p={6}
//         borderRadius="lg"
//         boxShadow="lg"
//         w={{ base: "100%", md: "600px", lg: "700px" }}
//       >
//         {carregando && <Text>Buscando vídeo...</Text>}
//         {naoEncontrado && <Text>Nenhum vídeo encontrado.</Text>}

//         {videoUrl && (
//           <Box w="100%">
//             <video width="100%" controls>
//               <source src={videoUrl} type="video/mp4" />
//               Seu navegador não suporta vídeo.
//             </video>
//           </Box>
//         )}

//         <Text fontSize="2xl" fontWeight="bold" color="#fff">
//           {texto}
//         </Text>

//         <Text textAlign="center" color="#fff">
//           Aqui está a tradução da palavra "<strong>{texto}</strong>" para Libras.
//           Se desejar, você pode gerar novamente ou voltar para a tela inicial.
//         </Text>
//       </VStack>
//         <Flex gap={4} wrap="wrap" mt='2rem'>
//           <Button
//             w='200px'
//             bg="#6AB04C"
//             color="white"
//             borderRadius='15px'
//             padding='24px'
//             _hover={{ bg: "#579b3e" }}
//             onClick={handleProduzirNovamente}
//           >
//             Produzir Novamente
//           </Button>
//           <Button
//             w='200px'
//             variant="outline"
//             borderColor="#6AB04C"
//             borderRadius='15px'
//             padding='24px'
//             color="#6AB04C"
//             _hover={{ bg: "#e8f5e9" }}
//             onClick={handleVoltar}
//           >
//             Voltar
//           </Button>
//         </Flex>
//     </Flex>
//   );
// }


// import { useEffect, useState } from "react";
// import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
// import { buscarVideo, buscarVideosDaCategoria } from "../../services/api";
// import { useNavigate, useParams } from "react-router-dom";

// export function VideoMostrar() {
//   const navigate = useNavigate();
//   const { texto, categoria } = useParams();
//   const [videoUrl, setVideoUrl] = useState("");
//   const [listaVideos, setListaVideos] = useState([]);
//   const [carregando, setCarregando] = useState(false);
//   const [naoEncontrado, setNaoEncontrado] = useState(false);


//   useEffect(() => {
//   const buscar = async () => {
//     setCarregando(true);
//     setNaoEncontrado(false);

//     try {
//       if (categoria) {
//         const resultado = await buscarVideosDaCategoria(categoria);
//         if (resultado.length > 0) {
//           setListaVideos(resultado);
//         } else {
//           setNaoEncontrado(true);
//         }
//       } else if (texto && texto.trim() !== "") {
//         const resultado = await buscarVideo(decodeURIComponent(texto));
//         if (resultado.encontrado) {
//           setVideoUrl(resultado.url);
//         } else {
//           setNaoEncontrado(true);
//         }
//       }
//     } catch {
//       setNaoEncontrado(true);
//     }

//     setCarregando(false);
//   };

//   buscar();
// }, [texto, categoria]);
//     const handleProduzirNovamente = () => {
//     navigate(`/traducao/${texto}`);
//   };

//   const handleVoltar = () => {
//     navigate("/traducao");
//   };

//   return (
//      <Flex
//       minH="100vh"
//       w="100%"
//       bg="#F3F5FC"
//       justify="center"
//       align="center"
//       p={4}
//       direction='column'
//     >
//       <VStack
//         spacing={6}
//         bg="#6AB04C"
//         p={6}
//         borderRadius="lg"
//         boxShadow="lg"
//         w={{ base: "100%", md: "600px", lg: "700px" }}
//       >
//         {carregando && <Text>Buscando vídeo...</Text>}
//         {naoEncontrado && <Text>Nenhum vídeo encontrado.</Text>}

//        {videoUrl && (
//   <Box w="100%">
//     <video width="100%" controls>
//       <source src={videoUrl} type="video/mp4" />
//       Seu navegador não suporta vídeo.
//     </video>
//   </Box>
// )}

// {listaVideos.length > 0 && (
//   <VStack spacing={4} w="100%">
//     {listaVideos.map((video, index) => (
//       <Box key={index} w="100%">
//         <Text fontWeight="bold" color="white" mb={1}>
//           {video.titulo}
//         </Text>
//         <video width="100%" controls>
//           <source src={video.url} type="video/mp4" />
//           Seu navegador não suporta vídeo.
//         </video>
//       </Box>
//     ))}
//   </VStack>
// )}

//         <Text fontSize="2xl" fontWeight="bold" color="#fff">
//           {texto}
//         </Text>

//         <Text textAlign="center" color="#fff">
//           Aqui está a tradução da palavra "<strong>{texto}</strong>" para Libras.
//           Se desejar, você pode gerar novamente ou voltar para a tela inicial.
//         </Text>
//       </VStack>
//         <Flex gap={4} wrap="wrap" mt='2rem'>
//           <Button
//             w='200px'
//             bg="#6AB04C"
//             color="white"
//             borderRadius='15px'
//             padding='24px'
//             _hover={{ bg: "#579b3e" }}
//             onClick={handleProduzirNovamente}
//           >
//             Produzir Novamente
//           </Button>
//           <Button
//             w='200px'
//             variant="outline"
//             borderColor="#6AB04C"
//             borderRadius='15px'
//             padding='24px'
//             color="#6AB04C"
//             _hover={{ bg: "#e8f5e9" }}
//             onClick={handleVoltar}
//           >
//             Voltar
//           </Button>
//         </Flex>
//     </Flex>
//   );
// }



import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import { buscarVideo, buscarVideosDaCategoria } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

export function VideoMostrar() {
  const navigate = useNavigate();
  const { texto, categoria } = useParams();

  const [videoUrl, setVideoUrl] = useState("");
  const [listaVideos, setListaVideos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  // const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const buscar = async () => {
      setCarregando(true);
      setNaoEncontrado(false);

      try {
        if (categoria) {
          const resultado = await buscarVideosDaCategoria(categoria);
          if (resultado.length > 0) {
            setListaVideos(resultado);
          } else {
            setNaoEncontrado(true);
          }
        } else if (texto && texto.trim() !== "") {
          const resultado = await buscarVideo(decodeURIComponent(texto));
          if (resultado.encontrado) {
            setVideoUrl(resultado.url);
          } else {
            setNaoEncontrado(true);
          }
        }
      } catch {
        setNaoEncontrado(true);
      }

      setCarregando(false);
    };

    buscar();
  }, [texto, categoria]);

  // const handleProduzirNovamente = () => {
  //   navigate(`/traducao/${texto}`);
  // };

  const handleVoltar = () => {
    navigate("/traducao");
  };

  console.log(buscarVideosDaCategoria(categoria))

  return (
    <Flex
      minH="100vh"
      w="100%"
      bg="#F3F5FC"
      justify="center"
      align="center"
      p={4}
      direction="column"
    >
      <VStack
        spacing={6}
        bg="#6AB04C"
        p={6}
        borderRadius="lg"
        boxShadow="lg"
        w="100%"
        maxW="700px"
      >
        {carregando && <Text color="white">Buscando vídeo...</Text>}
        {naoEncontrado && <Text color="white">Nenhum vídeo encontrado.</Text>}

        {videoUrl && (
          <Box w="100%">
            <video width="100%" controls>
              <source src={videoUrl} type="video/mp4" />
              Seu navegador não suporta vídeo.
            </video>
          </Box>
        )}

        {listaVideos.length > 0 && (
          <VStack spacing={4} w="100%">
            {listaVideos.map((video, index) => (
              <Box key={index} w="100%">
                <Text fontWeight="bold" color="white" mb={1}>
                  {video.titulo}
                </Text>
                <video width="100%" controls>
                  <source src={video.url} type="video/mp4" />
                  Seu navegador não suporta vídeo.
                </video>
              </Box>
            ))}
          </VStack>
        )}

        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          color="#fff"
          textAlign="center"
        >
          {texto}
        </Text>

        <Text
          textAlign="center"
          color="#fff"
          fontSize={{ base: "sm", md: "md" }}
        >
          Aqui está a palavra{" "}
          <strong style={{ fontWeight: "bold" }}>{texto}</strong>
        </Text>
      </VStack>

      <Flex
        gap={4}
        mt="2rem"
        w="100%"
        maxW="700px"
        flexDirection={{ base: "column", md: "row" }}
      >
        <Button
          w="100%"
          variant="outline"
          borderColor="#6AB04C"
          borderRadius="15px"
          py={6}
          color="#6AB04C"
          _hover={{ bg: "#e8f5e9" }}
          onClick={handleVoltar}
        >
          Voltar
        </Button>
      </Flex>
    </Flex>
  );
}
