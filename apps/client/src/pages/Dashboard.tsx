import { Box, Container, Heading, Stack } from "@chakra-ui/react";
import UploadComponent from "../components/UploadComponent";

export const Dashboard = () => {
  return (
    <Container
      maxW="4xl"
      py={{ base: "12", md: "24" }}
      px={{ base: "0", sm: "8" }}
    >
      <Stack spacing="8" width="100%">
        <Stack spacing="6">
          {/* <Logo /> */}
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading  fontSize="2xl">
              Upload de Faturas
            </Heading>
          </Stack>
        </Stack>
        <Box
          boxShadow="2xl"
          borderRadius={{ base: "none", sm: "xl" }}
          height={"100%"}
        >
          <UploadComponent />
        </Box>
      </Stack>
    </Container>
  );
};
