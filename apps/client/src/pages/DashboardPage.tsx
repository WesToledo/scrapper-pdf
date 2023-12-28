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

export const Dashboard = () => {
  const navigate = useNavigate();
  const [clientNumbers, setClientNumbers] = useState([]);
  const [isLoadingClientNumbers, setIsLoadingClientNumbers] = useState(false);
  const [selectedClientNumber, setSelectedClientNumber] = useState();

  const [KWHChartData, setKWHChartData] = useState({
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        label: "My Second dataset",
        data: [28, 48, 40, 19, 86, 27, 90],
      },
    ],
  });

  const [KWHChartOptions, setKWHChartOptions] = useState({
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          // fontColor: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          // color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          // color: textColorSecondary,
        },
        grid: {
          // color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  });
  const [moneyChartData, setMoneyChartData] = useState({
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        label: "My Second dataset",
        data: [28, 48, 40, 19, 86, 27, 90],
      },
    ],
  });

  const [moneyChartOptions, setMoneyChartOptions] = useState({
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          // fontColor: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          // color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          // color: textColorSecondary,
        },
        grid: {
          // color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  });

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

  useEffect(() => {
    console.log("selected", selectedClientNumber);

    async function getGraphData() {
      try {
        const response = await api.get(
          "/fatura/list-by-month/" + selectedClientNumber
        );
        console.log("response.data", response.data);
      } catch (err) {
        console.log("err", err);
      }
    }
    getGraphData();
  }, [selectedClientNumber]);

  const InfoCard = ({ value, type, footer }: InfoCardProps) => {
    return (
      <Card pt={0} px={5}>
        <CardBody justifyContent="center" alignItems="center">
          {/* <Flex direction="column" spacing={1}> */}
          <Text as="span" fontSize="xxx-large" fontWeight="bold">
            {value}
          </Text>
          <Text as="span" fontSize="larger" fontWeight="bold">
            {type}
          </Text>

          <Flex justifyContent="center">
            <Text>{footer}</Text>
          </Flex>
        </CardBody>
      </Card>
    );
  };

  return (
    <Page>
      <Container w="100%" py={5} maxW={"100vw"} centerContent>
        <Stack mb={6} textAlign="left">
          <Heading fontSize="4xl">Dashboard</Heading>
        </Stack>
        <Flex width="100%" justifyContent="space-around" alignItems="center">
          <Box
            w={"45vw"}
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
            <Stack spacing={4}>
              <Heading as="h4" size="md">
                Consumo Kw/h mensal
              </Heading>
              <Chart type="bar" data={KWHChartData} options={KWHChartOptions} />
            </Stack>
          </Box>
          <Box
            w={"45vw"}
            p={10}
            pt={3}
            boxShadow="2xl"
            boxShadow="2xl"
            borderRadius={{ base: "none", sm: "xl" }}
            height={"100%"}
          >
            <Flex justifyContent={"space-around"} m={3} mb={4}>
              <InfoCard value="123" footer="MAR-ABR" type="Kw/h" />
              <InfoCard value="1233" footer="MAR-ABR" type="R$" />
            </Flex>

            <Stack spacing={4}>
              <Heading as="h4" size="md">
                Valores mensais
              </Heading>
              <Chart type="bar" data={KWHChartData} options={KWHChartOptions} />
            </Stack>
          </Box>
        </Flex>
      </Container>
    </Page>
  );
};
