import {ChakraProvider, Button} from "@chakra-ui/react";

function App() {
  return (
   <>
   <ChakraProvider>
     <Button colorScheme="teal">Hello</Button>
   </ChakraProvider>
   </>
  );
}

export default App;
