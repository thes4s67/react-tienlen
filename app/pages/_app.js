import { SocketWrapper } from "../src/store/SocketContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <SocketWrapper>
      <Component {...pageProps} />
    </SocketWrapper>
  );
}

export default MyApp;
