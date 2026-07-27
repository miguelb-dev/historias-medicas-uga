import { Routes, Route } from "react-router-dom";

// Rendimiento
import { Rendimiento } from "../pages/Rendimiento/index.tsx";

// Historias Médicas
import { Historias } from "../pages/Historias/index.tsx";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rendimiento */}
      <Route path="/rendimiento" element={<Rendimiento />} />

      {/* Historias Médicas */}
      <Route path="/historias" element={<Historias />}></Route>
    </Routes>
  );
};
