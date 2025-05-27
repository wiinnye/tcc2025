import {
  Button,
  Flex,
  Image,
  Input,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import bgFuntlibra from "../../image/bgFuntlibra.png";

export function CadastroUsuario() {
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
              textAlign='center'
              color="#000"
              fontWeight="bold"
            >
              Criar Conta
            </Text>
          </Flex>
          <Input
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            placeholder="Nome Completo"
            padding=".5rem"
            borderColor="#DEF5DE"
          />
          <Input
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            placeholder="Email"
            padding=".5rem"
            borderColor="#DEF5DE"
          />
          <Input
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            placeholder="Senha"
            padding=".5rem"
            borderColor="#DEF5DE"
          />
          <Input
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            placeholder="Confirmar Senha"
            padding=".5rem"
            borderColor="#DEF5DE"
          />
          <Button
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            bg={"#6AB04C"}
            color="#fff"
          >
            Criar
          </Button>
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
