import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./VerFacturas.module.css";
import type {
  Factura,
  FacturaFilters,
} from "../../../services/Facturas/verFacturasService";
import { facturaService } from "../../../services/Facturas/verFacturasService";

export const VerFacturas = () => {
  /* === VARIABLES DE ESTADO === */

  // Estado para la carga de los datos
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros y búsqueda
  const [searchCriterion, setSearchCriterion] = useState<
    "id_factura" | "id_historia" | "cedula_paciente" | ""
  >("");
  // Estado TEMPORAL para el input (se actualiza mientras el usuario escribe)
  const [searchInputValue, setSearchInputValue] = useState("");
  // Estado ACTIVO para la búsqueda (solo se actualiza cuando se presiona Buscar)
  const [activeSearchCriterion, setActiveSearchCriterion] = useState<
    "id_factura" | "id_historia" | "cedula_paciente" | ""
  >("");
  const [activeSearchValue, setActiveSearchValue] = useState("");

  // Filtros (TODOS Activados por defecto)
  const [selectedStatus, setSelectedStatus] = useState<
    ("PROCESADA" | "ANULADA" | "NOTA DE CREDITO")[]
  >(["PROCESADA", "ANULADA", "NOTA DE CREDITO"]);

  // Ordenamiento (Fecha de Emisión DESC. por defecto)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const recordsPerPage = 50;

  // Referencia para saber si es la primera carga
  const isFirstLoad = useRef(true);

  /* === LÓGICA === */

  // Cargar facturas cuando cambien los filtros o la página
  const loadFacturas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const offset = (currentPage - 1) * recordsPerPage;

      // Si no hay estatus seleccionados, no hacemos la petición
      if (selectedStatus.length === 0) {
        setFacturas([]);
        setTotalRecords(0);
        setTotalPages(0);
        setLoading(false);
        return;
      }

      const filters: FacturaFilters = {
        searchCriterion: activeSearchCriterion || undefined,
        searchValue: activeSearchValue || undefined,
        estatus: selectedStatus,
        sortOrder,
        limit: recordsPerPage,
        offset,
      };

      const { data, total } = await facturaService.getFacturas(filters);
      setFacturas(data);
      setTotalRecords(total);
      setTotalPages(Math.ceil(total / recordsPerPage));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar facturas");
      console.error("Error cargando facturas:", err);
    } finally {
      setLoading(false);
    }
  }, [
    activeSearchCriterion,
    activeSearchValue,
    selectedStatus,
    sortOrder,
    currentPage,
  ]);

  // Cargar todas las facturas al montar el componente
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      loadFacturas();
    }
  }, [loadFacturas]);

  // Cargar facturas cuando cambien los filtros (excluyendo búsqueda)
  useEffect(() => {
    if (!isFirstLoad.current) {
      loadFacturas();
    }
  }, [selectedStatus, sortOrder, currentPage, loadFacturas]);

  // Búsqueda específica
  const handleSearch = () => {
    setActiveSearchCriterion(searchCriterion);
    setActiveSearchValue(searchInputValue);
    setCurrentPage(1);
  };

  // limpiar búsqueda específica
  const handleClearSearch = () => {
    setSearchCriterion("");
    setSearchInputValue("");
    setActiveSearchCriterion("");
    setActiveSearchValue("");
    setCurrentPage(1);
  };

  // Manejar filtros
  const handleStatusChange = (
    status: "PROCESADA" | "ANULADA" | "NOTA DE CREDITO",
    checked: boolean,
  ) => {
    setCurrentPage(1);
    if (checked) {
      setSelectedStatus((prev) => [...prev, status]);
    } else {
      setSelectedStatus((prev) => prev.filter((s) => s !== status));
    }
  };

  // Ordenar Facturas
  const handleSortChange = (value: string) => {
    setCurrentPage(1);
    if (value === "1") {
      setSortOrder("desc");
    } else if (value === "2") {
      setSortOrder("asc");
    }
  };

  // Cambiar de página
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Calcular rango de registros mostrados
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  // Verificar si hay búsqueda activa
  const hasActiveSearch = activeSearchCriterion && activeSearchValue;

  // Verificar si hay estatus seleccionados
  const hasSelectedStatus = selectedStatus.length > 0;

  /* === RENDERIZADO === */
  return (
    <section className={styles.facturas}>
      <h2 className={styles.facturasTitle}>Facturas Registradas</h2>

      {/* === PANEL DE CONTROL === */}
      <section className={styles.controlPanel}>
        {/* Buscador */}
        <div className={styles.search}>
          <div className={styles.searchCriterionWrapper}>
            <label className={styles.searchCriterion} htmlFor="criterion">
              Criterio
            </label>
            <select
              id="criterion"
              value={searchCriterion}
              onChange={(e) => setSearchCriterion(e.target.value as any)}
            >
              <option value="">...</option>
              <option value="id_factura">Código de la Factura</option>
              <option value="id_historia">Nro. Historia</option>
              <option value="cedula_paciente">Cédula (Paciente)</option>
            </select>
          </div>

          <label className={styles.searchValue} htmlFor="searchInput">
            <input
              id="searchInput"
              className={`${styles.input} ${styles.searchInput}`}
              type="text"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && searchCriterion && searchInputValue) {
                  handleSearch();
                }
              }}
              placeholder="Ingrese valor a buscar..."
            />
          </label>
          <button
            className={styles.searchButton}
            type="button"
            onClick={handleSearch}
            disabled={
              !searchCriterion || !searchInputValue || !hasSelectedStatus
            }
          >
            Buscar
          </button>
          {hasActiveSearch && (
            <button
              className={styles.clearButton}
              type="button"
              onClick={handleClearSearch}
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className={styles.filter}>
          <label htmlFor="procesadas">
            <input
              id="procesadas"
              type="checkbox"
              checked={selectedStatus.includes("PROCESADA")}
              onChange={(e) =>
                handleStatusChange("PROCESADA", e.target.checked)
              }
            />
            Facturas Procesadas
          </label>

          <label htmlFor="anuladas">
            <input
              id="anuladas"
              type="checkbox"
              checked={selectedStatus.includes("ANULADA")}
              onChange={(e) => handleStatusChange("ANULADA", e.target.checked)}
            />
            Facturas Anuladas
          </label>

          <label htmlFor="notasCredito">
            <input
              id="notasCredito"
              type="checkbox"
              checked={selectedStatus.includes("NOTA DE CREDITO")}
              onChange={(e) =>
                handleStatusChange("NOTA DE CREDITO", e.target.checked)
              }
            />
            Notas de Crédito
          </label>
        </div>

        {/* Ordenamiento */}
        <label htmlFor="sorting" className={styles.sorting}>
          Ordenar Por
          <select
            id="sorting"
            value={sortOrder === "desc" ? "1" : "2"}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="1">Fecha Emisión - Desc.</option>
            <option value="2">Fecha Emisión - Asc.</option>
          </select>
        </label>

        {/* Paginación */}
        <div className={styles.pagination}>
          <span>
            {totalRecords > 0 ? `${startRecord}-${endRecord}` : "0"} de{" "}
            {totalRecords}
          </span>
          <div className={styles.pageButtons}>
            <button
              className={styles.forwards}
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || !hasSelectedStatus}
            >
              &lt;
            </button>
            <button
              className={styles.backwards}
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === totalPages ||
                totalPages === 0 ||
                !hasSelectedStatus
              }
            >
              &gt;
            </button>
          </div>
        </div>
      </section>

      {/* === FACTURAS === */}
      {loading ? (
        <div className={styles.loading}>Cargando facturas...</div>
      ) : !hasSelectedStatus ? (
        <div className={styles.noStatusSelected}>
          <p>Activa al menos un filtro para ver las facturas</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código de la Factura</th>
                <th>Código del Control</th>
                <th>Nro. Historia</th>
                <th>Cédula (Paciente)</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Titular</th>
                <th>Estatus</th>
                <th>Fecha Emisión</th>
              </tr>
            </thead>
            <tbody>
              {facturas.length === 0 ? (
                <tr>
                  <td colSpan={9} className={styles.noData}>
                    No se encontraron facturas con los filtros seleccionados
                  </td>
                </tr>
              ) : (
                facturas.map((factura) => (
                  <tr key={factura.id_factura}>
                    <td>{factura.id_factura}</td>
                    <td>{factura.codigo_control}</td>
                    <td>{factura.id_historia || "N/A"}</td>
                    <td>
                      {factura.historia?.paciente?.cedula_paciente || "N/A"}
                    </td>
                    <td>{factura.historia?.paciente?.nombres || "N/A"}</td>
                    <td>{factura.historia?.paciente?.apellidos || "N/A"}</td>
                    <td>{factura.titular}</td>
                    <td>
                      <span
                        className={`${styles.status} ${styles[factura.estatus.toLowerCase().replace(" ", "_")]}`}
                      >
                        {factura.estatus}
                      </span>
                    </td>
                    <td>
                      {new Date(factura.fecha_emision).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
