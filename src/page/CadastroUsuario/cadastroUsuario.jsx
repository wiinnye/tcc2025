import {
  Button,
  Flex,
  Image,
  Input,
  Text,
  useBreakpointValue,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import bgFuntlibra from "../../image/bgFuntlibra.png";
import { IoEyeSharp, IoEyeOff } from "react-icons/io5";
import { auth, db } from "../../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";
import ToolTipContainer  from "../../components/ToolTip/ToolTip";

export function CadastroUsuario() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();

  const [senha, setSenha] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nomeUsuario || !emailUsuario || !senha || !confirmarSenha) {
      setErroSenha("Preencha todos os campos!");
      return;
    }

    if (!emailRegex.test(emailUsuario)) {
      setErroSenha("Digite um e-mail válido!");
      return;
    }

    if (senha.length < 6 || confirmarSenha.length < 6) {
      setErroSenha("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErroSenha("As senhas não são iguais.");
      return;
    }

    setErroSenha("");
    setMensagem("Conta criada com sucesso!");

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailUsuario,
        senha
      );
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nomeUsuario,
        email: emailUsuario,
        senha: senha,
        tipo: "aluno",
      });

      setMensagem("Conta criada com sucesso!");
      navigate("/login");
      console.log("Usuário salvo:", user.uid);
    } catch (erro) {
      console.error("Erro ao criar usuário:", erro);
      setErroSenha("Erro ao criar usuário. Verifique os dados.");
    }
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
          <ToolTipContainer descricao='voltar pagina'>
            <Button w="100px" bg="#579b3e" onClick={() => navigate("/login")}>
              <RiArrowLeftLine />
            </Button>
            </ToolTipContainer>
          </Flex>
          <Flex
            w={{ base: "300px", md: "350px", lg: "500px" }}
            h="auto"
            p="2rem"
            alignItems="center"
            justify="center"
            flexDirection="column"
            bg="#F3F5FC"
            borderRadius="25px"
            boxShadow="3px 2px 2px 4px #e8eaf3"
          >
            <Text
              fontSize="21px"
              mb="1rem"
              textAlign="center"
              color="#000"
              fontWeight="bold"
            >
              Criar Conta
            </Text>

            <Input
              w={{ base: "200px", md: "250px", lg: "350px" }}
              mb="1rem"
              placeholder="Nome Completo"
              padding=".5rem"
              borderColor="#DEF5DE"
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
            />
            <Input
              w={{ base: "200px", md: "250px", lg: "350px" }}
              mb="1rem"
              placeholder="Email"
              padding=".5rem"
              borderColor="#DEF5DE"
              value={emailUsuario}
              onChange={(e) => setEmailUsuario(e.target.value)}
            />

            {/* Senha */}
            <Box
              position="relative"
              w={{ base: "200px", md: "250px", lg: "350px" }}
              mb="1rem"
            >
              <Input
                type={showSenha ? "text" : "password"}
                placeholder="Senha"
                padding=".5rem"
                borderColor={!erroSenha ? "#DEF5DE" : "red"}
                w="100%"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <Box
                position="absolute"
                right="10px"
                top="50%"
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

            {/* Confirmar Senha */}
            <Box
              position="relative"
              w={{ base: "200px", md: "250px", lg: "350px" }}
              mb="1rem"
            >
              <Input
                type={showConfirmarSenha ? "text" : "password"}
                placeholder="Confirmar Senha"
                padding=".5rem"
                borderColor={!erroSenha ? "#DEF5DE" : "red"}
                w="100%"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
              <Box
                position="absolute"
                right="10px"
                top="50%"
                transform="translateY(-50%)"
                cursor="pointer"
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
              >
                {showConfirmarSenha ? (
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

            <Button
              w={{ base: "200px", md: "250px", lg: "350px" }}
              mb="1rem"
              bg="#6AB04C"
              color="#fff"
              _hover={{ bg: "#579b3e" }}
              borderRadius="15px"
              onClick={handleSubmit}
            >
              Criar
            </Button>
          </Flex>
        </Flex>

        {!isMobile && (
          <Flex w="50%">
            <Image w="1000px" h="100vh" src={bgFuntlibra} />
          </Flex>
        )}
      </Flex>
    </>
  );
}
