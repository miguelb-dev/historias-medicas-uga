import { supabaseRequest } from "./supabaseClient";

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

// Guardar historia médica
export const guardarHistoria = async (historia: any) => {
  try {
    const data = await supabaseRequest("historia", {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify(historia),
    });
    return data;
  } catch (error) {
    console.error("Error guardando historia:", error);
    throw error;
  }
};

// Guardar factura
export const guardarFactura = async (factura: any) => {
  try {
    // Función para formatear números
    const formatearNumero = (valor: any): number => {
      if (valor === null || valor === undefined || valor === "") return 0;
      const num = typeof valor === "string" ? parseFloat(valor) : valor;
      if (isNaN(num)) return 0;
      return Math.round(num * 10000) / 10000; // Redondear a 4 decimales
    };

    const facturaFormateada = {
      id_factura: factura.id_factura,
      id_historia: factura.id_historia,
      codigo_control: factura.codigo_control,
      fecha_emision: factura.fecha_emision,
      titular: factura.titular || null,
      tipo_ingreso: factura.tipo_ingreso,
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
      motivo: factura.motivo || null,
      nota_credito: null,
    };

    const data = await supabaseRequest("factura", {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify(facturaFormateada),
    });
    return data;
  } catch (error) {
    console.error("Error guardando factura:", error);
    throw error;
  }
};
