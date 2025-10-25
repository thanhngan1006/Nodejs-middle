import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // Import

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* Bọc AuthProvider ở đây */}
      <AuthProvider> 
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);