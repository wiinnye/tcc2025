import { Flex } from "@chakra-ui/react"
import './styles/global.css'
import {BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./page/login/Login"
import { Home } from "./page/Dashboard/Home"
import { CadastroUsuario } from "./page/CadastroUsuario/cadastroUsuario"
import {RecuperarSenha} from "./page/RecuperarSenha/recuperarSenha"



export default function App() {
  return (
    <Flex className="containerMain">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element={<Home />} />
             <Route path='/cadastroUsuario' element={<CadastroUsuario />} />
             <Route path='/recuperarSenha' element={<RecuperarSenha />} />
          </Routes>
        </BrowserRouter>
    </Flex>
  )
}