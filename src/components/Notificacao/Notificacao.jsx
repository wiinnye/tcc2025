import { Text, Grid, GridItem } from "@chakra-ui/react";
import { useEffect } from "react";

export function Notificacao({ msg, tipo, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Define a cor com base no tipo
  const corFundo =
    tipo === "erro" ? "red.500" : tipo === "aviso" ? "yellow.500" : "green.500";

  return (
    <Grid
      h="10%"
      position="fixed"
      bottom="30px"
      right="30px"
      bg={corFundo}
      color="white"
      px={4}
      py={2}
      borderRadius="md"
      boxShadow="md"
      zIndex={9999}
      justifyItems="center"
      alignItems="center"
      textAlign="center"
      minW="250px"
    >
      <GridItem>
        <Text fontSize="18px" fontWeight="medium">
          {msg}
        </Text>
      </GridItem>
    </Grid>
  );
}
