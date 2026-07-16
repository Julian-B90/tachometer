import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import ReactDOM from "react-dom/client";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { DockerMuiV6ThemeProvider } from "@docker/docker-mui-theme";

import { App } from "./App";
import { Details } from "./components/Details";
import { Logs } from "./components/Logs";
import { AutoThemeProvider } from "./components/AutoThemeProvider";

const router = createMemoryRouter(
  [
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/details/:id",
      element: <Details />,
    },
    {
      path: "/logs/:id",
      element: <Logs />,
    },
  ],
  {
    initialEntries: ["/"],
    initialIndex: 1,
  }
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DockerMuiV6ThemeProvider>
      <AutoThemeProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </AutoThemeProvider>
    </DockerMuiV6ThemeProvider>
  </React.StrictMode>
);
