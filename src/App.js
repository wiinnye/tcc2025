import { ChakraProvider, createSystem, defineConfig, Flex } from "@chakra-ui/react"
import {BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./page/login/Login"
import './App.css'

const config = defineConfig({
  theme: {
    tokens: {
      colors: {},
    },
  },
})

const system = createSystem(config)

export default function App() {
  return (
    <ChakraProvider value={system}>
     {/* <Flex className="App"> */}
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login />} />
          </Routes>
        </BrowserRouter>
      {/* </Flex> */}
    </ChakraProvider>
  )
}