import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  installCloudAutosave,
  loadStateFromCloud,
  saveStateToCloud,
} from "./utils/cloudState";

async function iniciarAplicacao() {
  try {
    await loadStateFromCloud();
    installCloudAutosave();
    await saveStateToCloud();
  } catch (error) {
    console.error("Erro ao sincronizar dados com Supabase:", error);
  }

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

iniciarAplicacao();
