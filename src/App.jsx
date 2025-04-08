import { Flex } from "@chakra-ui/react"
import './styles/global.css'
import {BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./page/login/Login"
import { Home } from "./page/Dashboard/Home"


export default function App() {
  return (
    <Flex className="containerMain">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element={<Home />} />
          </Routes>
        </BrowserRouter>
    </Flex>
  )
}