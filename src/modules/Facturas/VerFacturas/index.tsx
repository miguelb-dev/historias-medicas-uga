import styles from "./index.module.css";

export const VerFacturas = () => {
  return (
    <section className={styles.pageSection}>
      <h2 className={styles.pageTitle}>Facturas Registradas</h2>

      {/* Panel de Control */}
      <section className={styles.controlPanel}>
        <label className={styles.searchBill} htmlFor="searchInput">
          Buscar Factura
          <input
            id="searchInput"
            className={styles.input}
            type="text"
            placeholder="Nombres + Apellidos del Paciente"
          />
        </label>

        <div className={styles.mainButtons}>
          {/* Paginación */}
          <div className={styles.paginationWrapper}>
            <span>1-50 de 4.328</span>
            <div className={styles.pageButtons}>
              <button className={styles.forwards} type="button">
                &lt;
              </button>
              <button className={styles.backwards} type="button">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Facturas */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código de la Factura</th>
            <th>Código del Control</th>
            <th>Código de la Factura</th>
            <th>Cédula (Paciente)</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Titular</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1001</td>
            <td>CTR-742</td>
            <td>000374669</td>
            <td>V-12345678</td>
            <td>María</td>
            <td>Pérez</td>
            <td>Antonio Ruiz</td>
          </tr>
          <tr>
            <td>1002</td>
            <td>CTR-765</td>
            <td>000374670</td>
            <td>V-23456789</td>
            <td>Juan</td>
            <td>Gómez</td>
            <td>María Soto</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};
