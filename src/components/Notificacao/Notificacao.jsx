// Notificacao.jsx
import { Text,Grid, GridItem } from "@chakra-ui/react";
import { useEffect } from "react";

export function Notificacao({ mensagem, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000); 

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Grid
      h="10%"
      position="fixed"
      bottom="30px"
      right="30px"
      bg="green.500"
      color="white"
      px={4}
      py={2}
      borderRadius="md"
      boxShadow="md"
      zIndex={9999}
      justifyItems="center"
      alignItems='center'
    >
      <GridItem >
      <Text fontSize="20px" >{mensagem}</Text>
      </GridItem>
    </Grid>
  );
}
