import { Flex } from "@chakra-ui/react";
import "./services/styles/global.css"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./page/login/Login";
import { Home } from "./page/Dashboard/Home";
import { CadastroInterprete } from "./page/CadastroInterprete/cadastroInterprete";
import { CadastroUsuario } from "./page/CadastroUsuario/cadastroUsuario";
import { RecuperarSenha } from "./page/RecuperarSenha/recuperarSenha";
import { VideoMostrar } from "./page/VideoMostrar/videoMostrar";
import { UploadVideo } from "./page/UploadVideo/UploadVideo";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase"; // ajuste o caminho se for diferente

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);
  if (carregando) {
    return <p>Carregando...</p>;
  }

  return (
    <Flex className="containerMain">
      <BrowserRouter>
        <Routes>
          {!usuario ? (
            <>
              <Route path="/" element={<Login />} />
              <Route path="/recuperarSenha" element={<RecuperarSenha />} />
              {/* Redireciona qualquer rota inválida para login */}
              <Route path="*" element={<Login />} />
              <Route path="/cadastroUsuario" element={<CadastroUsuario />} />
              <Route path="/cadastroInterprete" element={<CadastroInterprete />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/traducao" element={<Home />} />
              <Route path="/traducao/categoria/:categoria" element={<VideoMostrar />} />
              <Route path="/uploadVideo" element={<UploadVideo />} />
              <Route path="/recuperarSenha" element={<RecuperarSenha />} />
              {/* Se não encontrar rota, leva para dashboard */}
              <Route path="*" element={<Home />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </Flex>
  );
}
