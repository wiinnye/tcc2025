import { Flex, Spinner } from "@chakra-ui/react";

export function SpinnerPage({cor}) {
  return (
    <Flex w="100%" h="100vh" justify={"center"} align="center">
      <Spinner size="lg" color={cor || "#6AB04C"} />
    </Flex>
  );
}
