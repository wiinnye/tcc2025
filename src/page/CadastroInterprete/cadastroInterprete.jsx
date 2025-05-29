import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import bgFuntlibra from "../../image/bgFuntlibra.png";
import { useState } from "react";
import { IoEyeOff, IoEyeSharp } from "react-icons/io5";
import InputMask from "react-input-mask";

export function CadastroInterprete() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [senha, setSenha] = useState("");
  const [nomeInterprete, setNomeInterprete] = useState("");
  const [emailInterprete, setEmailInterprete] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [cpfInterprete, setEmailCpfInterprete] = useState("");
  const [cdiInterprete, setCdiInterprete] = useState("");
  const [erroCpf, setErroCpf] = useState('');

  function validarCPF(cpf) {
  cpf = cpfInterprete.replace(/[^\d]+/g, ''); // Remove pontos e traços

  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  // Validação do primeiro dígito
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  // Validação do segundo dígito
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nomeInterprete || !emailInterprete || !senha || !confirmarSenha) {
      setErroSenha("Preencha todos os campos!");
      return;
    }

    if (!emailRegex.test(emailInterprete)) {
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


    if (!cpfInterprete) {
    setErroCpf("Preencha o CPF!");
    return;
  }

  if (!validarCPF(cpfInterprete)) {
    setErroCpf("CPF inválido!");
    return;
  }

    setErroCpf('');
    setErroSenha("");
    setMensagem("Conta criada com sucesso!");

    const resultInfoInterprete = {
      nome: nomeInterprete,
      email: emailInterprete,
      cdi: cdiInterprete,
      senha: senha,
    };

    console.log(resultInfoInterprete);

    // navigate("/traducao");
  };

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
              Criar Conta
            </Text>
          </Flex>
          <Input
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            placeholder="Nome Completo"
            padding=".5rem"
            borderColor="#DEF5DE"
            value={nomeInterprete}
            onChange={(e) => setNomeInterprete(e.target.value)}
          />
          <Input
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            placeholder="Email"
            padding=".5rem"
            borderColor="#DEF5DE"
            value={emailInterprete}
            onChange={(e) => setEmailInterprete(e.target.value)}
          />
          <Input
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            placeholder="CDI"
            padding=".5rem"
            borderColor="#DEF5DE"
            value={cdiInterprete}
            onChange={(e) => setCdiInterprete(e.target.value)}
          />
          <Input
            w={{ base: "200px", md: "250px", lg: "350px" }}
            mb="1rem"
            as={InputMask}
            mask="999.999.999-99"
            placeholder="CPF"
            padding=".5rem"
            borderColor="#DEF5DE"
            error={erroCpf}
            value={cpfInterprete}
            onChange={(e) => setEmailCpfInterprete(e.target.value)}
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
            bg={"#6AB04C"}
            color="#fff"
            onClick={handleSubmit}
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