import {
  Button,
  Flex,
  Image,
  Input,
  Span,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import bgFuntlibra from "../../image/bgFuntlibra.png";

export function RecuperarSenha() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      w="100%"
      h="100vh"
      alignItems={"center"}
      alignContent={"center"}
      justify={"center"}
      flexDirection={{ base: "column", md: "row", lg: "row" }}
      bg={"#F3F5FC"}
    >
      <Flex w="50%" maxH="100%" alignItems={"center"} flexDirection="column">
        <Flex
          w={{ base: "300px", s: "150px", md: "350px", lg: "500px" }}
          h={{ base: "350px", s: "250px", md: "350px", lg: "500px" }}
          alignItems={"center"}
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
              Esqueceu sua Senha?
            </Text>
          </Flex>
          <Input
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            placeholder="E-mail"
            padding=".5rem"
            borderColor="#DEF5DE"
          />
          <Input
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            placeholder="Nova Senha"
            padding=".5rem"
            borderColor="#DEF5DE"
          />
          <Input
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            placeholder="Confirmar Nova Senha"
            padding=".5rem"
            borderColor="#DEF5DE"
          />
          <Button
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            bg={"#6AB04C"}
            color="#fff"
          >
            Alterar
          </Button>
          <Flex
            w={{ base: "100px", s: "250px", md: "350px", lg: "350px" }}
            flexDirection="column"
            align='end'
          >
            <Text mt="2rem" color="#7B7B7B">
              Lembrou a senha?
              <Span color="#6AB04C" cursor="pointer">
                Clique aqui
              </Span>
            </Text>
          </Flex>
        </Flex>
      </Flex>
      {!isMobile && (
        <Flex w="50%">
          <Image w="1000px" h="100vh" src={bgFuntlibra}></Image>
        </Flex>
      )}
    </Flex>
  );
}
