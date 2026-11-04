import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";

hydrateRoot(
  document.getElementById("root"),
  <App page={document.body.dataset.page} />,
);
