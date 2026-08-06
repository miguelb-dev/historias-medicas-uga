// * Aunque este script se llame registrar..., sirve tanto para registrar como para editar facturas

import { supabaseRequest } from "../supabaseClient";

// ============================================
// FUNCIONES DE BÚSQUEDA
// ============================================

// Buscar paciente por cédula
export const buscarPaciente = async (cedula: string) => {
  try {
    const data = await supabaseRequest(
      `paciente?cedula_paciente=eq.${cedula}&select=*`,
    );
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error buscando paciente:", error);
    return null;
  }
};

// Buscar historia médica por ID
export const buscarHistoria = async (idHistoria: string) => {
  try {
    const data = await supabaseRequest(
      `historia?id_historia=eq.${idHistoria}&select=*,medico(cedula_medico,nombres,apellidos),paciente(cedula_paciente,nombres,apellidos,fecha_nacimiento,edad,direccion)`,
    );
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error buscando historia:", error);
    return null;
  }
};

// ============================================
// FUNCIONES PARA OBTENER LISTADOS
// ============================================

// Obtener todos los médicos activos
export const obtenerMedicos = async () => {
  try {
    const data = await supabaseRequest(
      "medico?select=cedula_medico,nombres,apellidos&estado_medico=eq.activo",
    );
    return data;
  } catch (error) {
    console.error("Error obteniendo médicos:", error);
    return [];
  }
};

// Obtener todas las empresas activas
export const obtenerEmpresas = async () => {
  try {
    const data = await supabaseRequest(
      "empresa?select=id_empresa,nombre&estado=eq.activo&order=nombre.asc",
    );
    return data;
  } catch (error) {
    console.error("Error obteniendo empresas:", error);
    return [];
  }
};

// Obtener todos los seguros activos
export const obtenerSeguros = async () => {
  try {
    const data = await supabaseRequest(
      "seguro?select=id_seguro,nombre&estado=eq.activo&order=nombre.asc",
    );
    return data;
  } catch (error) {
    console.error("Error obteniendo seguros:", error);
    return [];
  }
};

// ============================================
// FUNCIONES PARA GUARDAR (CREATE)
// ============================================

// Guardar nueva empresa
export const guardarEmpresa = async (nombre: string) => {
  try {
    const data = await supabaseRequest("empresa", {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        nombre: nombre.trim(),
        estado: "activo",
      }),
    });
    return data[0];
  } catch (error) {
    console.error("Error guardando empresa:", error);
    throw error;
  }
};

// Guardar nuevo seguro
export const guardarSeguro = async (nombre: string) => {
  try {
    const data = await supabaseRequest("seguro", {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        nombre: nombre.trim(),
        estado: "activo",
      }),
    });
    return data[0];
  } catch (error) {
    console.error("Error guardando seguro:", error);
    throw error;
  }
};

// Guardar paciente nuevo
export const guardarPaciente = async (paciente: any) => {
  try {
    const data = await supabaseRequest("paciente", {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        ...paciente,
        estado_paciente: "activo",
      }),
    });
    return data;
  } catch (error) {
    console.error("Error guardando paciente:", error);
    throw error;
  }
};

// ============================================
// FUNCIONES PARA ACTUALIZAR (UPDATE)
// ============================================

// Actualizar paciente existente
export const actualizarPaciente = async (cedula: number, datos: any) => {
  try {
    const data = await supabaseRequest(
      `paciente?cedula_paciente=eq.${cedula}`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify(datos),
      },
    );
    return data;
  } catch (error) {
    console.error("Error actualizando paciente:", error);
    throw error;
  }
};

// Guardar o actualizar historia médica (devuelve el ID)
export const guardarHistoria = async (historia: any) => {
  try {
    // Si tiene id_historia, es una ACTUALIZACIÓN (UPDATE)
    if (historia.id_historia) {
      const { id_historia, ...datosActualizar } = historia;

      const data = await supabaseRequest(
        `historia?id_historia=eq.${id_historia}`,
        {
          method: "PATCH",
          headers: {
            Prefer: "return=representation",
          },
          body: JSON.stringify(datosActualizar),
        },
      );
      return { data, id_historia };
    }
    // Si NO tiene id_historia, es una CREACIÓN (INSERT)
    else {
      const data = await supabaseRequest("historia", {
        method: "POST",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify(historia),
      });

      const idHistoria = data[0]?.id_historia || null;
      return { data, id_historia: idHistoria };
    }
  } catch (error) {
    console.error("Error guardando historia:", error);
    throw error;
  }
};

