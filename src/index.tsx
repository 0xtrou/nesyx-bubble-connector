import { init, openModal } from "./lib.entrypoint";

if (document) {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init();
      openModal();
    }
  };
}
