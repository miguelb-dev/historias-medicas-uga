import { DatosEmpresa } from "../../components/DatosEmpresa";
import styles from "./Header.module.css";
import logo from "../../assets/images/historia-medica.png";

export const Header = () => {
  return (
    <header className={styles.header} id="header">
      <div className={styles.softwareData}>
        <img
          className={styles.logo}
          src={logo}
          alt="Logo del Software de Historias Médicas"
        />
        <div className={styles.softwareNameWrapper}>
          <h1 className={styles.softwareName}>Historias Médicas</h1>
          <p className={styles.softwareDescription}>
            Plataforma de Gestión Administrativa
          </p>
        </div>
      </div>

      <DatosEmpresa></DatosEmpresa>
    </header>
  );
};
