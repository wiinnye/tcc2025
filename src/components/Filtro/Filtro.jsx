import { Input } from "@chakra-ui/react";

export default function Filtro({ placeholder, busca, setBusca }) {
    return (
        <Input
            placeholder={placeholder}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            w={{ base: "50%", md: "30%" }}
            display="block"
            p='.5rem'
        />
    );
};