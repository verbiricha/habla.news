import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { Footer } from '../components/Footer'

const Layout = ({ children }) => (
  <Container height="100vh">

    <Main>
  {children}
    </Main>


    <Footer />
  </Container>
)

export default Layout
