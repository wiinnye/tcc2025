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
// import { useNavigate } from "react-router-dom";

export function CadastroUsuario() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  // const navigate = useNavigate();

  const [senha, setSenha] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1️⃣ Verificar se todos os campos estão preenchidos
    if (!nomeUsuario || !emailUsuario || !senha || !confirmarSenha) {
      setErroSenha("Preencha todos os campos!");
      return;
    }

    // 2️⃣ Validar se o email é válido
    if (!emailRegex.test(emailUsuario)) {
      setErroSenha("Digite um e-mail válido!");
      return;
    }

    // 3️⃣ Verificar se a senha tem no mínimo 6 caracteres
    if (senha.length < 6 || confirmarSenha.length < 6) {
      setErroSenha("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    // 4️⃣ Verificar se as senhas são iguais
    if (senha !== confirmarSenha) {
      setErroSenha("As senhas não são iguais.");
      return;
    }

    // ✅ Se tudo estiver certo, limpa os erros e envia os dados
    setErroSenha("");
    setMensagem("Conta criada com sucesso!");

    const resultInfoUsuario = {
      nome: nomeUsuario,
      email: emailUsuario,
      senha: senha,
    };

    console.log(resultInfoUsuario);

    // Aqui você pode fazer o envio dos dados, navegação, etc.
    // navigate("/traducao");
  };

  return (
    <Flex
      w="100%"
      h="100vh"
      alignItems="center"
      justify="center"
      flexDirection={{ base: "column", md: "row" }}
      bg="#F3F5FC"
    >
      <Flex w="50%" alignItems="center" flexDirection="column">
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
  );
}
