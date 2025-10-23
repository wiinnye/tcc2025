import { Button, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import FeedbackAluno from "../../components/FeedBackAluno/FeedBackAluno";
import FeedbackAdmin from "../../components/FeedBackInterprete&Adm/FeedBackInterprete&Adm";
import MenuUsuario  from "../../components/Menu/Menu";
import Footer from "../../components/Footer/Footer";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { RiArrowLeftLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ToolTipContainer from "../../components/ToolTip/ToolTip";

export function FeedBack() {
  const [carregando, setCarregando] = useState(false);
  const [usuario, setUsuario] = useState(null);
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

  return (
    <Grid w="100%" minH="100vh" templateColumns="repeat(1, 3fr)">
      <GridItem w="100%" h={{ lg: "50%" }}>
        <MenuUsuario />
      </GridItem>
      <GridItem w="100%">
        <Flex w="100%" direction="column" justify="center" p="2rem">
          <ToolTipContainer descricao="voltar pagina">
            <Button
              w={{ base: "15%", lg: "10%" }}
              bg="#4cb04c"
              mb={4}
              onClick={() => {
                navigate("/traducao");
              }}
            >
              <RiArrowLeftLine />
            </Button>
          </ToolTipContainer>

          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            textAlign="center"
          >
            {usuario?.tipo === "aluno"
              ? "Faça um FeedBack"
              : "Confira o FeedBacks"}
          </Text>
        </Flex>
      </GridItem>
      <GridItem w="100%" h="100%">
        {!carregando && usuario?.tipo === "aluno" ? (
          <FeedbackAluno />
        ) : (
          <FeedbackAdmin />
        )}
      </GridItem>
      <GridItem w="100%" h={{ base: "100%", lg: "100%" }}>
        <Footer />
      </GridItem>
    </Grid>
  );
}
