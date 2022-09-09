import { SocketWrapper } from "../src/store/SocketContext";
import { ThemeProvider } from "@mui/material";
import theme from "../src/theme";
import "../styles/globals.css";
import Layout from "../src/theme/layout";

function MyApp({ Component, pageProps }) {
  return (
    <SocketWrapper>
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </SocketWrapper>
  );
}

export default MyApp;
