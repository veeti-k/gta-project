import { Provider } from "react-redux";
import { store } from "../state/store";
import { AppProps } from "next/app";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.min.css";
import "../util/axios";

const App = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
);

export default App;
