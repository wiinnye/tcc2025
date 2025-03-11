import { Flex } from "@chakra-ui/react"

export function Main({ children, ...rest }) {
  return (
    <Flex
      w= 'full'
      h= '1000px'
      fontFamily = 'heading'
      direction='column'
      { ...rest }
      >
    { children }
    </Flex >
  )
}