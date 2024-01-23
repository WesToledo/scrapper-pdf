import {
  Box,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "../components/Page";
import { api } from "../shared/api";
import { getMonthNameByNumber } from "../shared/utils";

interface InfoCardProps {
  value: string;
  type: string;
}

interface MonthReferenceI {
  referenceMonth: string;
  referenceMonthNumber: number;
  eletric_energy_amount: number;
  eletric_energy_value: number;
  sceee_energy_amount: number;
  sceee_energy_value: number;
  public_ilumination_contrib: number;
  compensated_energy_amount: number;
  compensated_energy_value: number;
}

interface IChartData {
labels: string[]
datasets: {
  label: string;
  data: number[]
}[]
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast()

  const [selectedClientNumber, setSelectedClientNumber] = useState();

  const [clientNumbers, setClientNumbers] = useState([]);
  const [isLoadingClientNumbers, setIsLoadingClientNumbers] = useState(false);
  const [dataMonths, setDataMonths] = useState<MonthReferenceI[]>([]);
  const [KWHChartData, setKWHChartData] = useState<IChartData>();
  const [moneyChartData, setMoneyChartData] = useState<IChartData>();

  const [totalEletricEnergyAmount, setTotalEletricEnergyAmount] = useState(0);
  const [totalEletricEnergyValue, setTotalEletricEnergyValue] = useState(0);

  const chartOptions = {
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
  };


  useEffect(() => {
    async function fecthClientNumbers() {
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
        toast({
          title: 'Erro ao buscar clientes',
          status: 'error',
          isClosable: true,
        })
        setIsLoadingClientNumbers(false);
      }
    }
    fecthClientNumbers();
  }, []);

  useEffect(() => {
    async function fetchGraphData() {
      try {
        const { data } = await api.get(
          "/fatura/list-by-month/" + selectedClientNumber
        );

        const referencesMonths: MonthReferenceI[] = data
          .map(({ referenceMonth, _sum }) => {
            return {
              referenceMonth,
              referenceMonthNumber: getMonthNameByNumber(referenceMonth),
              eletric_energy_amount: _sum.eletric_energy_amount,
              eletric_energy_value: _sum.eletric_energy_value,
              sceee_energy_amount: _sum.sceee_energy_amount,
              sceee_energy_value: _sum.sceee_energy_value,
              public_ilumination_contrib: _sum.public_ilumination_contrib,
              compensated_energy_amount: _sum.compensated_energy_amount,
              compensated_energy_value: _sum.compensated_energy_value,
            };
          })
          .sort((a, b) => a.referenceMonthNumber - b.referenceMonthNumber);

        setDataMonths(referencesMonths);

        const eletricEnergyAmountData = referencesMonths.map(
          ({ eletric_energy_amount, sceee_energy_amount }) =>
            eletric_energy_amount + sceee_energy_amount
        );

        const compensateEnergyAmount = referencesMonths.map(
          ({ compensated_energy_amount }) => compensated_energy_amount
        );

        setTotalEletricEnergyAmount(
          eletricEnergyAmountData.reduce((a, b) => a + b, 0)
        );

        const KWHChartData: IChartData = {
          labels: referencesMonths.map(({ referenceMonth }) => referenceMonth),
          datasets: [
            {
              label: "Consumo de Energia Elétrica (kwh)",
              data: eletricEnergyAmountData,
            },
            {
              label: "Energia Compensada (kwh)",
              data: compensateEnergyAmount,
            },
          ],
        };
        setKWHChartData(KWHChartData);

        const eletricEnergyValues = referencesMonths.map(
          ({ eletric_energy_value, sceee_energy_value }) =>
            eletric_energy_value + sceee_energy_value
        );

        const conpensatedEnergyValues = referencesMonths.map(
          ({ compensated_energy_value }) => compensated_energy_value
        );

        setTotalEletricEnergyValue(
          eletricEnergyValues.reduce((a, b) => a + b, 0)
        );

        const moneyChartData: IChartData = {
          labels: referencesMonths.map(({ referenceMonth }) => referenceMonth),
          datasets: [
            {
              label: "Valor Total sem GD",
              data: eletricEnergyValues,
            },
            {
              label: "Economia GD",
              data: conpensatedEnergyValues,
            },
          ],
        };
        setMoneyChartData(moneyChartData);
      } catch (err) {
        toast({
          title: 'Erro ao gerar gráficos',
          status: 'error',
          isClosable: true,
        })
      }
    }
    fetchGraphData();
  }, [selectedClientNumber]);

  const InfoCard = ({ value, type }: InfoCardProps) => {
    return (
      <Card pt={0} px={5}>
        <CardBody justifyContent="center" alignItems="center">
          {/* <Flex direction="column" spacing={1}> */}
          <Text as="span" fontSize="xx-large" fontWeight="bold" mr={1}>
            {value}
          </Text>
          <Text as="span" fontSize="larger" fontWeight="bold">
            {type}
          </Text>

          <Flex justifyContent="center">
            <Text>
              {dataMonths.length &&
                `${dataMonths[0].referenceMonth} - ${
                  dataMonths[dataMonths.length - 1].referenceMonth
                }`}
            </Text>
          </Flex>
        </CardBody>
      </Card>
    );
  };

  return (
    <Page>
      <Container w="100%" py={5} maxW={"100vw"} centerContent>
        <Stack mb={6} textAlign="left">
          {/* <Heading fontSize="4xl">Dashboard</Heading> */}
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
                    // w={300}
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
              <Chart type="bar" data={KWHChartData} options={chartOptions} />
            </Stack>
          </Box>
          <Box
            w={"45vw"}
            p={10}
            pt={3}
            boxShadow="2xl"
            borderRadius={{ base: "none", sm: "xl" }}
            height={"100%"}
          >
            <Flex justifyContent={"space-around"} m={3} mb={4}>
              <InfoCard
                value={"" + totalEletricEnergyAmount.toFixed(2)}
                type="Kw/h"
              />
              <InfoCard
                value={"" + totalEletricEnergyValue.toFixed(2)}
                type="R$"
              />
            </Flex>

            <Stack spacing={4}>
              <Heading as="h4" size="md">
                Valores mensais
              </Heading>
              <Chart type="bar" data={moneyChartData} options={chartOptions} />
            </Stack>
          </Box>
        </Flex>
      </Container>
    </Page>
  );
};
