import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import ToolTipContainer from "../../components/ToolTip/ToolTip";
import bgFuntlibra from "../../image/bgFuntlibra.png";
import { useState } from "react";
import { IoEyeOff, IoEyeSharp } from "react-icons/io5";
import { db } from "../../services/firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"; 
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { RiArrowLeftLine } from "react-icons/ri";
import { Notificacao } from "../../components/Notificacao/Notificacao";
import { SpinnerPage } from "../../components/Spinner/Spinner";

export function CadastroInterprete() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();

  const [senha, setSenha] = useState("");
  const [nomeInterprete, setNomeInterprete] = useState("");
  const [emailInterprete, setEmailInterprete] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [notificacao, setNotificacao] = useState(null); 
  const [cpfInterprete, setEmailCpfInterprete] = useState("");
  const [cdiInterprete, setCdiInterprete] = useState("");
  const [erroCpf, setErroCpf] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroCDl, setErroCDl] = useState("");
  const [erroCampos, setErroCampos] = useState("");
  const [carregando, setCarregando] = useState(false); 

  const firebaseAuth = getAuth();

  function validarCPF(cpf) {
    cpf = cpfInterprete.replace(/[^\d]+/g, "");

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setErroCpf("");
    setErroSenha("");
    setErroCDl("");
    setErroCampos("");
    setErroEmail("");

    if (
      !nomeInterprete ||
      !emailInterprete ||
      !senha ||
      !confirmarSenha ||
      !cpfInterprete ||
      !cdiInterprete
    ) {
      setErroCampos("Preencha todos os campos!");
      return;
    }

    if (!emailRegex.test(emailInterprete)) {
      setErroEmail("Digite um e-mail válido!");
      return;
    }

    if (senha.length < 6 || confirmarSenha.length < 6) {
      setErroSenha("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    if (cdiInterprete.length < 10) {
      setErroCDl("A CDL precisa ter no mínimo 10 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErroSenha("As senhas não são iguais.");
      return;
    }

    if (!validarCPF(cpfInterprete)) {
      setErroCpf("CPF inválido!");
      return;
    }

    setCarregando(true);

    const currentUser = firebaseAuth.currentUser;

    if (!currentUser) {
      setNotificacao({
        msg: "Erro: Nenhuma sessão de administrador ativa.",
        descricao: "Faça login novamente para realizar o cadastro.",
        tipo: "erro",
      });
      setCarregando(false);
      return;
    }

    let novoUsuarioUid = null;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth, 
        emailInterprete,
        senha
      );
      const newUser = userCredential.user;
      novoUsuarioUid = newUser.uid;

      await setDoc(doc(db, "usuarios", newUser.uid), {
        nome: nomeInterprete,
        email: emailInterprete,
        cdi: cdiInterprete,
        cpf: cpfInterprete,
        senha: senha,
        tipo: "interprete",
      });

      await firebaseAuth.updateCurrentUser(currentUser);

      setNotificacao({
        msg: "Conta de Intérprete criada com sucesso!",
        tipo: "sucesso",
      });

      setSenha("");
      setNomeInterprete("");
      setEmailInterprete("");
      setConfirmarSenha("");
      setEmailCpfInterprete("");
      setCdiInterprete("");
      navigate("/login")
    } catch (erro) {

      if (firebaseAuth.currentUser?.uid === novoUsuarioUid && currentUser) {
        await firebaseAuth.updateCurrentUser(currentUser);
      }

      if (erro.code === "auth/email-already-in-use") {
        setNotificacao({
          msg: "Este E-mail já está cadastrado!",
          descricao: "Tente fazer login ou use outro E-mail",
          tipo: "erro",
        });
      } else {
        console.error("Erro no cadastro:", erro);
        setNotificacao({
          msg: "Erro ao criar usuário.",
          descricao: `Código: ${erro.code}. Verifique os dados.`,
          tipo: "erro",
        });
      }
    } finally {
      setCarregando(false);
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
        justify={"center"}
        flexDirection={{ base: "column", md: "row", lg: "row" }}
        bg={"#F3F5FC"}
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
            <ToolTipContainer descricao="voltar pagina">
              <Button w="100px" bg="#579b3e" onClick={() => navigate("/login")}>
                <RiArrowLeftLine />
              </Button>
            </ToolTipContainer>
          </Flex>
          <Flex
            w={{ base: "300px", s: "150px", md: "350px", lg: "500px" }}
            h="500px"
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
              alignSelf="center"
              padding=".5rem"
              borderColor={!erroCampos ? "#DEF5DE" : "red"}
              value={nomeInterprete}
              onChange={(e) => setNomeInterprete(e.target.value)}
            />
            <Input
              w={{ base: "200px", md: "250px", lg: "350px" }}
              mb="1rem"
              placeholder="Email"
              padding=".5rem"
              alignSelf="center"
              borderColor={!erroEmail && !erroCampos ? "#DEF5DE" : "red"}
              value={emailInterprete}
              onChange={(e) => setEmailInterprete(e.target.value)}
            />
            {erroEmail && (
              <Text color="red" fontSize="sm" ml="4.7rem" mb="1rem">
                {erroEmail}
              </Text>
            )}
            <Flex
              alignSelf="center"
              alignItems="center"
              justify="space-around"
              px=".5rem"
              w={{ base: "200px", md: "250px", lg: "350px" }}
            >
              <Input
                w="50%"
                mb="1rem"
                placeholder="CDI"
                pr=".5rem"
                borderColor={!erroCDl && !erroCampos ? "#DEF5DE" : "red"}
                value={cdiInterprete}
                onChange={(e) => setCdiInterprete(e.target.value)}
              />

              <Input
                w="50%"
                mb="1rem"
                as={InputMask}
                mask="999.999.999-99"
                placeholder="CPF"
                ml=".5rem"
                borderColor={!erroCpf && !erroCampos ? "#DEF5DE" : "red"}
                error={erroCpf}
                value={cpfInterprete}
                onChange={(e) => setEmailCpfInterprete(e.target.value)}
              />
            </Flex>

            {erroCpf && (
              <Text color="red" fontSize="sm" ml="52%" mb="1rem">
                {erroCpf}
              </Text>
            )}
            {erroCDl && (
              <Text color="red" fontSize="sm" ml="4.7rem" mb="1rem">
                {erroCDl}
              </Text>
            )}

            {/* Senha */}
            <Box
              position="relative"
              w={{ base: "200px", md: "250px", lg: "350px" }}
              mb="1rem"
              alignSelf="center"
            >
              <Input
                type={showSenha ? "text" : "password"}
                placeholder="Senha"
                padding=".5rem"
                borderColor={!erroSenha && !erroCampos ? "#DEF5DE" : "red"}
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
              alignSelf="center"
            >
              <Input
                type={showConfirmarSenha ? "text" : "password"}
                placeholder="Confirmar Senha"
                padding=".5rem"
                borderColor={!erroSenha && !erroCampos ? "#DEF5DE" : "red"}
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
              <Text color="red" fontSize="sm" ml="4.7rem" mb="1rem">
                {erroSenha}
              </Text>
            )}

            {erroCampos && (
              <Text color="red" fontSize="sm" ml="4.7rem" mb="1rem">
                {erroCampos}
              </Text>
            )}

            {notificacao && (
              <Notificacao
                msg={notificacao?.msg}
                tipo={notificacao?.tipo}
                descricao={notificacao?.descricao}
                onClose={() => setNotificacao(null)}
              />
            )}

            {carregando ? (
              <Button
                w={{ base: "200px", md: "250px", lg: "350px" }}
                mb="1rem"
                bg={"#6AB04C"}
                color="#fff"
                alignSelf="center"
                isLoading 
                spinner={<SpinnerPage cor="#fff" />}
              >
                Criar
              </Button>
            ) : (
              <Button
                w={{ base: "200px", md: "250px", lg: "350px" }}
                mb="1rem"
                bg={"#6AB04C"}
                color="#fff"
                alignSelf="center"
                onClick={handleSubmit}
                _hover={{ bg: "#579b3e" }}
              >
                Criar
              </Button>
            )}
          </Flex>
        </Flex>
        {!isMobile && (
          <Flex w="50%">
            <Image w="1000px" h="100vh" src={bgFuntlibra}></Image>
          </Flex>
        )}
      </Flex>
    </>
  );
}
