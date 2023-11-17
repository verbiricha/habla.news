import {
  useColorModeValue,
  Grid,
  GridItem,
  Flex,
  Stack,
} from "@chakra-ui/react";

import Nav from "@habla/components/Nav";
import Header from "@habla/components/Header";

export default function Wide({ children }) {
  const borderColor = useColorModeValue("#EBEAEA", "#232323");
  return (
    <>
      <Grid
        templateAreas={{
          base: `"header"
                "nav"
                "main"`,
          md: `"nav header header"
             "nav main main"
             "nav main main"`,
        }}
        gridTemplateRows={{
          base: "80px 40px 0 1fr",
          md: "80px 1fr 30px",
        }}
        gridTemplateColumns={{
          base: "1fr",
          md: "73px 1fr 0.5fr",
          xl: "200px 1fr 0.5fr",
        }}
        minHeight="100vh"
        gap={2}
      >
        <GridItem area={"header"}>
          <Header />
        </GridItem>
        <GridItem area={"nav"} borderRight={{ md: `1px solid ${borderColor}` }}>
          <Nav />
        </GridItem>
        <GridItem area={"main"}>
          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Stack
              gap={4}
              px={4}
              maxWidth={["100%", "100%", "48rem"]}
              width="100%"
            >
              {children}
            </Stack>
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
}
