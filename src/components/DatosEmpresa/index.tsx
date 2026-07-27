import styles from "./DatosEmpresa.module.css";
import isotipo from "../../assets/images/isotipo-uga-blanco.png";

export const DatosEmpresa = () => {
  return (
    <div className={styles.companyNameData}>
      <img
        className={styles.companyIsotype}
        src={isotipo}
        alt="Isotipo de la Clínica UGA, C.A."
      />
      <p className={styles.companyName}>Clínica UGA, C.A.</p>
      <p className={styles.rif}>R.I.F.: J-309594117</p>
    </div>
  );
};
