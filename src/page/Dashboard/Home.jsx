import { Button, Flex, Image, Stack, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import mensagem from "../../image/mensagem.png"
import { useNavigate } from "react-router-dom";

export function Home() {
  let [valor, setValor] = useState("");
  const navigate = useNavigate();

const handleButtonClick = () => {
  if (valor.trim() !== "") {
    navigate(`/traducao/${encodeURIComponent(valor)}`);
  } else {
    alert("O campo de input não pode estar vazio!");
  }
};

  const handleDelete = () => {
    if(!valor.trim() !== ""){
      setValor("");
    }
  }

  return (
    <Flex h='100vh' direction="row" justifyItems='center' alignItens='center'>
        <Flex w="100%" h='80%' direction="column" justify='center' align='center'>
          <Textarea
            w={{ base: "250px", s: "450px", md: "450px", lg: "450px" }}
            minH="250px"
            placeholder="Digite o Texto"
            color="#6AB04C"
            bg="F3F5FC"
            p=".7rem"
            borderColor="#6AB04C"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
           
          <Stack direction="row" spacing={4} justify="center" mt='4rem'>
            <Button
              w={{ base: "120px", s: "200px", md: "200px", lg: "200px" }}
              bg="#6ab04c"
              borderRadius='15px'
              padding='24px'
              onClick={handleButtonClick}
            >
              Traduzir Texto
            </Button>
            <Button
              w={{ base: "120px", s: "200px", md: "200px", lg: "200px" }}
              borderColor="#6ab04c"
              bg="#F3F5FC"
              color="#6ab04c"
              borderRadius='15px'
              padding='24px'
              onClick={handleDelete}
            >
              Apagar
            </Button>
          </Stack>
        </Flex>
        <Flex w="50%" justify='center' align='center'>
            <Flex 
            w={{ base: "200px", md: "250px", lg: "300px" }}
            h={{ base: "200px", md: "250px", lg: "550px" }}
            bg='#6AB04C'
            borderRadius='25px 25px'
            direction='column'
            justify='center'
            align='center'
            >
              <Image 
              src={mensagem} 
              alt="mensagem nao encontrada"
              w='200px'
              h='204px'></Image>
              <Text fontSize='23px' color='#fff' textAlign='center' mt='1rem' fontWeight='bold' >Nenhuma mensagem encontrada</Text>
              <Text fontSize='18px' mt='1rem' textAlign='center' color='#495057'> Digite um texto que você deseja traduzir</Text>
            </Flex>   
        </Flex>
    </Flex>
  );
}
