import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { App } from "./App";
import { Details } from "./components/Details";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#14b8a6" },
    secondary: { main: "#38bdf8" },
  },
});

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
  ],
  {
    initialEntries: ["/"],
    initialIndex: 1,
  }
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
