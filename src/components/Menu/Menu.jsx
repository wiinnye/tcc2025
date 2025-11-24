import {
  Box,
  Flex,
  Text,
  Button,
  CloseButton,
  Drawer,
  Portal,
  useBreakpointValue,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { RiMenuFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { SpinnerPage } from "../Spinner/Spinner";
import { MenuLink } from "../MenuLink/MenuLink";
import { menusPorTipo } from "../../services/menu";
import { IoLogInOutline } from "react-icons/io5";
import ToolTipContainer from "../ToolTip/ToolTip";
import { useNotificacoes } from "../../hooks/useNotificacoes";
import { FaBell } from "react-icons/fa6";

export default function MenuUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const menus = menusPorTipo[usuario?.tipo] || [];

  const { contador } = useNotificacoes();

  const tiposAutorizados = ["interprete", "adm", "aluno"];

  const capitalizeName = (name) => {
    if (!name) return "";

    const lowerName = name.toLowerCase();
    const capitalizedWords = lowerName.split(" ").map((word) => {
      if (word.length === 0) return "";
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalizedWords.join(" ");
  };

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
    navigate("/");
  };

  const handleNotificacaoClick = () => {
    navigate("/notificacoes");
  };

  return (
    <Flex w="100%" h="100%" bg="#4cb04c" direction="column" boxShadow="sm">
      {carregando && <SpinnerPage />}

      {!carregando && usuario && (
        <Flex w="100%" h="100%" justify="space-between" p={3} align="center">
          <Flex align="center" gap={3}>
            <Box textAlign="left" color="white" ml="1.5rem">
              <Text
                fontSize={{ sm: "18px", md: "24px", lg: "24px" }}
                fontWeight="bold"
              >
                {capitalizeName(usuario?.nome) || "Usuário"}
              </Text>
              <Text fontSize="md" color="#cecece">
                {capitalizeName(usuario?.tipo) || "Usuário"}
              </Text>
            </Box>
          </Flex>

          <Flex align="center" gap={2}>
            {tiposAutorizados.includes(usuario?.tipo) && (
              <ToolTipContainer
                descricao={
                  contador > 0
                    ? (contador >= 2 ? "novas notificações" : "nova notificação")
                    : "Nenhuma nova notificação"
                }
              >
                <Button
                  cursor="pointer"
                  color="white"
                  bg="#4cb04c"
                  onClick={handleNotificacaoClick}
                  p={0}
                  _hover={{ bg: "#3a8c3a" }}
                  position="relative"
                >
                  <Icon as={FaBell} w={7} h={7} />

                  {contador > 0 && (
                    <Badge
                      bg="#d61212"
                      color="#fff"
                      borderRadius="full"
                      px={2}
                      py={1}
                      fontSize="0.7em"
                      position="absolute"
                      top="-8px"
                      right="-6px"
                      minWidth="20px"
                      textAlign="center"
                      border="2px solid #4cb04c"
                    >
                      {contador}
                    </Badge>
                  )}
                </Button>
              </ToolTipContainer>
            )}

            <ToolTipContainer descricao="sair da conta">
              <Button
                cursor="pointer"
                color="#fff"
                pr="1.5rem"
                bg="#4cb04c"
                onClick={handleLogout}
              >
                <Icon as={IoLogInOutline} w={10} h={10} />
              </Button>
            </ToolTipContainer>
          </Flex>
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
        <Flex w="100%" h="100%" bg="#FFCCCC" align="center">
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
        <Flex w="100%" h="100%" justify="space-between" p={4} align="center">
          <Flex w="100%" justify="space-between">
            <Text fontSize="sm" color="gray.100">
              Usuário não encontrado
            </Text>
            <Button cursor="pointer" color="#fff" onClick={handleLogout}>
              <IoLogInOutline />
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
