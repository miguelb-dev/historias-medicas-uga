import styles from "./EncabezadoModulo.module.css";

type EncabezadoModuloProps = {
  title: string;
  description: string;
};

export const EncabezadoModulo = ({
  title,
  description,
}: EncabezadoModuloProps) => {
  return (
    <header className={styles.headerModule}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </header>
  );
};
