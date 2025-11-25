import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Group,
  Image,
  Input,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "../../services/firebase";
import {
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  doc,
  query,
  collection,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import bgFuntlibra from "../../image/bgFuntlibra.png";
import { RiArrowLeftLine } from "react-icons/ri";
import { IoEyeOff, IoEyeSharp } from "react-icons/io5";
import { Notificacao } from "../../components/Notificacao/Notificacao";
import ToolTipContainer from "../../components/ToolTip/ToolTip";
import MenuUsuario from "../../components/Menu/Menu";
import Footer from "../../components/Footer/Footer";
import { SpinnerPage } from "../../components/Spinner/Spinner";

export function RecuperarSenha() {
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenhaAtual, setErroSenhaAtual] = useState("");
  const [erroNova, setErroNova] = useState("");
  const [erroConfirmar, setErroConfirmar] = useState("");
  const [notificacao, setNotificacao] = useState(null);
   const [carregando, setCarregando] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();

  // Verifica se há usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
    });
    return () => unsubscribe();
  }, []);

  // Quando o usuário **não estiver logado**
  const handleEnviarEmail = async () => {
    setErroEmail("");

    if (!email) {
      setErroEmail("Preencha o campo de e-mail");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setNotificacao({
        msg: "E-mail enviado!",
        descricao: "Verifique sua caixa de entrada para redefinir sua senha.",
        tipo: "sucesso",
      });

      
      setEmail("");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setErroEmail("Usuário não encontrado");
      } else if (error.code === "auth/invalid-email") {
        setErroEmail("E-mail inválido");
      } else {
        setErroEmail("Erro ao enviar e-mail. Tente novamente.");
      }
    } 
  };

  // Quando o usuário **estiver logado**

  const handleAlterarSenha = async () => {
    setErroNova("");
    setErroConfirmar("");

    if (!senhaAtual) {
      setErroSenhaAtual("Preencha com sua senha atual!");
      return;
    }

    if (!novaSenha) {
      setErroNova("Preencha a nova senha");
      return;
    }

    if (novaSenha.length < 6) {
      setErroNova("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroConfirmar("As senhas não coincidem");
      return;
    }

    setCarregando(true);
    try {
      const user = auth.currentUser;

      // Reautentica o usuário
      const credential = EmailAuthProvider.credential(user.email, senhaAtual);
      await reauthenticateWithCredential(user, credential);

      // Atualiza a senha no Firebase Authentication
      await updatePassword(user, novaSenha);

      // Atualiza a senha também no Firestore
      const q = query(
        collection(db, "usuarios"),
        where("email", "==", user.email)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        const userRef = doc(db, "usuarios", userDoc.id);
        await updateDoc(userRef, { senha: novaSenha });

        setNotificacao({
          msg: "Senha alterada com sucesso!",
          tipo: "sucesso",
        });

        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
      } else {
        setNotificacao({
          msg: "Usuário não encontrado no banco de dados!",
          tipo: "erro",
        });
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setNotificacao({
          msg: "Senha atual incorreta!",
          tipo: "erro",
        });
      } else if (error.code === "auth/requires-recent-login") {
        setNotificacao({
          msg: "Faça login novamente para alterar sua senha.",
          tipo: "erro",
        });
      } else {
        setNotificacao({
          msg: "Erro ao alterar senha, tente novamente!",
          descricao: "Se certifique que sua senha atual está correta!",
          tipo: "erro",
        });
      }
    }finally {
      setCarregando(false);
    }
  };

  return (
    <Grid w="100%" h="100%" templateColumns="repeat(1, 6fr)">
      <GridItem w="100%" h="100">
        <MenuUsuario />
      </GridItem>
      <GridItem w="100%" h="100">
        <Flex
          w="100%"
          h="100vh"
          align="center"
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
                  w={{ base: "15%", lg: "20%" }}
                  bg="#4cb04c"
                  mb={4}
                  onClick={() => {
                    navigate("/tradutor");
                  }}
                >
                  <RiArrowLeftLine />
                </Button>
              </ToolTipContainer>
            </Flex>
            <Flex
              w={{ base: "300px", md: "350px", lg: "500px" }}
              h="70%"
              p="2rem"
              // align="center"
              justify="center"
              flexDirection="column"
              bg="#F3F5FC"
              borderRadius="25px"
              boxShadow="3px 2px 2px 4px #e8eaf3"
            >
              <Text
                fontSize="21px"
                textAlign="center"
                fontWeight="bold"
                mb="1rem"
              >
                {user ? "Alterar Senha" : "Recuperar Senha"}
              </Text>

              {/* ======= SE NÃO ESTIVER LOGADO ======= */}
              {!user && (
                <Box
                  position="relative"
                  w={{ base: "200px", md: "250px", lg: "350px" }}
                  mb="1rem"
                >
                  <Input
                    w="100%"
                    placeholder="Digite seu e-mail"
                    mb="1rem"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    borderColor={erroEmail ? "red.400" : "#DEF5DE"}
                  />
                  {erroEmail && <Text color="red.500">{erroEmail}</Text>}

                  <Button
                    w="100%"
                    bg="#6AB04C"
                    color="#fff"
                    mt="1rem"
                    onClick={handleEnviarEmail}
                  >
                    Enviar E-mail de Redefinição
                  </Button>
                </Box>
              )}

              {/* ======= SE ESTIVER LOGADO ======= */}
              {user && (
                <Box
                  position="relative"
                  w={{ base: "200px", md: "250px", lg: "350px" }}
                  mb="1rem"
                  alignSelf="center"
                >
                  <Group attached w="full" maxW="sm">
                    <Input
                      flex="1"
                      type={showSenhaAtual ? "text" : "password"}
                      placeholder="Digite senha atual"
                      w={{ base: "200px", md: "250px", lg: "350px" }}
                      padding=".5rem"
                      borderColor={erroSenhaAtual ? "red.400" : "#609ED4"}
                      borderRight="none"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                    />
                    <Button
                      borderColor={erroSenhaAtual ? "red.400" : "#609ED4"}
                      borderLeft="none"
                      bg="#F3F5FC"
                      cursor="pointer"
                      onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                    >
                      {showSenhaAtual ? (
                        <IoEyeOff size="1.4rem" color="#9b9191" />
                      ) : (
                        <IoEyeSharp size="1.4rem" color="#9b9191" />
                      )}
                    </Button>
                  </Group>
                  {erroSenhaAtual && (
                    <Text color="red.500">{erroSenhaAtual}</Text>
                  )}

                  <Group attached w="full" maxW="sm" mt="1rem">
                    <Input
                      flex="1"
                      type={showSenha ? "text" : "password"}
                      placeholder="Digite sua senha"
                      w={{ base: "200px", md: "250px", lg: "350px" }}
                      padding=".5rem"
                      borderColor={
                        erroNova || erroConfirmar ? "red.400" : "#609ED4"
                      }
                      borderRight="none"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                    />
                    <Button
                      borderColor={
                        erroNova || erroConfirmar ? "red.400" : "#609ED4"
                      }
                      borderLeft="none"
                      bg="#F3F5FC"
                      cursor="pointer"
                      onClick={() => setShowSenha(!showSenha)}
                    >
                      {showSenha ? (
                        <IoEyeOff size="1.4rem" color="#9b9191" />
                      ) : (
                        <IoEyeSharp size="1.4rem" color="#9b9191" />
                      )}
                    </Button>
                  </Group>
                  {erroNova && <Text color="red.500">{erroNova}</Text>}

                  <Group attached w="full" maxW="sm" mt="1rem">
                    <Input
                      flex="1"
                      type={showConfirmarSenha ? "text" : "password"}
                      placeholder="Confirmar nova senha"
                      w={{ base: "200px", md: "250px", lg: "350px" }}
                      padding=".5rem"
                      borderColor={erroConfirmar ? "red.400" : "#609ED4"}
                      borderRight="none"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                    <Button
                      borderColor={erroConfirmar ? "red.400" : "#609ED4"}
                      borderLeft="none"
                      bg="#F3F5FC"
                      cursor="pointer"
                      onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                    >
                      {showConfirmarSenha ? (
                        <IoEyeOff size="1.4rem" color="#9b9191" />
                      ) : (
                        <IoEyeSharp size="1.4rem" color="#9b9191" />
                      )}
                    </Button>
                  </Group>
                  {erroConfirmar && (
                    <Text color="red.500" fontSize="sm" mt="2px">
                      {erroConfirmar}
                    </Text>
                  )}

                  {carregando ? (
                    <Button
                      w={{ base: "200px", md: "250px", lg: "350px" }}
                      mt="1rem"
                      bg={"#6AB04C"}
                      color="#fff"
                      alignSelf="center"
                    >
                      <SpinnerPage cor="#fff" />
                    </Button>
                  ) : (
                    <Button
                      w="100%"
                      bg="#6AB04C"
                      color="#fff"
                      mt="1rem"
                      onClick={handleAlterarSenha}
                    >
                      Alterar Senha
                    </Button>
                  )}
                </Box>
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
              <Image w="1000px" h="100vh" src={bgFuntlibra} alt="background" />
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
