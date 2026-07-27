import styles from "./index.module.css";

export const Historias = () => {
  return (
    <section className={styles.pageSection}>
      <h2 className={styles.pageTitle}>Historias Registradas</h2>

      {/* Panel de Control */}
      <section className={styles.controlPanel}>
        <label className={styles.searchHistory} htmlFor="searchInput">
          Buscar Historia
          <input
            id="searchInput"
            className={styles.input}
            type="text"
            placeholder="Nombres + Apellidos del Paciente"
          />
        </label>

        <div className={styles.mainButtons}>
          {/* Agregar Historia */}
          <button className={styles.addHistory} type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-file-text"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Agregar Historia
          </button>

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

      {/* Historias Médicas */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código de la Historia</th>
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
