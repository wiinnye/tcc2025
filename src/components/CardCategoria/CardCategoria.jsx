import { Box, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import cardCategoriaImg from "../../image/cardCategoriaImg.png";

export function CardCategoria() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/categorias");
  };

  return (
    <Flex w="100%" bg="#6AB04C" align='center'>
      <Box
        w="100%"
        h="300px"
        backgroundImage={`url(${cardCategoriaImg})`}
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        cursor="pointer"
        mt="1rem"
        mb="1rem"
        _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
        onClick={handleClick}
      ></Box>
    </Flex>
  );
}
