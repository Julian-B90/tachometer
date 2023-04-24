import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { DockerMuiThemeProvider } from "@docker/docker-mui-theme";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { App } from './App';
import { Details } from "./components/Details";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/details/:id",
    element: <Details />
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/*
      If you eject from MUI (which we don't recommend!), you should add
      the `dockerDesktopTheme` class to your root <html> element to get
      some minimal Docker theming.
    */}
    <DockerMuiThemeProvider>
      <CssBaseline />
      <RouterProvider router={router} />
    </DockerMuiThemeProvider>
  </React.StrictMode>
);

