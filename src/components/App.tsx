import "../assets/css/App.css";

import React from "react";

import { WalletConnectProvider } from "./WalletConnect";
import { WalletContainerInitParams } from "../types";

function App(params: WalletContainerInitParams) {
  return <WalletConnectProvider params={params} />;
}

export default App;
