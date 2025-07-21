// Notificacao.jsx
import { Box, Text, Flex } from "@chakra-ui/react";

export function Notificacao({ mensagem, onClose }) {
  return (
    <Flex
      w='250px'
      position="fixed"
      bottom="20px"
      right="20px"
      bg="green.500"
      color="white"
      px={4}
      py={2}
      borderRadius="md"
      boxShadow="md"
      zIndex={9999}
      justify='space-between'
    >
      <Text fontSize='20px'>{mensagem}</Text>
      <Box
        ml={4}
        as="button"
        onClick={onClose}
        fontWeight="bold"
      >
        X
      </Box>
    </Flex>
  );
}
