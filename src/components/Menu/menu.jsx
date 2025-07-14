import { Box, Flex, Text, Spinner, Button } from "@chakra-ui/react";
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

  return (
<Box
  position="fixed"
  top={0}
  left={0}
  right={0}
  bg="#6AB04C"
  boxShadow="sm"
  zIndex="1000"
  h={{ base: "70px", md: "90px" }} // ← Altura clara!
>
  <Flex
    w="100%"
    h="100%"
    justify="space-between"
    align="center"
    px={5}
  >
        {carregando ? (
          <Spinner size="sm" color="white" />
        ) : usuario ? (
          <>
          <Flex align="center" gap={3}>
            <Flex
              align="center"
              justify="center"
              bg="gray.300"
              borderRadius="full"
              w={{sm:"32px", md:"50px", lg:"60px"}}
              h={{sm:"32px", md:"50px", lg:"60px"}}
            >
              <FaUserCircle size='40' color="white" />
            </Flex>
            <Box textAlign="left" color="white">
              <Text fontSize={{sm:"18px", md:"24px", lg:"24px"}} fontWeight="bold" wrap='wrap' >
                {usuario.nome || "Usuário"}
              </Text>
              <Text fontSize="md" color='#FFCCCC'>
                {usuario.tipo === "interprete" ? "Intérprete" : "Aluno"}
              </Text>
            </Box>
        </Flex>
          <Flex justify='end' direction='column'>     
            <Button size="50px"  bg="#6AB04C" fontSize={{sm:"18px", md:"24px", lg:"24px"}} onClick={handleLogout}>
                Sair da conta
            </Button>
          </Flex>
        </>
        ) : (
          <Text fontSize="sm" color="gray.100">
            Usuário não encontrado
          </Text>
        )}
      </Flex>
      
    </Box>
  );
}
