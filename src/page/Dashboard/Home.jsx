import { Flex, Image} from "@chakra-ui/react";
import { MenuUsuario } from "../../components/Menu/menu";
import bannerPrincipal from "../../image/banner.png";
import { Footer } from "../../components/Footer/Footer";
import { CardCategoria } from "../../components/CardCategoria/CardCategoria";

export function Home() {

  return (
    <Flex minH="100vh" >
    <MenuUsuario />
    <Flex
      w="100%"
      direction="column"
      pt={{ base: "100px", md: "90px", lg: "100px" }}
      align='center'
    >
      {/* BANNER */}
      <Image
        src={bannerPrincipal}
        alt="Banner_FuntLibra"
        w="100%"
        fit="contain"
      />
      <CardCategoria/>
      <Footer />
    </Flex>
  </Flex>
  );
}
