import { EncabezadoModulo } from "../../components/EncabezadoModulo/index.";
import styles from "./Rendimiento.module.css";

export const Rendimiento = () => {
  return (
    <>
      <EncabezadoModulo
        title="Rendimiento"
        description="Análisis de los ingresos de la Clínica UGA"
      ></EncabezadoModulo>

      <section className={styles.rendimiento}>
        <h2 className={styles.rendimientoTitle}>Proceso no disponible</h2>
      </section>
    </>
  );
};
