import { Flex, Grid, GridItem, Image } from "@chakra-ui/react";
import { MenuUsuario } from "../../components/Menu/menu";
import bannerPrincipal from "../../image/bannerMenor.png";
import { Footer } from "../../components/Footer/Footer";
import { CardCategoria } from "../../components/CardCategoria/CardCategoria";

export function Home() {
  return (
    <Grid
      w="100%"
      minH="100vh"
      templateColumns="repeat(1, 4fr)"
    >
      <GridItem w="100%" h={{lg:"auto"}}>
        <MenuUsuario />
      </GridItem>
      <GridItem w="100%" h={{lg:"300px"}}>
        <CardCategoria />
      </GridItem>
      <GridItem w="100%" h="25%" >
        <Flex w="100%" direction="column" align="center">
          {/* BANNER */}
          <Image
            src={bannerPrincipal}
            alt="Banner_FuntLibra"
            w="100%"
            fit="contain"
          />
        </Flex>
      </GridItem>
      <GridItem  w="100%" h={{base:"100%", lg:"auto"}}>
        <Footer />
      </GridItem>
    </Grid>
  );
}
