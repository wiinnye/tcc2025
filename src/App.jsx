import { Flex } from "@chakra-ui/react"
import {BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./page/login/Login"
import './styles/global.css'


export default function App() {
  return (
    <Flex className="containerMain">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login />} />
          </Routes>
        </BrowserRouter>
    </Flex>
  )
}