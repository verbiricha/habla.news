import {
  useColorModeValue,
  Grid,
  GridItem,
  Flex,
  Stack,
} from "@chakra-ui/react";

import Main from "@habla/components/Main";
import Nav from "@habla/components/Nav";
import Header from "@habla/components/Header";

export default function Layout({ aside, children }) {
  const borderColor = useColorModeValue("#EBEAEA", "#232323");
  return (
    <>
      <Grid
        templateAreas={{
          base: `"header"
                "nav"
                "aside"
                "main"`,
          md: `"nav header header"
             "nav main aside"
             "nav main aside"`,
        }}
        gridTemplateRows={{
          base: "80px 20px 20px 1fr",
          md: "80px 1fr 30px",
        }}
        gridTemplateColumns={{
          base: "1fr",
          md: "60px 1fr 0.5fr",
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
          <Main>{children}</Main>
        </GridItem>
        <GridItem area={"aside"}>
          <Flex maxWidth={["100%", "100%", "28rem"]}>
            <Stack width="100%" gap={4} px={4}>
              {aside}
            </Stack>
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
}
