import './App.css'
import { Login } from './page/login/Login';
import { Flex } from '@chakra-ui/react';
import Home from './page/Dashboard/Home';
import { Route, Routes } from 'react-router-dom';

export default function App() {

  return (
    <>
      <Flex className="App">
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </Flex>
    </>
  )

}