import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { App } from "./app";
import { Providers } from "./Providers";

const container = document.getElementById("container");

// "createRoot(container!) is recommended by React docs: https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html. See line: "const root = createRoot(container); // createRoot(container!) if you use TypeScript"".
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <ToastContainer />
        <App />
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
);
