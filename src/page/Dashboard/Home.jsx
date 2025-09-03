import { Flex, Grid, GridItem, Image } from "@chakra-ui/react";
import { MenuUsuario } from "../../components/Menu/menu";
import bannerPrincipal from "../../image/banner.png";
import { Footer } from "../../components/Footer/Footer";
import { CardCategoria } from "../../components/CardCategoria/CardCategoria";

export function Home() {
  return (
    <Grid
      w="100%"
      h="100%"
      // minH="100vh"
      // pt={{ base: "70px", md: "150px" }}
      templateColumns="repeat(1, 3fr)"
      gap={3}
    >
      <GridItem w="100%" h="100">
        <MenuUsuario />
      </GridItem>
      <GridItem w="100%" h="100" mt='1.5rem'>
        <Flex w="100%" direction="column" align="center">
          {/* BANNER */}
          <Image
            src={bannerPrincipal}
            alt="Banner_FuntLibra"
            w="100%"
            fit="contain"
          />
        </Flex>
        <CardCategoria />
        <Footer />
      </GridItem>

    </Grid>
  );
}
