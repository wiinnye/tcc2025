import {
  Button,
  CloseButton,
  Drawer,
  Flex,
  Image,
  Portal,
  useBreakpointValue,
} from "@chakra-ui/react";
import { AiOutlineBars } from "react-icons/ai";
import { Link } from "react-router-dom";

export function Menu({children,...rest}) {
  const isMobile = useBreakpointValue({
    base: false,
    s: true,
    md: true,
    lg: true
  });
  return (
    <Flex w="100%">
      {isMobile ? (
        <Flex
          w="100%"
          align='center'
          justifyItems={'space-around'}
          h={{ base: "90px", s: "100px", md: "100px", lg: "100px" }}
          bg="#6ab04c"
        >
          <Image></Image>
          <Link to="/" style={{color:"#fff", fontSize:"20px", marginLeft:'1rem'}}>
              Home
          </Link>
          <Link to="/informacao" style={{color:"#fff", fontSize:"20px", marginLeft:'2rem'}}>
              Informação
          </Link>
        </Flex>
      ) : (
        <Flex
          w="100%"
          align='center'
          h={{ base: "100px", s: "160px", md: "160px", lg: "160px" }}
          bg="#6ab04c"
        >
          <Drawer.Root>
            <Drawer.Trigger asChild>
              <Button variant="outline" size="lg" ml='1rem'>
                <AiOutlineBars/>
              </Button>
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content>
                  <Drawer.Context>
                    {(store) => (
                      <Drawer.Body pt="10" spaceY="5">
                        <Flex direction='column' m={4}>
                        <Image></Image>
                        <Link to="/">
                            Home
                        </Link>
                        <Link to="/informacao">
                            Informações
                        </Link> 
                        </Flex>
                     
                      </Drawer.Body>
                    )}
                  </Drawer.Context>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        </Flex>
      )}
    </Flex>
  );
}