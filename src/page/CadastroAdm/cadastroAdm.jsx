import {
  Button,
  Flex,
  Image,
  Input,
  Text,
  useBreakpointValue,
  Box,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import ToolTipContainer from "../../components/ToolTip/ToolTip";
import Footer from "../../components/Footer/Footer";
import MenuUsuario from "../../components/Menu/Menu";
import { useState } from "react";
import bgFuntlibra from "../../image/bgFuntlibra.png";
import { IoEyeSharp, IoEyeOff } from "react-icons/io5";
import { auth, db } from "../../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";
import { Notificacao } from "../../components/Notificacao/Notificacao";
import { SpinnerPage } from "../../components/Spinner/Spinner";

export function CadastroAdm() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();

  const [senha, setSenha] = useState("");
  const [nomeAdm, setNomeAdm] = useState("");
  const [emailAdm, setEmailAdm] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [erroCampos, setErroCampos] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [notificacao, setNotificacao] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErroCampos("");
    setErroSenha("");
    setErroEmail("");

    if (!nomeAdm || !emailAdm || !senha || !confirmarSenha) {
      setErroCampos("Preencha todos os campos!");
      return;
    }

    if (!emailRegex.test(emailAdm)) {
      setErroEmail("Digite um e-mail válido!");
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

    setCarregando(true);
    try {
      // Cria usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailAdm,
        senha
      );
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nomeAdm,
        email: emailAdm,
        senha: senha,
        tipo: "adm",
      });

      setNotificacao("");
      setNotificacao({
        msg: "Conta criada com sucesso!",
        tipo: "sucesso",
      });
      // navigate("/login");
    } catch (erro) {
      setCarregando(false);
    if (erro.code === 'auth/email-already-in-use') {
      setNotificacao({
        msg:'Este E-mail já está cadastrado!',
        descricao:"Tente fazer login ou use outro E-mail",
        tipo:"erro"})
    }else{
      setNotificacao({
        msg: "Erro ao criar usuário. Verifique os dados.",
        tipo: "erro",
      });
      }
    }
  };

  return (
    <Grid w="100%" h="100%" templateColumns="repeat(1, 6fr)">
      <GridItem>
        <MenuUsuario />
      </GridItem>
      <GridItem w="100%" h="100">
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
              <ToolTipContainer descricao="voltar pagina">
                <Button
                  w="100px"
                  bg="#579b3e"
                  onClick={() => navigate("/login")}
                >
                  <RiArrowLeftLine />
                </Button>
              </ToolTipContainer>
            </Flex>
            <Flex
              w={{ base: "300px", md: "350px", lg: "500px" }}
              h="auto"
              p="2rem"
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
                Criar Conta Administradora
              </Text>

              <Input
                w={{ base: "200px", md: "250px", lg: "350px" }}
                mb="1rem"
                placeholder="Nome Completo"
                padding=".5rem"
                alignSelf="center"
                borderColor={!erroCampos ? "#DEF5DE" : "red"}
                value={nomeAdm}
                onChange={(e) => setNomeAdm(e.target.value)}
              />

              <Input
                w={{ base: "200px", md: "250px", lg: "350px" }}
                mb={erroEmail ? ".5rem" : "1rem"}
                placeholder="Email"
                padding=".5rem"
                alignSelf="center"
                borderColor={!erroEmail && !erroCampos ? "#DEF5DE" : "red"}
                value={emailAdm}
                onChange={(e) => setEmailAdm(e.target.value)}
              />
              {erroEmail && (
                <Text color="red" fontSize="sm" ml="2.7rem" mb="1rem">
                  {erroEmail}
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
                  alignSelf="center"
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
                <Text color="red" fontSize="sm" ml="2.7rem" mb="1rem">
                  {erroSenha}
                </Text>
              )}

              {erroCampos && (
                <Text color="red" fontSize="sm" ml="2.7rem" mb="1rem">
                  {erroCampos}
                </Text>
              )}

              {carregando ? (
                <Button
                  w={{ base: "200px", md: "250px", lg: "350px" }}
                  mb="1rem"
                  bg={"#6AB04C"}
                  color="#fff"
                  alignSelf="center"
                  onClick={handleSubmit}
                >
                  <SpinnerPage cor="#fff" />
                </Button>
              ) : (
                <Button
                  w={{ base: "200px", md: "250px", lg: "350px" }}
                  mb="1rem"
                  bg="#6AB04C"
                  color="#fff"
                  alignSelf="center"
                  _hover={{ bg: "#579b3e" }}
                  onClick={handleSubmit}
                >
                  Criar
                </Button>
              )}
            </Flex>
          </Flex>

          {notificacao && (
            <Notificacao
              msg={notificacao?.msg}
              tipo={notificacao?.tipo}
              descricao={notificacao?.descricao}
              onClose={() => setNotificacao(null)}
            />
          )}
          {!isMobile && (
            <Flex w="50%">
              <Image w="1000px" h="100vh" src={bgFuntlibra} />
            </Flex>
          )}
        </Flex>
      </GridItem>
      <GridItem>
        <Footer />
      </GridItem>
    </Grid>
  );
}
