import { Box, Flex, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import MenuUsuario from "../../components/Menu/Menu";
import { useEffect, useState } from "react";
import { SpinnerPage } from "../../components/Spinner/Spinner";
import Footer  from "../../components/Footer/Footer";
import rostoQuem1 from "../../image/rostoQuemos (1).png";
import rostoQuem2 from "../../image/rostoQuemos (2).png";
import rostoQuem3 from "../../image/rostoQuemos (3).png";

export function QuemSomos() {
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCarregando(false);
    }, 1000); // 1 segundo

    return () => clearTimeout(timer);
  }, []);

  return (
      <Grid 
      w="100%"
      h="100%"
      templateColumns="repeat(1, 5fr)"
      gap={2}
      >
        <GridItem w="100%" h="100">
          <MenuUsuario />
        </GridItem>
        <GridItem w="100%" h="100" mt='1.9rem'>
          <Flex
            w="100%"
            h='100%'
            direction={{ base: "column-reverse", lg: "row" }}
            justify="center"
            align="center"
          >
            {carregando ? (
              <SpinnerPage />
            ) : (
              <Flex
                w="100%"
                minH="100vh"
                justify="center"
                align="center"
                gap="1rem"
                mt="2rem"
                wrap="wrap"
              >
                <Grid
                  w="100%"
                  h="100%"
                  p="10px"
                  templateColumns="repeat(1, 5fr)"
                  gap={3}
                >
                  <GridItem w="100%" h="100" border="1px solid #4cb04c"  p="10px">
                    <Flex align="center">
                      <Box p="1rem">
                        <Text color="#000" fontSize="28px" textAlign="center">
                          Como surgiu o FuntLibra?
                        </Text>
                        <Text>
                          Lorem ipsum dolor, sit amet consectetur adipisicing
                          elit. Perspiciatis aut ipsam molestiae deleniti officiis
                          aperiam laboriosam similique amet nobis, quas distinctio
                          ipsum, facere eum error laborum dolor suscipit accusamus
                          quo?
                        </Text>
                      </Box>
                    </Flex>
                  </GridItem>
                  <GridItem w="100%" h="100" border="1px solid #4cb04c" p="10px">
                    <Flex align="center">
                      <Image src={rostoQuem2} w="200px" />
                      <Box p="1rem">
                        <Text color="#000" fontSize="28px">
                          Eryka
                        </Text>
                        <Text>
                          Lorem ipsum dolor, sit amet consectetur adipisicing
                          elit. Perspiciatis aut ipsam molestiae deleniti officiis
                          aperiam laboriosam similique amet nobis, quas distinctio
                          ipsum, facere eum error laborum dolor suscipit accusamus
                          quo?
                        </Text>
                      </Box>
                    </Flex>
                  </GridItem>
                  <GridItem w="100%" h="100"border="1px solid #4cb04c">
                    <Flex align="center">
                      <Box p="1rem">
                        <Text color="#000" fontSize="28px">
                          Ana Paula
                        </Text>
                        <Text>
                          Lorem ip sum dolor sit amet, consectetur adipisicing
                          elit. Ratione voluptatibus praesentium suscipit
                          consequuntur voluptates maiores assumenda recusandae
                          laboriosam, asperiores, vero minima ad similique. Minima
                          exercitationem sapiente quo. Asperiores, maiores ea?
                        </Text>
                      </Box>
                      <Image src={rostoQuem3} w="200px" />
                    </Flex>
                  </GridItem>
                  <GridItem w="100%" h="100" border="1px solid #4cb04c">
                    <Flex align="center">
                      <Image src={rostoQuem1} w="200px" />
                      <Box p="1rem">
                        <Text color="#000" fontSize="28px">
                          Winnye
                        </Text>
                        <Text>
                          Lorem ipsum dolor sit, amet consectetur adipisicing
                          elit. Exercitationem temporibus voluptates laudantium,
                          maiores nihil ratione sed autem consequatur velit
                          officiis nesciunt ad esse quas ex. Facere, numquam.
                          Fuga, obcaecati iste!
                        </Text>
                      </Box>
                    </Flex>
                  </GridItem>
                </Grid>
              </Flex>
            )}
          </Flex>
        </GridItem>
        <Footer />
      </Grid>
  );
}
