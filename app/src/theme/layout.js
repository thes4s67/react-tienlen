import Footer from "../components/Footer";
import Header from "../components/Header";
import { Container } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <Container sx={{ mt: 3, mb: 2 }}>
      <Header />
      {children}
      <Footer />
    </Container>
  );
};

export default Layout;
