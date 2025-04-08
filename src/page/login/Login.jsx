import { Button, Flex, Input, Span, Text } from "@chakra-ui/react";
import './style.css'; 

export function Login(){

    return(
        <Flex 
        w="100%" 
        h='100vh'
        alignItems={"center"} 
        alignContent={"center"}
        flexDirection='column'
        >
            <Text fontSize="58px" >FuntLibra</Text>
            <Flex 
            w={{base:"300px",s:"150px", md:"350px", lg:"500px"}}
            h={{base:"300px",s:"150px", md:"300px", lg:"500px"}}
            alignItems={"center"} 
            alignContent={"center"} 
            justify={'center'}
            flexDirection='column'
            bg={"#6ab04c"}
            borderRadius={"25px"}
            >
                <Input w={{base:"200px",md:"250px", lg:"250px"}} mb='1rem' placeholder="Email"/>
                <Button w={{base:"200px",md:"250px", lg:"250px"}}  mb='1rem' bg={"rgb(217, 235, 152)"} color="#000">Logar</Button>
                <Text mt='2rem'>Não tem cadastro? <Span color="rgb(217, 235, 152)">cadastre aqui</Span></Text>
            </Flex>     
        </Flex>
    )
        
}