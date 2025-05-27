import { Flex } from "@chakra-ui/react";
import "./styles/global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./page/login/Login";
import { Home } from "./page/Dashboard/Home";
import { CadastroInterprete } from "./page/CadastroInterprete/cadastroInterprete";
import { CadastroUsuario } from "./page/CadastroUsuario/cadastroUsuario";
import { RecuperarSenha } from "./page/RecuperarSenha/recuperarSenha";
import { VideoMostrar } from "./page/VideoMostrar/videoMostrar";
import { UploadVideo } from "./page/UploadVideo/UploadVideo";

export default function App() {
  return (
    <Flex className="containerMain">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/traducao" element={<Home />} />
          <Route path="/cadastroUsuario" element={<CadastroUsuario />} />
          <Route path="/cadastroInterprete" element={<CadastroInterprete />} />
          <Route path="/uploadVideo" element={<UploadVideo />} />
          <Route path="/recuperarSenha" element={<RecuperarSenha />} />
          <Route path="/traducao/:texto" element={<VideoMostrar />} />
        </Routes>
      </BrowserRouter>
    </Flex>
  );
}
