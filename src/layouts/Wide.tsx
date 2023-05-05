import { Grid, GridItem, Flex, Stack } from "@chakra-ui/react";

import Main from "@habla/components/Main";
import Nav from "@habla/components/Nav";
import Header from "@habla/components/Header";

const Wide = ({ children }) => (
  <>
    <Grid
      templateAreas={{
        base: `"header header header"
                "nav nav nav"
                "main main main"`,
        md: `"nav header header"
             "nav main main"
             "nav main main"`,
      }}
      gridTemplateRows={{
        base: "1fr",
        md: "80px 1fr 30px",
      }}
      gridTemplateColumns={{
        base: "1fr",
        md: "60px 1fr",
      }}
      minHeight="100vh"
      gap={2}
    >
      <GridItem area={"header"}>
        <Header />
      </GridItem>
      <GridItem area={"nav"} borderRight={{ md: "1px solid #EBEAEA" }}>
        <Nav />
      </GridItem>
      <GridItem area={"main"}>
        <Flex align="center" justifyContent="center">
          <Stack px="1rem" maxWidth="52rem">
            {children}
          </Stack>
        </Flex>
      </GridItem>
    </Grid>
  </>
);

export default Wide;
