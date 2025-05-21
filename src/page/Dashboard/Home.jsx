import {
  Flex,
  Input,
} from "@chakra-ui/react";

import { Menu } from "../../components/Menu/menu";
import { useState } from "react";
import { SpeechButton } from "../../components/Button/SpeechButton";
import { VideoList } from "../../components/VideoLista/video";

export function Home() {

  let [valor, setValor] = useState('');
  const [mostraValor, setMostraValor] = useState('');
  const [text, setText] = useState('');


const handleButtonClick = () => {
  if (valor.trim() !== '') {
    setMostraValor(valor);
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
          w={{base:'250px', s:'450px', md:'450px', lg:'450px'}}
          h='50px'
          p='.7rem' 
          bg='#fff' 
          borderColor='#000'
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          />
        <SpeechButton
          text={text}
          setText={setText}
          mostraValor={mostraValor}
          setMostraValor={setMostraValor}
          setValor={setValor}
          handleButtonClick={handleButtonClick}
        />

      <VideoList busca={mostraValor} />

        </Flex>
       
     </Flex>
    </Flex>
  );
}


