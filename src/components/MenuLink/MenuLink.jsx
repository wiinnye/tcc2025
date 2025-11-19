import { Text } from "@chakra-ui/react";

export function MenuLink({ label, onClick }) {
  return (
    <Text
      cursor="pointer"
      color="#000"
      fontWeight="bold"
      fontSize="18px"
      pl="1rem"
      mt={{ base: "1rem", md: "0" }}
      onClick={onClick}
    >
      {label}
    </Text>
  );
}
