import {
  Box,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Card,
  Button,
  Center,
} from "@chakra-ui/react";
import { Page } from "../components/Page";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { api } from "../shared/api";
import { useNavigate } from "react-router-dom";

interface InfoCardProps {
  value: string;
  type: string;
  footer: string;
}

export const DownloadPage = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <Container w="100%" py={12} maxW={"100vw"} centerContent>
        <Stack spacing="6" mb={6}>
          <Stack spacing={{ base: "2", md: "3" }} textAlign="start">
            <Heading fontSize="2xl">Dashboard</Heading>
          </Stack>
        </Stack>
        <Flex width="100%" justifyContent="space-around" alignItems="center">
          <Box
            w={"40vw"}
            boxShadow="2xl"
            borderRadius={{ base: "none", sm: "xl" }}
            height={"100%"}
            p={10}
          >
            <Flex justifyContent={"center"} alignItems="center">
              <FormControl>
                <FormLabel fontWeight="bold" fontSize="sm">
                  Filtre por número do cliente
                </FormLabel>
                <Select
                  w={300}
                  name="client_number"
                  placeholder="Ṇº do Cliente"
                >
                  <option key={"number"} value={"number"}>
                    number
                  </option>
                </Select>
              </FormControl>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Page>
  );
};
