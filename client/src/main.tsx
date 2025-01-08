import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.tsx"; 
import Loading from "./Loading.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Loading />
  </StrictMode>
);
