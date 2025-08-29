import {
  Box,
  Flex,
  Text,
  Button,
  CloseButton,
  Drawer,
  Portal,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { RiMenuFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { SpinnerPage } from "../Spinner/Spinner";

export function MenuUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const buscarUsuario = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const docRef = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUsuario(docSnap.data());
          }
        } catch (erro) {
          console.error("Erro ao buscar usuário: ", erro);
        }
      }

      setCarregando(false);
    };

    buscarUsuario();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/"); // redireciona para a página inicial ou login
  };

  const UploadPage = () => {
    navigate("/uploadVideo");
  };

  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="#4cb04c"
      direction="column"
      boxShadow="sm"
      zIndex="900"
      h={{ base: "70px", md: "90px" }}
    >
      {carregando ? (
        <SpinnerPage />
      ) : usuario ? (
        <>
          <Flex w="100%" h="100%" justify="space-between" p={5} align="center">
            <Flex align="center" gap={3}>
              <Flex
                align="center"
                justify="center"
                bg="gray.300"
                borderRadius="full"
                w={{ sm: "32px", md: "50px", lg: "60px" }}
                h={{ sm: "32px", md: "50px", lg: "60px" }}
              >
                <FaUserCircle size="40" color="white" />
              </Flex>
              <Box textAlign="left" color="white">
                <Text
                  fontSize={{ sm: "18px", md: "24px", lg: "24px" }}
                  fontWeight="bold"
                  wrap="wrap"
                >
                  {usuario.nome || "Usuário"}
                </Text>
                <Text fontSize="md" color="#FFCCCC">
                  {usuario.tipo === "interprete"
                    ? "Intérprete"
                    : usuario.tipo === "adm"
                    ? "Administrador"
                    : "Aluno"}
                </Text>
              </Box>
            </Flex>
            <Flex justify="end" direction="column">
              <Text
                cursor="pointer"
                color="#fff"
                fontSize={{ sm: "18px", md: "24px", lg: "24px" }}
                onClick={handleLogout}
              >
                Sair da conta
              </Text>
            </Flex>
          </Flex>
          {usuario.tipo !== "aluno" &&
            (!isMobile ? (
              <Flex
                w="100%"
                h="40%"
                bg="#FFCCCC"
                align="center"
                justify="space-around"
                p="1rem"
              >
                <Text
                  cursor="pointer"
                  color="#000"
                  fontWeight="bold"
                  fontSize="18px"
                  pl="1rem"
                  onClick={() => navigate("/tradutor")}
                >
                  Início
                </Text>
                <Text
                  cursor="pointer"
                  color="#000"
                  fontWeight="bold"
                  fontSize="18px"
                  pl="1rem"
                  onClick={UploadPage}
                >
                  Novo Cadastro Vídeo
                </Text>

                {usuario.tipo === "adm" && (
                  <>
                    <Text
                      cursor="pointer"
                      color="#000"
                      fontWeight="bold"
                      fontSize="18px"
                      pl="1rem"
                      onClick={() => navigate("/administrador")}
                    >
                      Videos Pendentes
                    </Text>
                    <Text
                      cursor="pointer"
                      color="#000"
                      fontWeight="bold"
                      fontSize="18px"
                      pl="1rem"
                      onClick={() => navigate("/cadastroAdministrador")}
                    >
                      Criar Novo Administrador
                    </Text>
                  </>
                )}
              </Flex>
            ) : (
              <Flex w="100%" h="50%" bg="#FFCCCC">
                <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                  <Drawer.Trigger asChild>
                    <Button bg="#FFCCCC" size="sm">
                      <RiMenuFill />
                    </Button>
                  </Drawer.Trigger>
                  <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                      <Drawer.Content>
                        <Drawer.Body pt="3rem">
                          <Text
                            cursor="pointer"
                            color="#000"
                            fontWeight="bold"
                            fontSize="18px"
                            pl="1rem"
                            onClick={() => navigate("/tradutor")}
                          >
                            Início
                          </Text>
                          <Text
                            cursor="pointer"
                            color="#000"
                            fontWeight="bold"
                            fontSize="18px"
                            pl="1rem"
                            mt=".5rem"
                            onClick={UploadPage}
                          >
                            Novo Cadastro Vídeo
                          </Text>

                          {usuario.tipo === "adm" && (
                            <Text
                              cursor="pointer"
                              color="#000"
                              fontWeight="bold"
                              fontSize="18px"
                              pl="1rem"
                              mt=".5rem"
                              onClick={() => navigate("/administrador")}
                            >
                              Videos Pendentes
                            </Text>
                          )}
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                          <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                      </Drawer.Content>
                    </Drawer.Positioner>
                  </Portal>
                </Drawer.Root>
              </Flex>
            ))}
        </>
      ) : (
        <Flex w="100%" h="100%" justify="space-between" p={5} align="center">
          <Flex w='100%' justify="space-between">
            <Text fontSize="sm" color="gray.100">
              Usuário não encontrado
            </Text>
            <Text
              cursor="pointer"
              color="#fff"
              fontSize={{ sm: "18px", md: "24px", lg: "24px" }}
              onClick={handleLogout}
            >
              Sair da conta
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
