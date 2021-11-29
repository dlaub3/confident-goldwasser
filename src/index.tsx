import { render } from "react-dom";
import { env } from "./env";
import { EnvContextProvider } from "./EnvContext";
import App from "./App";
import "./styles.scss";

const rootElement = document.getElementById("root");
render(
  <EnvContextProvider value={env}>
    <App />
  </EnvContextProvider>,
  rootElement,
);
