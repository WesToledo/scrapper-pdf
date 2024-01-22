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

  const [selectedClientNumber, setSelectedClientNumber] = useState();

  const [clientNumbers, setClientNumbers] = useState([]);
  const [isLoadingClientNumbers, setIsLoadingClientNumbers] = useState(false);

  useEffect(() => {
    async function getClientNumbers() {
      setIsLoadingClientNumbers(true);
      try {
        const response = await api.get("/fatura/list-client-numbers");
        const clientNumbers = response.data.map(
          ({ clientNumber }) => clientNumber
        );

        if (clientNumbers.lenght === 0) navigate("/upload");

        setClientNumbers(clientNumbers);
        setIsLoadingClientNumbers(false);
        setSelectedClientNumber(clientNumbers[0]);
      } catch (err) {
        console.log("err", err);
        setIsLoadingClientNumbers(false);
      }
    }
    getClientNumbers();
  }, []);

  return (
    <Page>
      <Container w="100%" py={12} maxW={"100vw"} centerContent>
        <Stack spacing="6" mb={6}>
          <Stack spacing={{ base: "2", md: "3" }} textAlign="start">
            {/* <Heading fontSize="2xl">Dashboard</Heading> */}
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
            <Flex justifyContent={"center"} mb={10}>
              {!isLoadingClientNumbers ? (
                <FormControl>
                  <FormLabel fontWeight="bold" fontSize="sm">
                    Filtre por número do cliente
                  </FormLabel>
                  <Select
                    value={selectedClientNumber}
                    w={300}
                    name="client_number"
                    placeholder="Ṇº do Cliente"
                    onChange={(e) => setSelectedClientNumber(e.target.value)}
                  >
                    {clientNumbers.map((number) => {
                      return (
                        <option key={number} value={number}>
                          {number}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
              ) : (
                <Spinner />
              )}
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Page>
  );
};
