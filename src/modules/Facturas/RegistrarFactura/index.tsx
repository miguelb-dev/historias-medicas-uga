import { useNavigate } from "react-router-dom";
import styles from "./RegistrarFactura.module.css";
import { useState, useEffect } from "react";

/* Funciones para la conexión con la BBDD */
import {
  buscarPaciente,
  buscarHistoria,
  obtenerMedicos,
  guardarPaciente,
  guardarHistoria,
  guardarFactura,
  obtenerEmpresas,
  obtenerSeguros,
  guardarEmpresa,
  guardarSeguro,
  verificarFacturaExistente,
  verificarCodigoControlExistente,
  verificarPacienteExistente,
} from "../../../services/Facturas/registrarFacturaService";

interface Medico {
  cedula_medico: number;
  nombres: string;
  apellidos: string;
}

interface Empresa {
  id_empresa: number;
  nombre: string;
}

interface Seguro {
  id_seguro: number;
  nombre: string;
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

    // ID de Historia (para buscar)
    id_historia_buscar: "",

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
    plan: "",
  });

  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [seguros, setSeguros] = useState<Seguro[]>([]);
  const [pacienteEncontrado, setPacienteEncontrado] = useState<any>(null);
  const [historiaEncontrada, setHistoriaEncontrada] = useState<any>(null);
  const [mostrarMotivo, setMostrarMotivo] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [buscandoPaciente, setBuscandoPaciente] = useState(false);
  const [buscandoHistoria, setBuscandoHistoria] = useState(false);
  const [validando, setValidando] = useState(false);

  // Estados para controlar mensajes de búsqueda
  const [busquedaPacienteRealizada, setBusquedaPacienteRealizada] =
    useState(false);
  const [busquedaHistoriaRealizada, setBusquedaHistoriaRealizada] =
    useState(false);

  // Estado para controlar el tipo de input de Titular
  const [tipoInputTitular, setTipoInputTitular] = useState<"select" | "input">(
    "input",
  );
  const [titularSeleccionado, setTitularSeleccionado] = useState<string>("");
  const [titularInput, setTitularInput] = useState<string>("");

  // Cargar médicos, empresas y seguros al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      const listaMedicos = await obtenerMedicos();
      setMedicos(listaMedicos);

      const listaEmpresas = await obtenerEmpresas();
      setEmpresas(listaEmpresas);

      const listaSeguros = await obtenerSeguros();
      setSeguros(listaSeguros);
    };
    cargarDatos();
  }, []);

  // Manejar cambio en Tipo de Ingreso
  const handleTipoIngresoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, tipo_ingreso: value, titular: "" }));

    // Resetear estados de titular
    setTitularSeleccionado("");
    setTitularInput("");

    // Determinar qué mostrar en Titular
    if (value === "EMPRESA" || value === "SEGURO") {
      setTipoInputTitular("select");
    } else {
      setTipoInputTitular("input");
    }
  };

  // Manejar cambio en Titular (select)
  const handleTitularSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;
    setTitularSeleccionado(value);
    setFormData((prev) => ({ ...prev, titular: value }));
  };

  // Manejar cambio en Titular (input)
  const handleTitularInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitularInput(value);
    setFormData((prev) => ({ ...prev, titular: value }));
  };

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
    setBusquedaPacienteRealizada(false);
    const paciente = await buscarPaciente(formData.cedula_paciente);
    setBuscandoPaciente(false);
    setBusquedaPacienteRealizada(true);

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

  // Limpiar datos del paciente
  const handleLimpiarPaciente = () => {
    setPacienteEncontrado(null);
    setBusquedaPacienteRealizada(false);
    setFormData((prev) => ({
      ...prev,
      cedula_paciente: "",
      nombres_paciente: "",
      apellidos_paciente: "",
      fecha_nacimiento: "",
      edad: 0,
      direccion_paciente: "",
    }));
  };

  // Buscar historia médica
  const handleBuscarHistoria = async () => {
    if (!formData.id_historia_buscar) {
      alert("Ingresa un ID de historia");
      return;
    }

    setBuscandoHistoria(true);
    setBusquedaHistoriaRealizada(false);
    const historia = await buscarHistoria(formData.id_historia_buscar);
    setBuscandoHistoria(false);
    setBusquedaHistoriaRealizada(true);

    if (historia) {
      setHistoriaEncontrada(historia);

      // Cargar datos de la historia encontrada
      setFormData((prev) => ({
        ...prev,
        fecha_ingreso: historia.fecha_ingreso || "",
        fecha_egreso: historia.fecha_egreso || "",
        diagnostico: historia.diagnostico || "",
        cirugia: historia.cirugia || "NO",
        plan: historia.plan || "",
        cedula_medico: historia.cedula_medico?.toString() || "",
        // Cargar datos del paciente asociado
        cedula_paciente: historia.cedula_paciente?.toString() || "",
        nombres_paciente: historia.paciente?.nombres || "",
        apellidos_paciente: historia.paciente?.apellidos || "",
        fecha_nacimiento: historia.paciente?.fecha_nacimiento || "",
        edad: historia.paciente?.edad || 0,
        direccion_paciente: historia.paciente?.direccion || "",
      }));

      // Marcar paciente como encontrado
      if (historia.paciente) {
        setPacienteEncontrado(historia.paciente);
      }
    } else {
      setHistoriaEncontrada(null);
    }
  };

  // Limpiar datos de la historia
  const handleLimpiarHistoria = () => {
    setHistoriaEncontrada(null);
    setBusquedaHistoriaRealizada(false);
    setFormData((prev) => ({
      ...prev,
      id_historia_buscar: "",
      fecha_ingreso: "",
      fecha_egreso: "",
      diagnostico: "",
      cirugia: "NO",
      plan: "",
      cedula_medico: "",
      // También limpiamos los datos del paciente que se cargaron
      cedula_paciente: "",
      nombres_paciente: "",
      apellidos_paciente: "",
      fecha_nacimiento: "",
      edad: 0,
      direccion_paciente: "",
    }));
    setPacienteEncontrado(null);
    setBusquedaPacienteRealizada(false);
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
  const validarFormulario = async () => {
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

    // === NUEVA VALIDACIÓN: Si hay paciente, debe haber médico ===
    if (formData.cedula_paciente && !formData.cedula_medico) {
      alert("Si registras un paciente, debes seleccionar un médico");
      return false;
    }

    // === VALIDACIONES DE UNICIDAD ===

    // 1. Verificar que el código de factura no exista
    const facturaExiste = await verificarFacturaExistente(formData.id_factura);
    if (facturaExiste) {
      alert(
        `El código de factura "${formData.id_factura}" ya está registrado.`,
      );
      return false;
    }

    // 2. Verificar que el código de control no exista
    const codigoControlExiste = await verificarCodigoControlExistente(
      formData.codigo_control,
    );
    if (codigoControlExiste) {
      alert(
        `El código de control "${formData.codigo_control}" ya está registrado.`,
      );
      return false;
    }

    // 3. Si hay cédula de paciente y NO está en el sistema, verificar que no exista
    if (formData.cedula_paciente && !pacienteEncontrado) {
      const pacienteExiste = await verificarPacienteExistente(
        formData.cedula_paciente,
      );
      if (pacienteExiste) {
        alert(
          `La cédula "${formData.cedula_paciente}" ya está registrada. Por favor, busca el paciente existente.`,
        );
        return false;
      }
    }

    // Si hay cédula de paciente pero NO existe en el sistema, validar que tenga nombre y apellido
    if (formData.cedula_paciente && !pacienteEncontrado) {
      if (!formData.nombres_paciente || !formData.apellidos_paciente) {
        alert(
          "Si vas a registrar un paciente nuevo, completa sus Nombres y Apellidos",
        );
        return false;
      }
    }

    return true;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulario (ahora es asíncrono)
    setValidando(true);
    const esValido = await validarFormulario();
    setValidando(false);
    if (!esValido) {
      return;
    }

    setCargando(true);

    try {
      let historiaId = null;
      let idEmpresa = null;
      let idSeguro = null;
      let nuevoTitular = null;

      // Procesar el titular según el tipo de ingreso
      if (formData.tipo_ingreso === "EMPRESA") {
        if (titularSeleccionado) {
          const empresa = empresas.find(
            (e) => e.nombre === titularSeleccionado,
          );
          if (empresa) {
            idEmpresa = empresa.id_empresa;
          }
        }
      } else if (formData.tipo_ingreso === "SEGURO") {
        if (titularSeleccionado) {
          const seguro = seguros.find((s) => s.nombre === titularSeleccionado);
          if (seguro) {
            idSeguro = seguro.id_seguro;
          }
        }
      } else if (formData.tipo_ingreso === "NUEVA EMPRESA") {
        if (titularInput) {
          const nuevaEmpresa = await guardarEmpresa(titularInput);
          if (nuevaEmpresa) {
            idEmpresa = nuevaEmpresa.id_empresa;
            const listaEmpresas = await obtenerEmpresas();
            setEmpresas(listaEmpresas);
          }
          nuevoTitular = titularInput;
        }
      } else if (formData.tipo_ingreso === "NUEVO SEGURO") {
        if (titularInput) {
          const nuevoSeguro = await guardarSeguro(titularInput);
          if (nuevoSeguro) {
            idSeguro = nuevoSeguro.id_seguro;
            const listaSeguros = await obtenerSeguros();
            setSeguros(listaSeguros);
          }
          nuevoTitular = titularInput;
        }
      } else if (formData.tipo_ingreso === "PARTICULAR") {
        nuevoTitular = titularInput;
      }

      // 1. Si HAY ID de historia para buscar y se encontró, usar ese ID
      if (formData.id_historia_buscar && historiaEncontrada) {
        historiaId = Number(formData.id_historia_buscar);
      }
      // 2. Si NO se encontró historia o no se buscó, crear una nueva
      else if (formData.cedula_paciente) {
        // 2a. Si el paciente no existe, guardarlo
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

        // 2b. Guardar historia médica
        const historiaData = {
          cedula_medico: formData.cedula_medico
            ? Number(formData.cedula_medico)
            : null,
          cedula_paciente: Number(formData.cedula_paciente),
          fecha_ingreso: formData.fecha_ingreso || null,
          fecha_egreso: formData.fecha_egreso || null,
          diagnostico: formData.diagnostico || null,
          cirugia: formData.cirugia,
          plan: formData.plan || null,
        };

        const resultadoHistoria = await guardarHistoria(historiaData);
        historiaId = resultadoHistoria.id_historia;
      }

      // 3. Guardar factura (SIEMPRE)
      const facturaData = {
        id_factura: formData.id_factura,
        id_historia: historiaId,
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
        id_empresa: idEmpresa,
        id_seguro: idSeguro,
        nuevo_titular: nuevoTitular,
      };

      await guardarFactura(facturaData);

      // === MENSAJE DE ÉXITO CON EL ID DE LA HISTORIA ===
      let mensajeExito = "¡Factura registrada exitosamente!";

      // Si se creó una nueva historia
      if (historiaId && !formData.id_historia_buscar) {
        mensajeExito += `\n\n📋 Historia Médica N°: ${historiaId}`;
      }
      // Si se usó una historia existente
      else if (formData.id_historia_buscar && historiaEncontrada) {
        mensajeExito += `\n\n📋 Historia Médica N°: ${historiaEncontrada.id_historia}`;
      }
      // Si no hay historia asociada
      else {
        mensajeExito += `\n\n📋 Sin Historia Médica asociada`;
      }

      alert(mensajeExito);
      navigate("/facturas");
    } catch (error: any) {
      console.error("Error al guardar:", error);
      alert(`Error al guardar la factura: ${error.message}`);
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
            disabled={cargando || validando}
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
            disabled={cargando || validando}
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
            disabled={cargando || validando}
          />
        </div>

        {/* Tipo de Ingreso */}
        <div className={styles.inputWrapper}>
          <label htmlFor="tipo_ingreso">Tipo de Ingreso</label>
          <select
            id="tipo_ingreso"
            value={formData.tipo_ingreso}
            onChange={handleTipoIngresoChange}
            disabled={cargando || validando}
          >
            <option value="">...</option>
            <option value="EMPRESA">Empresa</option>
            <option value="SEGURO">Seguro</option>
            <option value="PARTICULAR">Particular</option>
            <option value="NUEVA EMPRESA">Nueva Empresa</option>
            <option value="NUEVO SEGURO">Nuevo Seguro</option>
          </select>
        </div>

        {/* Titular */}
        <div className={styles.inputWrapper}>
          <label htmlFor="titular">Titular</label>
          {tipoInputTitular === "select" ? (
            <select
              id="titular"
              value={titularSeleccionado}
              onChange={handleTitularSelectChange}
              disabled={cargando || validando}
            >
              <option value="">Seleccionar...</option>
              {formData.tipo_ingreso === "EMPRESA" &&
                empresas.map((empresa) => (
                  <option key={empresa.id_empresa} value={empresa.nombre}>
                    {empresa.nombre}
                  </option>
                ))}
              {formData.tipo_ingreso === "SEGURO" &&
                seguros.map((seguro) => (
                  <option key={seguro.id_seguro} value={seguro.nombre}>
                    {seguro.nombre}
                  </option>
                ))}
            </select>
          ) : (
            <input
              id="titular"
              type="text"
              value={titularInput}
              onChange={handleTitularInputChange}
              disabled={cargando || validando}
            />
          )}
        </div>

        {/* Forma de Pago */}
        <div className={styles.inputWrapper}>
          <label htmlFor="forma_pago">Forma de Pago</label>
          <select
            id="forma_pago"
            value={formData.forma_pago}
            onChange={handleInputChange}
            disabled={cargando || validando}
          >
            <option value="">...</option>
            <option value="EMPRESA">Empresa</option>
            <option value="SEGURO">Seguro</option>
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
            value={formData.suministros_hospitalarios}
            onChange={handleInputChange}
            disabled={cargando || validando}
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
            value={formData.servicios_cobrables}
            onChange={handleInputChange}
            disabled={cargando || validando}
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
            value={formData.medicamentos}
            onChange={handleInputChange}
            disabled={cargando || validando}
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
            value={formData.honorarios_medicos_y_servicios_auxiliares}
            onChange={handleInputChange}
            disabled={cargando || validando}
          />
        </div>

        {/* Tasa del dolar BCV */}
        <div className={styles.inputWrapper}>
          <label htmlFor="tasa_dolar_bcv">Tasa Dólar BCV</label>
          <input
            id="tasa_dolar_bcv"
            type="text"
            value={formData.tasa_dolar_bcv}
            onChange={handleInputChange}
            disabled={cargando || validando}
          />
        </div>

        {/* Estatus */}
        <div className={styles.inputWrapper}>
          <label htmlFor="estatus">Estatus</label>
          <select
            id="estatus"
            onChange={handleEstatusChange}
            value={formData.estatus}
            disabled={cargando || validando}
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
              disabled={cargando || validando}
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
          <div className={styles.search}>
            <input
              id="cedula_paciente"
              type="text"
              value={formData.cedula_paciente}
              onChange={handleInputChange}
              disabled={
                cargando ||
                validando ||
                buscandoPaciente ||
                !!historiaEncontrada
              }
            />
            {/* Mostrar resultado de búsqueda*/}
            {busquedaPacienteRealizada && !buscandoPaciente && (
              <>
                {pacienteEncontrado ? (
                  <div className={styles.recordFound}>
                    <p>✅ Paciente encontrado</p>
                  </div>
                ) : (
                  <div className={styles.warning}>
                    <p>⚠️ Paciente no encontrado</p>
                    <p>Se creará uno nuevo</p>
                  </div>
                )}
              </>
            )}
            <button
              className={styles.searchButton}
              type="button"
              onClick={handleBuscarPaciente}
              disabled={
                cargando ||
                validando ||
                buscandoPaciente ||
                !formData.cedula_paciente ||
                !!historiaEncontrada
              }
            >
              {buscandoPaciente ? "Buscando..." : "Buscar"}
            </button>
            <button
              className={styles.clearButton}
              type="button"
              onClick={handleLimpiarPaciente}
              disabled={cargando || validando || !!historiaEncontrada}
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Nombres del Paciente */}
        <div className={styles.inputWrapper}>
          <label htmlFor="nombres_paciente">Nombres</label>
          <input
            id="nombres_paciente"
            type="text"
            value={formData.nombres_paciente}
            onChange={handleInputChange}
            disabled={cargando || validando || !!historiaEncontrada}
            placeholder={historiaEncontrada ? "Cargado de la historia" : ""}
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
            disabled={cargando || validando || !!historiaEncontrada}
            placeholder={historiaEncontrada ? "Cargado de la historia" : ""}
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
            disabled={cargando || validando || !!historiaEncontrada}
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
            disabled={cargando || validando || !!historiaEncontrada}
            placeholder={historiaEncontrada ? "Cargado de la historia" : ""}
          />
        </div>
      </fieldset>

      {/* === DATOS DEL MÉDICO === */}
      <fieldset>
        <legend>Datos del Médico </legend>

        {/* Cédula del Médico */}
        <div className={styles.inputWrapper}>
          <label htmlFor="cedula_medico">Cédula</label>
          <select
            id="cedula_medico"
            onChange={handleMedicoChange}
            value={formData.cedula_medico}
            disabled={cargando || validando || !!historiaEncontrada}
          >
            <option value="">
              {historiaEncontrada ? "Cargado de la historia" : "..."}
            </option>
            {!historiaEncontrada &&
              medicos.map((medico) => (
                <option key={medico.cedula_medico} value={medico.cedula_medico}>
                  {medico.cedula_medico}
                </option>
              ))}
          </select>
        </div>

        {/* Nombre completo del Médico */}
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

        {/* Buscador de Historia */}
        <div className={styles.inputWrapper}>
          <label htmlFor="id_historia_buscar">
            Asignar Historia (Opcional)
          </label>
          <div className={styles.search}>
            <input
              id="id_historia_buscar"
              type="text"
              value={formData.id_historia_buscar}
              onChange={handleInputChange}
              disabled={cargando || validando || buscandoHistoria}
            />
            {/* Mensaje de aclaración para el usuario */}
            <div className={styles.warning}>
              <p>
                ⚠️ Rellenar este campo solo si es una factura para una Historia
                Médica existente. De lo contrario, dejar en blanco.
              </p>
            </div>

            {/* Mostrar resultado de la búsqueda */}
            {busquedaHistoriaRealizada && !buscandoHistoria && (
              <>
                {historiaEncontrada ? (
                  <div className={styles.recordFound}>
                    <p>✅ Historia Médica encontrada</p>
                  </div>
                ) : (
                  <div className={styles.warning}>
                    <p>⚠️ Historia Médica no econtrada.</p>
                    <p>Se creará una nueva.</p>
                  </div>
                )}
              </>
            )}
            <button
              className={styles.searchButton}
              type="button"
              onClick={handleBuscarHistoria}
              disabled={
                cargando ||
                validando ||
                buscandoHistoria ||
                !formData.id_historia_buscar
              }
            >
              {buscandoHistoria ? "Buscando..." : "Buscar"}
            </button>
            <button
              className={styles.clearButton}
              type="button"
              onClick={handleLimpiarHistoria}
              disabled={cargando || validando}
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Fecha de Ingreso */}
        <div className={styles.inputWrapper}>
          <label htmlFor="fecha_ingreso">Fecha de Ingreso</label>
          <input
            id="fecha_ingreso"
            type="date"
            value={formData.fecha_ingreso}
            onChange={handleInputChange}
            disabled={cargando || validando || !!historiaEncontrada}
          />
        </div>

        {/* Fecha de Egreso */}
        <div className={styles.inputWrapper}>
          <label htmlFor="fecha_egreso">Fecha de Egreso</label>
          <input
            id="fecha_egreso"
            type="date"
            value={formData.fecha_egreso}
            onChange={handleInputChange}
            disabled={cargando || validando || !!historiaEncontrada}
          />
        </div>

        {/* Cirugía */}
        <div className={styles.inputWrapper}>
          <label htmlFor="cirugia">Cirugía</label>
          <select
            id="cirugia"
            onChange={handleInputChange}
            value={formData.cirugia}
            disabled={cargando || validando || !!historiaEncontrada}
          >
            <option value="NO">No</option>
            <option value="SI">Si</option>
          </select>
        </div>

        {/* Plan */}
        <div className={styles.inputWrapper}>
          <label htmlFor="plan">Plan</label>
          <select
            id="plan"
            value={formData.plan}
            onChange={handleInputChange}
            disabled={cargando || validando || !!historiaEncontrada}
          >
            <option value="">...</option>
            <option value="HOSPITALIZACION">HOSPITALIZACION</option>
            <option value="CASO SOCIAL">CASO SOCIAL</option>
            <option value="MATERNIDAD">MATERNIDAD</option>
            <option value="CIRUGIA GENERAL">CIRUGIA GENERAL</option>
            <option value="CIRUGIA PEDIATRICA">CIRUGIA PEDIATRICA</option>
            <option value="UROLOGIA">UROLOGIA</option>
            <option value="OFTALMOLOGIA">OFTALMOLOGIA</option>
          </select>
        </div>

        {/* Diagnóstico */}
        <div className={styles.inputWrapper}>
          <label htmlFor="diagnostico">Diagnóstico</label>
          <textarea
            id="diagnostico"
            rows={5}
            value={formData.diagnostico}
            onChange={handleInputChange}
            disabled={cargando || validando || !!historiaEncontrada}
          />
        </div>
      </fieldset>

      {/* === BOTONES DE ACCIÓN === */}
      <div className={styles.buttonWrapper}>
        <button
          type="submit"
          className={styles.saveButton}
          disabled={cargando || validando}
        >
          {cargando ? "Guardando..." : validando ? "Validando..." : "Registrar"}
        </button>
        <button
          onClick={() => navigate("/facturas")}
          type="button"
          className={styles.cancelButton}
          disabled={cargando || validando}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
