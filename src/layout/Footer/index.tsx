import { DatosEmpresa } from "../../components/DatosEmpresa";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer} id="footer">
      <p>Historias Médicas © 2026 - Todos los derechos reservados</p>

      <DatosEmpresa></DatosEmpresa>
    </footer>
  );
};
