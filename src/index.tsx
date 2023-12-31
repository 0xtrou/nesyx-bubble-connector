import { init } from "./lib.entrypoint";

if (document) {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init({
        projectId: "238306f7f53d01d9f05336165739672a",
        chainId: 1,
        on: {
          connected: (address) => {
            console.log("connected", address);
          },
          disconnected: () => {
            console.log("disconnected");
          },
        },
        customChains: [],
      });
    }
  };
}