// Guardar o actualizar factura
export const guardarFactura = async (factura: any) => {
  try {
    // Función para formatear números
    const formatearNumero = (valor: any): number => {
      if (valor === null || valor === undefined || valor === "") return 0;
      const num = typeof valor === "string" ? parseFloat(valor) : valor;
      if (isNaN(num)) return 0;
      return Math.round(num * 10000) / 10000;
    };

    // Determinar el tipo_ingreso real para la BD
    let tipoIngreso = factura.tipo_ingreso;
    if (tipoIngreso === "NUEVA EMPRESA") {
      tipoIngreso = "EMPRESA";
    } else if (tipoIngreso === "NUEVO SEGURO") {
      tipoIngreso = "SEGURO";
    }

    // Preparar el objeto para guardar
    const facturaFormateada: any = {
      id_factura: factura.id_factura,
      id_historia: factura.id_historia || null,
      codigo_control: factura.codigo_control,
      fecha_emision: factura.fecha_emision,
      titular: factura.titular || null,
      tipo_ingreso: tipoIngreso,
      forma_pago: factura.forma_pago,
      suministros_hospitalarios: formatearNumero(
        factura.suministros_hospitalarios,
      ),
      servicios_cobrables: formatearNumero(factura.servicios_cobrables),
      medicamentos: formatearNumero(factura.medicamentos),
      honorarios_medicos_y_servicios_auxiliares: formatearNumero(
        factura.honorarios_medicos_y_servicios_auxiliares,
      ),
      tasa_dolar_bcv: formatearNumero(factura.tasa_dolar_bcv),
      estatus: factura.estatus,
      motivo: factura.estatus !== "PROCESADA" ? factura.motivo : null,
    };

    // IMPORTANTE: Siempre establecer id_empresa e id_seguro explícitamente
    if (tipoIngreso === "EMPRESA" && factura.id_empresa) {
      facturaFormateada.id_empresa = factura.id_empresa;
      facturaFormateada.id_seguro = null;
    } else if (tipoIngreso === "SEGURO" && factura.id_seguro) {
      facturaFormateada.id_seguro = factura.id_seguro;
      facturaFormateada.id_empresa = null;
    } else {
      facturaFormateada.id_empresa = null;
      facturaFormateada.id_seguro = null;
    }

    if (factura.nuevo_titular) {
      facturaFormateada.nuevo_titular = factura.nuevo_titular;
    } else {
      facturaFormateada.nuevo_titular = null;
    }

    // Verificar si la factura ya existe
    const facturaExistente = await supabaseRequest(
      `factura?id_factura=eq.${factura.id_factura}&select=id_factura`,
    );

    if (facturaExistente && facturaExistente.length > 0) {
      // ACTUALIZAR factura existente (PATCH)
      const data = await supabaseRequest(
        `factura?id_factura=eq.${factura.id_factura}`,
        {
          method: "PATCH",
          headers: {
            Prefer: "return=representation",
          },
          body: JSON.stringify(facturaFormateada),
        },
      );
      return data;
    } else {
      // CREAR nueva factura (POST)
      const data = await supabaseRequest("factura", {
        method: "POST",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify(facturaFormateada),
      });
      return data;
    }
  } catch (error) {
    console.error("Error guardando factura:", error);
    throw error;
  }
};

// ============================================
// FUNCIONES DE VALIDACIÓN DE UNICIDAD
// ============================================

// Verificar si una factura ya existe por ID
export const verificarFacturaExistente = async (idFactura: string) => {
  try {
    const data = await supabaseRequest(
      `factura?id_factura=eq.${encodeURIComponent(idFactura)}&select=id_factura`,
    );
    return data.length > 0;
  } catch (error) {
    console.error("Error verificando factura:", error);
    return false;
  }
};

// Verificar si un código de control ya existe
export const verificarCodigoControlExistente = async (
  codigoControl: string,
) => {
  try {
    const data = await supabaseRequest(
      `factura?codigo_control=eq.${encodeURIComponent(codigoControl)}&select=codigo_control`,
    );
    return data.length > 0;
  } catch (error) {
    console.error("Error verificando código de control:", error);
    return false;
  }
};

// Verificar si un paciente ya existe por cédula
export const verificarPacienteExistente = async (cedula: string) => {
  try {
    const data = await supabaseRequest(
      `paciente?cedula_paciente=eq.${cedula}&select=cedula_paciente`,
    );
    return data.length > 0;
  } catch (error) {
    console.error("Error verificando paciente:", error);
    return false;
  }
};
