import { useNavigate } from "react-router-dom";
import styles from "./RegistrarFactura.module.css";
import { useState, useEffect } from "react";

/* Funciones para la conexión con la BBDD */
import {
  buscarPaciente,
  obtenerMedicos,
  guardarPaciente,
  guardarHistoria,
  guardarFactura,
} from "../../../services/Facturas/registrarFacturaService";

interface Medico {
  cedula_medico: number;
  nombres: string;
  apellidos: string;
}

export const RegistrarFactura = () => {
  const navigate = useNavigate();

  // Variables de Estado
  const [formData, setFormData] = useState({
    // Factura
    id_factura: "",
    codigo_control: "",
    fecha_emision: "",
    titular: "",
    tipo_ingreso: "PARTICULAR",
    forma_pago: "PARTICULAR",
    suministros_hospitalarios: "",
    servicios_cobrables: "",
    medicamentos: "",
    honorarios_medicos_y_servicios_auxiliares: "",
    tasa_dolar_bcv: "",
    estatus: "PROCESADA",
    motivo: "",

    // Paciente
    cedula_paciente: "",
    nombres_paciente: "",
    apellidos_paciente: "",
    fecha_nacimiento: "",
    edad: 0,
    direccion_paciente: "",

    // Médico
    cedula_medico: "",

    // Historia
    fecha_ingreso: "",
    fecha_egreso: "",
    diagnostico: "",
    cirugia: "NO",
    tipo_cirugia: "",
  });
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacienteEncontrado, setPacienteEncontrado] = useState<any>(null);
  const [mostrarMotivo, setMostrarMotivo] = useState(false);
  const [mostrarTipoCirugia, setMostrarTipoCirugia] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [buscandoPaciente, setBuscandoPaciente] = useState(false);

  // Cargar médicos al montar el componente
  useEffect(() => {
    const cargarMedicos = async () => {
      const listaMedicos = await obtenerMedicos();
      setMedicos(listaMedicos);
    };
    cargarMedicos();
  }, []);

  // Manejar cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = e.target;

    // Para campos numéricos, solo permitir números y punto decimal
    const camposNumericos = [
      "suministros_hospitalarios",
      "servicios_cobrables",
      "medicamentos",
      "honorarios_medicos_y_servicios_auxiliares",
      "tasa_dolar_bcv",
    ];

    if (camposNumericos.includes(id)) {
      const cleanValue = value.replace(/[^0-9.]/g, "");
      const parts = cleanValue.split(".");
      const finalValue =
        parts.length > 2
          ? parts[0] + "." + parts.slice(1).join("")
          : cleanValue;

      setFormData((prev) => ({
        ...prev,
        [id]: finalValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  // Manejar cambio de estatus
  const handleEstatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, estatus: value }));
    setMostrarMotivo(value !== "PROCESADA");
    if (value === "PROCESADA") {
      setFormData((prev) => ({ ...prev, motivo: "" }));
    }
  };

  // Manejar cambio de cirugía
  const handleCirugiaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, cirugia: value }));
    setMostrarTipoCirugia(value === "SI");
    if (value === "NO") {
      setFormData((prev) => ({ ...prev, tipo_cirugia: "" }));
    }
  };

  // Calcular edad desde fecha de nacimiento
  const handleFechaNacimiento = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fecha = e.target.value;
    setFormData((prev) => ({ ...prev, fecha_nacimiento: fecha }));

    if (fecha) {
      const [anio, mes, dia] = fecha.split("-").map(Number);
      const nacimiento = new Date(anio, mes - 1, dia);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const difMes = hoy.getMonth() - nacimiento.getMonth();
      const difDia = hoy.getDate() - nacimiento.getDate();

      if (difMes < 0 || (difMes === 0 && difDia < 0)) {
        edad--;
      }

      setFormData((prev) => ({ ...prev, edad: Math.max(0, edad) }));
    }
  };

  // Buscar paciente
  const handleBuscarPaciente = async () => {
    if (!formData.cedula_paciente) {
      alert("Ingresa un número de cédula");
      return;
    }

    setBuscandoPaciente(true);
    const paciente = await buscarPaciente(formData.cedula_paciente);
    setBuscandoPaciente(false);

    if (paciente) {
      setPacienteEncontrado(paciente);
      setFormData((prev) => ({
        ...prev,
        nombres_paciente: paciente.nombres || "",
        apellidos_paciente: paciente.apellidos || "",
        fecha_nacimiento: paciente.fecha_nacimiento || "",
        edad: paciente.edad || 0,
        direccion_paciente: paciente.direccion || "",
      }));
    } else {
      setPacienteEncontrado(null);
      setFormData((prev) => ({
        ...prev,
        nombres_paciente: "",
        apellidos_paciente: "",
        fecha_nacimiento: "",
        edad: 0,
        direccion_paciente: "",
      }));
    }
  };

  // Manejar selección de médico
  const handleMedicoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cedula = e.target.value;
    setFormData((prev) => ({ ...prev, cedula_medico: cedula }));
  };

  // Obtener nombre del médico seleccionado
  const getMedicoNombre = () => {
    const medico = medicos.find(
      (m) => m.cedula_medico === Number(formData.cedula_medico),
    );
    return medico ? `${medico.nombres} ${medico.apellidos}` : "...";
  };

  // Validar formulario antes de enviar
  const validarFormulario = () => {
    // SOLO validar campos obligatorios de factura
    if (
      !formData.id_factura ||
      !formData.codigo_control ||
      !formData.fecha_emision
    ) {
      alert("Por favor, completa los campos obligatorios de la factura");
      return false;
    }

    // Validar motivo si es anulación o nota de crédito
    if (formData.estatus !== "PROCESADA" && !formData.motivo) {
      alert("Por favor, ingresa el motivo de la anulación o nota de crédito");
      return false;
    }

    // Si hay cédula de paciente pero NO existe, validar que tenga nombre y apellido
    if (formData.cedula_paciente && !pacienteEncontrado) {
      if (!formData.nombres_paciente || !formData.apellidos_paciente) {
        alert(
          "Si vas a registrar un paciente nuevo, completa sus Nombres y Apellidos",
        );
        return false;
      }
    }

    // Si hay médico seleccionado pero NO hay cédula de paciente, mostrar advertencia
    if (formData.cedula_medico && !formData.cedula_paciente) {
      if (
        !confirm(
          "Seleccionaste un médico pero no hay paciente. ¿Deseas continuar?",
        )
      ) {
        return false;
      }
    }

    // Si hay datos de historia pero NO hay cédula de paciente, mostrar advertencia
    if (
      (formData.fecha_ingreso ||
        formData.fecha_egreso ||
        formData.diagnostico ||
        formData.cirugia === "SI") &&
      !formData.cedula_paciente
    ) {
      if (
        !confirm(
          "Ingresaste datos de historia médica pero no hay paciente. ¿Deseas continuar?",
        )
      ) {
        return false;
      }
    }

    return true;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setCargando(true);

    try {
      let historiaId = null;

      // 1. Si hay cédula de paciente, procesar paciente e historia
      if (formData.cedula_paciente) {
        // 1a. Si el paciente no existe, guardarlo
        if (!pacienteEncontrado) {
          await guardarPaciente({
            cedula_paciente: Number(formData.cedula_paciente),
            nombres: formData.nombres_paciente,
            apellidos: formData.apellidos_paciente,
            fecha_nacimiento: formData.fecha_nacimiento || null,
            edad: formData.edad,
            direccion: formData.direccion_paciente || null,
          });
        }

        // 1b. Guardar historia médica (solo si hay datos o si hay médico)
        const tieneDatosHistoria =
          formData.fecha_ingreso ||
          formData.fecha_egreso ||
          formData.diagnostico ||
          formData.cedula_medico ||
          formData.cirugia === "SI";

        if (tieneDatosHistoria) {
          const historiaData = {
            cedula_medico: formData.cedula_medico
              ? Number(formData.cedula_medico)
              : null,
            cedula_paciente: Number(formData.cedula_paciente),
            fecha_ingreso: formData.fecha_ingreso || null,
            fecha_egreso: formData.fecha_egreso || null,
            diagnostico: formData.diagnostico || null,
            cirugia: formData.cirugia,
            tipo_cirugia:
              formData.cirugia === "SI" ? formData.tipo_cirugia : null,
          };

          const historiaGuardada = await guardarHistoria(historiaData);
          historiaId = historiaGuardada[0]?.id_historia;
        }
      }

      // 2. Guardar factura (SIEMPRE)
      const facturaData = {
        id_factura: formData.id_factura,
        id_historia: historiaId, // Puede ser null
        codigo_control: formData.codigo_control,
        fecha_emision: formData.fecha_emision,
        titular: formData.titular || null,
        tipo_ingreso: formData.tipo_ingreso,
        forma_pago: formData.forma_pago,
        suministros_hospitalarios: formData.suministros_hospitalarios || 0,
        servicios_cobrables: formData.servicios_cobrables || 0,
        medicamentos: formData.medicamentos || 0,
        honorarios_medicos_y_servicios_auxiliares:
          formData.honorarios_medicos_y_servicios_auxiliares || 0,
        tasa_dolar_bcv: formData.tasa_dolar_bcv || 0,
        estatus: formData.estatus,
        motivo: formData.estatus !== "PROCESADA" ? formData.motivo : null,
      };

      await guardarFactura(facturaData);

      alert("¡Factura registrada exitosamente!");
      navigate("/facturas");

      // En caso de error
    } catch (error: any) {
      console.error("Error al guardar:", error);
      alert(`Error al guardar la factura: ${error.message}`);

      // Terminar el envío
    } finally {
      setCargando(false);
    }
  };

  /* === RENDERIZADO === */
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>Registrar Factura</h2>

      {/* === DATOS DE LA FACTURA === */}
      <fieldset>
        <legend>Datos de la Factura</legend>

        {/* Código de la Factura */}
        <div className={styles.inputWrapper}>
          <label htmlFor="id_factura">
            Código de la Factura<span className={styles.requireSymbol}>*</span>
          </label>
          <input
            id="id_factura"
            type="text"
            required
            value={formData.id_factura}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>

        {/* Número del Control */}
        <div className={styles.inputWrapper}>
          <label htmlFor="codigo_control">
            Nro. del Control<span className={styles.requireSymbol}>*</span>
          </label>
          <input
            id="codigo_control"
            type="text"
            required
            value={formData.codigo_control}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>

        {/* Fecha de emisión */}
        <div className={styles.inputWrapper}>
          <label htmlFor="fecha_emision">
            Fecha de Emisión<span className={styles.requireSymbol}>*</span>
          </label>
          <input
            id="fecha_emision"
            type="date"
            required
            value={formData.fecha_emision}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>

        {/* Titular */}
        <div className={styles.inputWrapper}>
          <label htmlFor="titular">Titular</label>
          <input
            id="titular"
            type="text"
            value={formData.titular}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>

        {/* Tipo de Ingreso */}
        <div className={styles.inputWrapper}>
          <label htmlFor="tipo_ingreso">Tipo de Ingreso</label>
          <select
            id="tipo_ingreso"
            value={formData.tipo_ingreso}
            onChange={handleInputChange}
            disabled={cargando}
          >
            <option value="EMPRESA">Empresa</option>
            <option value="PARTICULAR">Particular</option>
          </select>
        </div>

        {/* Forma de Pago */}
        <div className={styles.inputWrapper}>
          <label htmlFor="forma_pago">Forma de Pago</label>
          <select
            id="forma_pago"
            value={formData.forma_pago}
            onChange={handleInputChange}
            disabled={cargando}
          >
            <option value="EMPRESA">Empresa</option>
            <option value="PARTICULAR">Particular</option>
          </select>
        </div>

        {/* Suministros Hospitalarios */}
        <div className={styles.inputWrapper}>
          <label htmlFor="suministros_hospitalarios">
            Suministros Hospitalarios{" "}
            <span className={styles.moneyType}>(Bs.)</span>
          </label>
          <input
            id="suministros_hospitalarios"
            type="text"
            placeholder="0.00"
            value={formData.suministros_hospitalarios}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>

        {/* Servicios Cobrables */}
        <div className={styles.inputWrapper}>
          <label htmlFor="servicios_cobrables">
            Servicios Cobrables <span className={styles.moneyType}>(Bs.)</span>
          </label>
          <input
            id="servicios_cobrables"
            type="text"
            placeholder="0.00"
            value={formData.servicios_cobrables}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>

        {/* Medicamentos */}
        <div className={styles.inputWrapper}>
          <label htmlFor="medicamentos">
            Medicamentos <span className={styles.moneyType}>(Bs.)</span>
          </label>
          <input
            id="medicamentos"
            type="text"
            placeholder="0.00"
            value={formData.medicamentos}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>

        {/* Honorarios Médicos y Servicios Auxiliares */}
        <div className={styles.inputWrapper}>
          <label htmlFor="honorarios_medicos_y_servicios_auxiliares">
            Honorarios Médicos y Servicios Auxiliares{" "}
            <span className={styles.moneyType}>(Bs.)</span>
          </label>
          <input
            id="honorarios_medicos_y_servicios_auxiliares"
            type="text"
            placeholder="0.00"
            value={formData.honorarios_medicos_y_servicios_auxiliares}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>

        {/* Tasa del dolar BCV */}
        <div className={styles.inputWrapper}>
          <label htmlFor="tasa_dolar_bcv">Tasa Dólar BCV</label>
          <input
            id="tasa_dolar_bcv"
            type="text"
            placeholder="0.00"
            value={formData.tasa_dolar_bcv}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>

        {/* Estatus */}
        <div className={styles.inputWrapper}>
          <label htmlFor="estatus">Estatus</label>
          <select
            id="estatus"
            onChange={handleEstatusChange}
            value={formData.estatus}
            disabled={cargando}
          >
            <option value="PROCESADA">Procesada</option>
            <option value="ANULADA">Anulada</option>
            <option value="NOTA DE CREDITO">Nota de Crédito</option>
          </select>
        </div>

        {/* Motivo de la Anulación / Nota de Crédito */}
        {mostrarMotivo && (
          <div className={styles.inputWrapper}>
            <label htmlFor="motivo">Motivo</label>
            <textarea
              id="motivo"
              rows={5}
              value={formData.motivo}
              onChange={handleInputChange}
              disabled={cargando}
              required
            />
          </div>
        )}
      </fieldset>

      {/* === DATOS DEL PACIENTE === */}
      <fieldset>
        <legend>Datos del Paciente</legend>

        {/* Cédula del Paciente */}
        <div className={styles.inputWrapper}>
          <label htmlFor="cedula_paciente">Cédula</label>
          <input
            id="cedula_paciente"
            type="text"
            value={formData.cedula_paciente}
            onChange={handleInputChange}
            disabled={cargando || buscandoPaciente}
          />
          <button
            className={styles.searchButton}
            type="button"
            onClick={handleBuscarPaciente}
            disabled={cargando || buscandoPaciente || !formData.cedula_paciente}
          >
            {buscandoPaciente ? "Buscando..." : "Buscar"}
          </button>
          {pacienteEncontrado && (
            <small style={{ color: "green" }}>✓ Paciente existente</small>
          )}
          {formData.cedula_paciente &&
            !pacienteEncontrado &&
            !buscandoPaciente && (
              <small style={{ color: "orange" }}>
                ⚠ Paciente no encontrado - Se creará uno nuevo
              </small>
            )}
        </div>

        {/* Nombres del Paciente */}
        <div className={styles.inputWrapper}>
          <label htmlFor="nombres_paciente">Nombres</label>
          <input
            id="nombres_paciente"
            type="text"
            value={formData.nombres_paciente}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>

        {/* Apellidos del Paciente */}
        <div className={styles.inputWrapper}>
          <label htmlFor="apellidos_paciente">Apellidos</label>
          <input
            id="apellidos_paciente"
            type="text"
            value={formData.apellidos_paciente}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>

        {/* Fecha de Nacimiento */}
        <div className={styles.inputWrapper}>
          <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
          <input
            id="fecha_nacimiento"
            type="date"
            value={formData.fecha_nacimiento}
            onChange={handleFechaNacimiento}
            disabled={cargando}
          />
        </div>

        {/* Edad (se calcula automáticamente) */}
        <div className={styles.inputWrapper}>
          <label htmlFor="edad">Edad</label>
          <input
            id="edad"
            type="number"
            value={formData.edad}
            readOnly
            disabled
            className={styles.disabledInput}
          />
        </div>

        {/* Dirección */}
        <div className={styles.inputWrapper}>
          <label htmlFor="direccion_paciente">Dirección</label>
          <textarea
            id="direccion_paciente"
            rows={5}
            value={formData.direccion_paciente}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>
      </fieldset>

      {/* === DATOS DEL MÉDICO === */}
      <fieldset>
        <legend>Datos del Médico</legend>

        {/* Cédula del Médico */}
        <div className={styles.inputWrapper}>
          <label htmlFor="cedula_medico">Cédula</label>
          <select
            id="cedula_medico"
            onChange={handleMedicoChange}
            value={formData.cedula_medico}
            disabled={cargando}
          >
            <option value="">...</option>
            {medicos.map((medico) => (
              <option key={medico.cedula_medico} value={medico.cedula_medico}>
                {medico.cedula_medico}
              </option>
            ))}
          </select>
        </div>

        {/* Nombre completo del Médico (solo para referencia del usuario) */}
        <div className={styles.inputWrapper}>
          <label htmlFor="nombre_medico">Nombres</label>
          <input
            id="nombre_medico"
            className={styles.disabledInput}
            type="text"
            value={getMedicoNombre()}
            disabled
          />
        </div>
      </fieldset>

      {/* === DATOS DE LA HISTORIA === */}
      <fieldset>
        <legend>Datos de la Historia Médica</legend>

        <div className={styles.inputWrapper}>
          <label htmlFor="fecha_ingreso">Fecha de Ingreso</label>
          <input
            id="fecha_ingreso"
            type="date"
            value={formData.fecha_ingreso}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="fecha_egreso">Fecha de Egreso</label>
          <input
            id="fecha_egreso"
            type="date"
            value={formData.fecha_egreso}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="cirugia">Cirugía</label>
          <select
            id="cirugia"
            onChange={handleCirugiaChange}
            value={formData.cirugia}
            disabled={cargando}
          >
            <option value="NO">No</option>
            <option value="SI">Si</option>
          </select>
        </div>

        {mostrarTipoCirugia && (
          <div className={styles.inputWrapper}>
            <label htmlFor="tipo_cirugia">Tipo de Cirugía</label>
            <select
              id="tipo_cirugia"
              value={formData.tipo_cirugia}
              onChange={handleInputChange}
              disabled={cargando}
            >
              <option value="">...</option>
              <option value="HOSPITALIZACION">HOSPITALIZACION</option>
              <option value="PLAN CRG">PLAN CRG</option>
              <option value="PLAN URL">PLAN URL</option>
              <option value="PLAN OFT">PLAN OFT</option>
            </select>
          </div>
        )}

        <div className={styles.inputWrapper}>
          <label htmlFor="diagnostico">Diagnóstico</label>
          <textarea
            id="diagnostico"
            rows={5}
            value={formData.diagnostico}
            onChange={handleInputChange}
            disabled={cargando}
          />
        </div>
      </fieldset>

      {/* === BOTONES DE ACCIÓN === */}
      <div className={styles.buttonWrapper}>
        <button type="submit" className={styles.saveButton} disabled={cargando}>
          {cargando ? "Guardando..." : "Registrar"}
        </button>
        <button
          onClick={() => navigate("/facturas")}
          type="button"
          className={styles.cancelButton}
          disabled={cargando}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
