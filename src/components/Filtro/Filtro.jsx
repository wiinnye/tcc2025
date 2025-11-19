import { Input } from "@chakra-ui/react";


export default function Filtro({ busca, setBusca, placeholder }) {

  return (
    <Input
      placeholder={placeholder}
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
      w={{ base: "50%", md: "30%" }}
      display="block"
    />
  );
}
