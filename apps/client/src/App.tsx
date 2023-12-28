import * as React from "react";

import { ChakraBaseProvider } from "@chakra-ui/react";
import { theme } from "./theme";
import Routes from "./routes";

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <Routes />
    </ChakraBaseProvider>
  );
}

export default App;
