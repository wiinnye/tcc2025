import {
  Button,
  Flex,
  Image,
  Stack,
  Text,
  Textarea,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import mensagem from "../../image/mensagem.png";
import { useNavigate } from "react-router-dom";
import { IconeFuntLibra } from "../../components/IconeFuntLibra/IconeFuntLibra";
import { buscarVideo } from "../../services/api";


export function Home() {
  let [valor, setValor] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // const existe = buscarVideo.includes(valor.toLowerCase());

   const handleButtonClick = async () => {
    if (valor.trim() === "") {
      setErro("⚠️ O campo não pode estar vazio.");
      return;
    }

    try {
      const resultado = await buscarVideo(valor);

      if (resultado.encontrado) {
        setErro(""); // Limpa erro anterior
        navigate(`/traducao/${encodeURIComponent(valor)}`);
      } else {
        setErro("❌ Nenhuma tradução encontrada para este texto.");
      }
    } catch (error) {
      console.error(error);
      setErro("❌ Erro ao buscar no banco de dados.");
    }
  };

  const handleDelete = () => {
    setValor("");
    setErro(""); // Limpa erro ao apagar
  };

  return (
    <Flex 
    h="100vh" 
    direction={{base:"column-reverse", lg:"row"}} 
    justifyItems="center" 
    alignItens="center"
    >
      <Flex
        w="100%"
        h={{ base: "100%", s: "90%", md: "90%", lg: "90%" }}
        direction="column"
        justify="center"
        align="center"
      >
        <Textarea
          w={{ base: "250px", s: "450px", md: "450px", lg: "500px" }}
          minH="350px"
          placeholder="Digite o Texto"
          borderRadius="25px 25px"
          bg="F3F5FC"
          p="2rem"
          resize="none"
          borderColor="#6AB04C"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <Stack direction="row" spacing={4} justify="center" mt="4rem">
          <Button
            w={{ base: "120px", s: "200px", md: "200px", lg: "250px" }}
            bg="#6ab04c"
            borderRadius="15px"
            padding="24px"
            onClick={handleButtonClick}
          >
            Traduzir Texto
          </Button>
          <Button
            w={{ base: "120px", s: "200px", md: "200px", lg: "250px" }}
            borderColor="#6ab04c"
            bg="#F3F5FC"
            color="#6ab04c"
            borderRadius="15px"
            padding="24px"
            onClick={handleDelete}
          >
            Apagar
          </Button>
        </Stack>
        {isMobile && erro &&  (
          <Flex w="100%" justify="center" align="center" mt="2rem">
            <Flex
              w={{ base: "250px" }}
              h={{ base: "150px" }}
              bg="#6AB04C"
              borderRadius="25px 25px"
              direction="column"
              justify="center"
              align="center"
            >
              <Text
                fontSize="20px"
                color="#fff"
                textAlign="center"
                mt="1rem"
                fontWeight="bold"
              >
                Nenhuma mensagem encontrada
              </Text>
              <Text
                fontSize="14px"
                mt="1rem"
                textAlign="center"
                color="#495057"
              >
                {" "}
                Digite um texto que você deseja traduzir
              </Text>
            </Flex>
          </Flex>
        )}
      </Flex>
      {erro && !isMobile ? 
        <Flex w="50%" justify="center" align="center">
          <Flex
            w={{ base: "200px", s: "350px", md: "250px", lg: "300px" }}
            h={{ base: "200px", s: "350px", md: "450px", lg: "550px" }}
            bg="#6AB04C"
            borderRadius="25px 25px"
            direction="column"
            justify="center"
            align="center"
          >
            <Image
              src={mensagem}
              alt="mensagem nao encontrada"
              w="200px"
              h="204px"
            />
            <Text
              fontSize="23px"
              color="#fff"
              textAlign="center"
              mt="1rem"
              fontWeight="bold"
            >
              Nenhuma mensagem encontrada
            </Text>
            <Text fontSize="18px" mt="1rem" textAlign="center" color="#495057">
              {" "}
              Digite um texto que você deseja traduzir
            </Text>
          </Flex>
        </Flex>
        :
        <IconeFuntLibra/>
      } 

    </Flex>
  );
}
