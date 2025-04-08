import {
  Button,
  Flex,
  Input,
  Textarea,
} from "@chakra-ui/react";

import { Menu } from "../../components/Menu/menu";
import { useState } from "react";
import VLibrasPlugin from "../../components/VlibrasPlugin/Vlibras";

export function Home() {

  const [valor, setValor] = useState('');
  const [mostraValor, setMostraValor] = useState('');
  

  const handleButtonClick = () => {
    if (valor.trim() !== '') { 
      setMostraValor(valor);

// Força o VLibras a detectar o novo texto
setTimeout(() => {
  const el = document.querySelector('[aria-label="libras-texto"]');
  if (el) {
    const event = new Event('input', { bubbles: true });
    el.dispatchEvent(event);
  }
}, 300); // espera um pouco para o texto renderizar
    } else {
      alert('O campo de input não pode estar vazio!');
    }
  };

  return (
    <Flex w="100%" direction='column'>
     <Menu />
     <Flex 
     w='100%'
     p='1rem'
     align='center'
     justify='space-around'

     > 
        <Flex w='100%' direction='column' align='center'>
          <Input 
          w='70%'
          h='100px'
          bg='#fff' 
          borderColor='#000'
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          />
          <Button 
          w='70%' 
          mt='1rem'
          onClick={handleButtonClick}
          >Traduzir</Button>
        </Flex>
        <Flex w='100%' direction='column'>
          <Textarea 
          w='100%' 
          h='200px'
          bg='#fff' 
          value={mostraValor}
          readOnly
          aria-label="libras-texto"
          />
        </Flex>
     </Flex>
     <VLibrasPlugin />
    </Flex>
  );
}
