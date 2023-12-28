import { Box, Container, Heading, Stack } from "@chakra-ui/react";
import Navbar from "./Navbar";

export const Page = ({ children }) => {
  return <Navbar>{children}</Navbar>;
};
