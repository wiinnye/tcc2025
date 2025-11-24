import { Flex, Spinner } from "@chakra-ui/react";
import "./services/styles/global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./page/login/Login";
import { Home } from "./page/Dashboard/Home";
import { CadastroInterprete } from "./page/CadastroInterprete/cadastroInterprete";
import { CadastroUsuario } from "./page/CadastroUsuario/cadastroUsuario";
import { RecuperarSenha } from "./page/RecuperarSenha/recuperarSenha";
import { VideoMostrar } from "./page/VideoMostrar/videoMostrar";
import { UploadVideo } from "./page/UploadVideo/UploadVideo";
import { Administrador } from "./page/Administrador/Administrador";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./services/firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { Categorias } from "./page/Categorias/Categorias";
import { QuemSomos } from "./page/QuemSomos/QuemSomos";
import { CadastroAdm } from "./page/CadastroAdm/cadastroAdm";
import { RotaPrivada } from "./page/Rotas/RotaPrivada"
import { FeedBack } from "./page/FeedBack/FeedBack";
import { MinhasNotificacoes } from "./page/MinhasNotificacoes/MinhasNotificacoes";


export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUsuario({ ...user, tipo: docSnap.data().tipo });
        } else {
          setUsuario(user); 
        }
      } else {
        setUsuario(null);
      }
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  if (carregando) {
    return (
      <Flex justify='center' align='center'>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {!usuario ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/recuperarSenha" element={<RecuperarSenha />} />
            <Route path="/cadastroUsuario" element={<CadastroUsuario />} />
            <Route path="/cadastroInterprete" element={<CadastroInterprete />} />
            <Route path="*" element={<Login />} /> {/* Redireciona inválidas para login */}
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            
            {/* Apenas ADMIN pode acessar */}
            <Route
              path="/cadastroAdministrador"
              element={
                <RotaPrivada usuario={usuario} tipoPermitido="adm">
                  <CadastroAdm />
                </RotaPrivada>
              }
            />

            {/* Demais rotas normais */}
            <Route path="/cadastroUsuario" element={<CadastroUsuario />} />
            <Route path="/cadastroInterprete" element={<CadastroInterprete />} />
            <Route path="/traducao/categoria/:categoria" element={<VideoMostrar />} />
            <Route path="/uploadVideo" element={<UploadVideo />} />
            <Route path="/recuperarSenha" element={<RecuperarSenha />} />
            <Route path="/administrador" element={<Administrador />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/quemSomos" element={<QuemSomos />} />
            <Route path="/feedback" element={<FeedBack />} />
            <Route path="/notificacoes" element={<MinhasNotificacoes />} />

            <Route path="*" element={<Home />} /> {/* fallback */}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
