import { Routes, Route } from "react-router-dom";

// Rendimiento
import { Rendimiento } from "../modules/Rendimiento/index.tsx";

// Facturas
import { Facturas } from "../modules/Facturas/index.tsx";
import { VerFacturas } from "../modules/Facturas/VerFacturas/index.tsx";
import { RegistrarFactura } from "../modules/Facturas/RegistrarFactura/index.tsx";
import { EditarFactura } from "../modules/Facturas/EditarFactura/index.tsx";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rendimiento */}
      <Route path="/rendimiento" element={<Rendimiento />} />

      {/* Facturas */}
      <Route path="/facturas" element={<Facturas />}>
        <Route path="ver-facturas" element={<VerFacturas />} />
        <Route path="registrar-factura" element={<RegistrarFactura />} />
        <Route path="editar-factura" element={<EditarFactura />} />
      </Route>
    </Routes>
  );
};
