import { Box, Flex, Text, Spinner } from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

export function MenuUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

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
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="#4cb04c"
      boxShadow="sm"
      zIndex="900"
      h={{ base: "70px", md: "90px" }}
    >
      {carregando ? (
        <Spinner size="sm" color="white" />
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
          {usuario.tipo !== "aluno" && (
            <Flex
              w="100%"
              h="40%"
              bg="#FFCCCC"
              align="center"
              justify="space-between"
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
                Home
              </Text>
              <Text
                cursor="pointer"
                color="#000"
                fontWeight="bold"
                fontSize="18px"
                pl="1rem"
                onClick={UploadPage}
              >
                Novo Upload
              </Text>

              {usuario.tipo === "adm" && (
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
              )}
            </Flex>
          )}
        </>
      ) : (
        <Text fontSize="sm" color="gray.100">
          Usuário não encontrado
        </Text>
      )}
    </Box>
  );
}
