import { Box, Flex, Text, Link } from "@chakra-ui/react";

export function Footer() {
    return (
    <Box bg="#6AB04C" color="white" w="100%" mt='.1rem'>
      <Flex
        direction='column'
        justify="center"
        align="center"
        px={{ base: 4, md: 12 }}
        py={6}
      >

        <Flex gap={4}>
          <Link href="#" _hover={{ textDecoration: "underline" }}>
            Quem Somos
          </Link>
          <Link href="#" _hover={{ textDecoration: "underline" }}>
            Documentação
          </Link>
          <Link href="#" _hover={{ textDecoration: "underline" }}>
            Políticas de Uso
          </Link>
        </Flex>
        <Text fontSize="md" mt='1rem'>
          © {new Date().getFullYear()} Projeto de LIBRAS. Todos os direitos reservados.
        </Text>
      </Flex>
    </Box>
  );
}