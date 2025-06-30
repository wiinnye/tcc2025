import {
  Button,
  Flex,
  Image,
  Input,
  Text,
  useBreakpointValue,
  Box,
} from "@chakra-ui/react";
import "./style.css";
import { FaXmark } from "react-icons/fa6";
import bgFuntlibra from "../../image/bgFuntlibra.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOff, IoEyeSharp } from "react-icons/io5";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";


export function Login() {
  const [showCard, setShowCard] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [senhaValue, setSenhaValue] = useState("");
  const [error, setError] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const entrarConta = async() => {

    if (!emailValue && !senhaValue ) {
      setErroSenha("Preencha todos os campos!");
      return;
    }

    try {
    const userCredential = await signInWithEmailAndPassword(auth, emailValue, senhaValue);
    const user = userCredential.user;

    // Verifica se o usuário está na coleção 'usuarios' no Firestore
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dadosUsuario = docSnap.data();
      console.log("Tipo de usuário:", dadosUsuario.tipo);

      setMensagem("Login bem-sucedido!");
      // Redireciona se for válido
      navigate("/traducao");
    } else {
      setErroSenha("❌ Usuário não encontrado no banco de dados.");
    }
  } catch (erro) {
    console.error("Erro ao entrar:", erro);
    setErroSenha("❌ Email ou senha incorretos.");
  }
  };

  const esqueceuSenha = () => {
    navigate("/recuperarSenha");
  };

  return (
    <>
        {isMobile && (
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100vw"
        h="100vh"
        backgroundImage={`url(${bgFuntlibra})`}
        backgroundSize="cover"
        backgroundPosition="center"
        zIndex={0}
      />
    )}

      <Flex
        w="100%"
        h="100vh"
        alignItems={"center"}
        justify={"center"}
        flexDirection={{ base: "column", md: "row" }}
        bg={"#F3F5FC"}
      >
        <Flex w="50%" alignItems={"center"} flexDirection="column" position="relative" zIndex={1}> 
          <Flex
            w={{ base: "300px", md: "350px", lg: "500px" }}
            h={{ base: "450px", md: "500px", lg: "500px" }}
            alignItems={"center"}
            justify={"center"}
            flexDirection="column"
            bg={"#F3F5FC"}
            borderRadius={"25px"}
            boxShadow="3px 2px 2px 4px #e8eaf3"
          >
            <Flex
              w={{ base: "150px", md: "250px", lg: "350px" }}
              h={{base: "20%", md:"14%", lg:"20%"}}
              flexDirection="column"
            >
              <Text fontSize={{base:"30px",lg:"38px"}} color={"#6AB04C"} textAlign="center">
                FuntLibra
              </Text>
              <Text paddingBottom={{ lg: "1rem" }} color="#7B7B7B">
                Entre na sua conta
              </Text>
            </Flex>
            <Flex direction="column" mb="1rem">
              <Text fontSize="14px" color="#4A5568" mb="4px">
                Email
              </Text>
              <Input
                placeholder="Digite seu email"
                w={{ base: "200px", md: "250px", lg: "350px" }}
                padding=".5rem"
                borderColor={error ? "red" : "#609ED4"}
                value={emailValue}
                onChange={(e) => {
                  setEmailValue(e.target.value);
                  setError(false);
                }}
              />
            </Flex>

            {/* Senha */}
            <Box
              position="relative"
              w={{ base: "200px", md: "250px", lg: "350px" }}
              mb="1rem"
            >
              <Text fontSize="14px" color="#4A5568" mb="4px">
                Senha
              </Text>
              <Input
                type={showSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                w={{ base: "200px", md: "250px", lg: "350px" }}
                padding=".5rem"
                borderColor={!error ? "#609ED4" : "red"}
                value={senhaValue}
                onChange={(e) => {
                  setSenhaValue(e.target.value);
                }}
              />
              <Box
                position="absolute"
                right="10px"
                top="70%"
                transform="translateY(-50%)"
                cursor="pointer"
                onClick={() => setShowSenha(!showSenha)}
              >
                {showSenha ? (
                  <IoEyeOff size="1.4rem" color="#9b9191" />
                ) : (
                  <IoEyeSharp size="1.4rem" color="#9b9191" />
                )}
              </Box>
            </Box>
            {erroSenha && (
              <Text color="red" fontSize="sm" mb="1rem">
                {erroSenha}
              </Text>
            )}

            {mensagem && (
              <Box
                bg={mensagem.includes("❌") ? "red.100" : "green.100"}
                color={mensagem.includes("❌") ? "red.600" : "green.600"}
                p={2}
                borderRadius="md"
                textAlign="center"
                mb="1rem"
              >
                {mensagem}
              </Box>
            )}

            <Flex
              w={{ base: "200px", md: "250px", lg: "350px" }}
              paddingBottom=".8rem"
            >
              <Text
                fontSize="14px"
                color={"#6AB04C"}
                cursor="pointer"
                onClick={esqueceuSenha}
              >
                Esqueceu a senha?
              </Text>
            </Flex>

            <Button
              w={{ base: "200px", md: "250px", lg: "350px" }}
              mb="1rem"
              bg={"#6AB04C"}
              color="#fff"
              onClick={entrarConta}
            >
              Entrar
            </Button>

            <Text mt="2rem">
              Novo no FuntLibra?{" "}
              <Text
                as="span"
                color="#6AB04C"
                cursor="pointer"
                onClick={() => setShowCard(true)}
              >
                Criar conta
              </Text>
            </Text>
          </Flex>
        </Flex>

        {!isMobile && (
          <Flex w="50%">
            <Image w="1000px" h="100vh" src={bgFuntlibra} />
          </Flex>
        )}
      </Flex>

      {/* CARD CRIAÇÃO DE CONTAS */}
      {showCard && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="999"
        >
          <Box
            bg="white"
            p="2rem"
            borderRadius="md"
            boxShadow="lg"
            w={{ base: "80%", md: "400px" }}
            textAlign="center"
          >
            <Flex justify="end">
              <FaXmark
                cursor="pointer"
                color="#6AB04C"
                size="20px"
                direction="end"
                onClick={() => setShowCard(false)}
              />
            </Flex>
            <Text fontSize="xl" mb="1rem" fontWeight="bold">
              Escolha o tipo de conta
            </Text>

            <Flex w="100%" align="center" direction="column">
              <Button
                w={{base:"250px", lg: "250px" }}
                borderRadius='25px'
                bg="#6AB04C"
                onClick={() => navigate("/cadastroUsuario")}
              >
                Aluno
              </Button>
              <Button
                w={{base:"250px", lg: "250px" }}
                borderRadius='25px'
                bg="#6AB04C"
                mt="1rem"
                onClick={() => navigate("/cadastroInterprete")}
              >
                Intérprete
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  );
}
