import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./Facturas.module.css";
import { EncabezadoModulo } from "../../components/EncabezadoModulo/index.";

export const Facturas = () => {
  const url = useLocation();
  const rutaActual = url.pathname === "/facturas";

  return (
    <>
      <EncabezadoModulo
        title="Facturas"
        description="Gestión de las Facturas y sus Historias Médicas"
      ></EncabezadoModulo>

      <section>
        {/* Verifica si estamos en la raíz del módulo para cargar el menú o no */}
        {rutaActual ? (
          /* Menú de opciones */
          <section className={styles.menu}>
            <Link to="ver-facturas" className={styles.option}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="45"
                height="45"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>

              <h3 className={styles.optionTitle}>Ver Facturas</h3>
              <p className={styles.optionDescription}>
                Revisa todas las Facturas Registradas
              </p>
            </Link>

            <Link to="registrar-factura" className={styles.option}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="45"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-file-plus"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              <h3 className={styles.optionTitle}>Agregar Factura</h3>
              <p className={styles.optionDescription}>
                Registra una nueva Factura
              </p>
            </Link>
          </section>
        ) : (
          // Opcción seleccionada
          <Outlet />
        )}
      </section>
    </>
  );
};
