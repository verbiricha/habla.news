import { Container } from "@habla/components/Container";
import { Main } from "@habla/components/Main";
import { Header } from "@habla/components/Header";
import { Footer } from "@habla/components/Footer";
import Hero from "@habla/components/Hero";

const Layout = ({ hero, children }) => (
  <Container minHeight="100vh">
    <Header />

    {hero && <Hero />}
    <Main>{children}</Main>

    <Footer />
  </Container>
);

export default Layout;
