import { Flex, Spinner } from "@chakra-ui/react";

export function SpinnerPage() {
  return (
    <Flex w="100%" h="100vh" justify={"center"} align="center">
      <Spinner size="lg" color="#6AB04C" />
    </Flex>
  );
}
