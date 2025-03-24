import { Button, Flex, Input, Text } from "@chakra-ui/react";
import './style.css'; 

export function Login(){

    return(
        <Flex className="Container">
            <Flex w="50%" alignItems={"center"} alignContent={"center"} flexDirection='column'>
                <Input placeholder="Email"/>
                <Button>Logar</Button>
                <Text>Não tem cadastro? cadastre aqui</Text>
            </Flex>     
        </Flex>
    )
        
}