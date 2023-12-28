import { ThemeConfig, extendTheme } from "@chakra-ui/react";

import { foundations } from "./foundations";

const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: "light",
  cssVarPrefix: "chakra",
};

export const theme = extendTheme({
  ...foundations,
  config,
  styles: {
    global: () => ({
      body: {
        bg: "#fff",
      },
    }),
  },
});

export type Theme = typeof theme;
