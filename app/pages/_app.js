import { SocketWrapper } from "../src/store/SocketContext";

function MyApp({ Component, pageProps }) {
  return (
    <SocketWrapper>
      <Component {...pageProps} />
    </SocketWrapper>
  );
}

export default MyApp;
