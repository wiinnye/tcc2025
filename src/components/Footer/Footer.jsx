import { Flex, Text, Link } from "@chakra-ui/react";

export function Footer() {
  return (
    <Flex
      bg="#6AB04C"
      color="white"
      w="100%"
      h="100%"
      mt=".1rem"
      justify="center"
      align="center"
    >
      <Flex
        direction="column"
        justify="center"
        align="center"
        px={{ base: 4, md: 12 }}
        py={6}
      >
        {/* <Flex gap={4}>
          <Link href="/quemsomos" _hover={{ textDecoration: "underline" }}>
            Quem Somos
          </Link>
          <Link href="#" _hover={{ textDecoration: "underline" }}>
            Documentação
          </Link>
          <Link href="#" _hover={{ textDecoration: "underline" }}>
            Políticas de Uso
          </Link>
        </Flex> */}
        <Text fontSize="md" mt="1rem">
          © {new Date().getFullYear()} Projeto de LIBRAS. Todos os direitos
          reservados.
        </Text>
      </Flex>
    </Flex>
  );
}
