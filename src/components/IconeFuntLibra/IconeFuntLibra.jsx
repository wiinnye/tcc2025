import { Box, Flex, Text } from "@chakra-ui/react";

export function IconeFuntLibra() {
  return (
    <Flex 
     w={{base:"100%", lg:"10%"}}
     h={{base:"15%", lg:"100%"}}
     align="start" 
     justify="end" 
     pd="1rem"
    >
      <Box
        w={{ base: "90px", s:"90px", md: "80px", lg: "100px" }}
        h="100px"
        bg="#6ab04c"
        borderRadius="25px 25px"
        mt={{base:'2rem', lg:"2.4rem"}}
        mr="2rem"
        textAlign="center"
        direction='column'
      >
        <Text mt="1.2rem" color="#fff" fontWeight="bold" fontSize="20px">
          FUNT
        </Text>
        <Text color="#fff" fontWeight="bold" fontSize="20px">
          LIBRA
        </Text>
      </Box>
      </Flex>
  );
}
