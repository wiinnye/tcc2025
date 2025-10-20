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
import { MenuLink } from "../MenuLink/MenuLink";
import { menusPorTipo } from "../../services/menu";

export function MenuUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const menus = menusPorTipo[usuario?.tipo] || [];

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
    <Flex
      w="100%"
      h="100%"
      bg="#4cb04c"
      direction="column"
      boxShadow="sm"
    >
      {carregando && <SpinnerPage />}

      {!carregando && usuario && (
        <Flex w="100%" h="100%" justify="space-between" p={3} align="center">
          <Flex align="center" gap={3}>
            <Flex
              align="center"
              justify="center"
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
              >
                {usuario?.nome || "Usuário"}
              </Text>
              <Text fontSize="md" color="#cecece">
                {usuario?.tipo || ""}
              </Text>
            </Box>
          </Flex>
          <Text
            cursor="pointer"
            color="#fff"
            fontSize={{ sm: "18px", md: "24px", lg: "24px" }}
            onClick={handleLogout}
          >
            Sair da conta
          </Text>
        </Flex>
      )}

      {menus.length > 0 && !isMobile && (
        <Flex
          w="100%"
          bg="#FFCCCC"
          align="center"
          textAlign="center"
          justify="space-around"
          p="1rem"
        >
          {menus.map((m, i) => (
            <MenuLink
              key={i}
              label={m.label}
              onClick={() => m.rota && navigate(m.rota)}
            />
          ))}
        </Flex>
      )}

      {menus.length > 0 && isMobile && (
        <Flex w="100%" h="100%" bg="#FFCCCC" align='center'>
          <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Drawer.Trigger asChild>
              <Button bg="#FFCCCC" size="lg">
                <RiMenuFill />
              </Button>
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content>
                  <Drawer.Body pt="3rem">
                    {menus.map((m, i) => (
                      <MenuLink
                        key={i}
                        label={m.label}
                        onClick={() => m.rota && navigate(m.rota)}
                      />
                    ))}
                  </Drawer.Body>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        </Flex>
      )}

      {!carregando && !usuario && (
        <Flex w="100%" h="100%" justify="space-between" p={5} align="center">
          <Flex w="100%" justify="space-between">
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
