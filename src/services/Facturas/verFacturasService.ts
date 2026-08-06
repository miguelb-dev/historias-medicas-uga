import { supabaseRequest } from "../supabaseClient";

export interface Factura {
  id_factura: string;
  id_historia: number | null;
  id_empresa: number | null;
  id_seguro: number | null;
  nuevo_titular: string | null;
  codigo_control: string;
  fecha_emision: string;
  titular: string;
  tipo_ingreso: "EMPRESA" | "PARTICULAR" | "SEGURO";
  forma_pago: "EMPRESA" | "PARTICULAR" | "SEGURO";
  suministros_hospitalarios: number;
  servicios_cobrables: number;
  medicamentos: number;
  honorarios_medicos_y_servicios_auxiliares: number;
  tasa_dolar_bcv: number;
  estatus: "PROCESADA" | "ANULADA" | "NOTA DE CREDITO";
  motivo: string | null;
  empresa?: {
    id_empresa: number;
    nombre: string;
    ruc: string;
  };
  seguro?: {
    id_seguro: number;
    nombre: string;
    tipo: string;
  };
  historia?: {
    id_historia: number;
    fecha_ingreso: string;
    fecha_egreso: string;
    diagnostico: string;
    cirugia: string;
    plan: string;
    cedula_medico: number;
    medico?: {
      cedula_medico: number;
      nombres: string;
      apellidos: string;
    };
    paciente?: {
      cedula_paciente: number;
      nombres: string;
      apellidos: string;
      fecha_nacimiento: string;
      edad: number;
      direccion: string;
    };
  };
}

export interface FacturaFilters {
  searchCriterion?: "id_factura" | "id_historia" | "cedula_paciente";
  searchValue?: string;
  estatus?: ("PROCESADA" | "ANULADA" | "NOTA DE CREDITO")[];
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export const facturaService = {
  async getFacturas(
    filters: FacturaFilters = {},
  ): Promise<{ data: Factura[]; total: number }> {
    const {
      searchCriterion,
      searchValue,
      estatus = [],
      sortOrder = "desc",
      limit = 50,
      offset = 0,
    } = filters;

    // Construir la URL manualmente para tener más control
    let url = `factura?select=id_factura,id_historia,id_empresa,id_seguro,nuevo_titular,codigo_control,fecha_emision,titular,tipo_ingreso,forma_pago,suministros_hospitalarios,servicios_cobrables,medicamentos,honorarios_medicos_y_servicios_auxiliares,tasa_dolar_bcv,estatus,motivo,empresa(id_empresa,nombre,ruc),seguro(id_seguro,nombre,tipo),historia(id_historia,fecha_ingreso,fecha_egreso,diagnostico,cirugia,plan,cedula_medico,medico(cedula_medico,nombres,apellidos),paciente(cedula_paciente,nombres,apellidos,fecha_nacimiento,edad,direccion))`;

    const conditions = [];

    // Filtros de estatus
    if (estatus.length > 0) {
      const statusValues = estatus
        .map((s) => {
          if (s.includes(" ")) {
            return `"${s}"`;
          }
          return s;
        })
        .join(",");
      conditions.push(`estatus=in.(${statusValues})`);
    }

    // Búsqueda por criterio - COINCIDENCIA EXACTA (eq)
    if (searchCriterion && searchValue) {
      // Eliminar espacios en blanco al inicio y final
      const cleanValue = searchValue.trim();

      switch (searchCriterion) {
        case "id_factura":
          // id_factura es VARCHAR - búsqueda exacta con eq
          conditions.push(`id_factura=eq.${encodeURIComponent(cleanValue)}`);
          break;
        case "id_historia":
          // id_historia es INTEGER - validamos que sea número
          if (/^\d+$/.test(cleanValue)) {
            conditions.push(`id_historia=eq.${cleanValue}`);
          } else {
            // Si no es número, no agregamos condición (no encontrará nada)
            console.warn("El valor para id_historia debe ser un número");
          }
          break;
        case "cedula_paciente":
          // cedula_paciente es INTEGER - validamos que sea número
          if (/^\d+$/.test(cleanValue)) {
            conditions.push(
              `historia.paciente.cedula_paciente=eq.${cleanValue}`,
            );
          } else {
            // Si no es número, no agregamos condición (no encontrará nada)
            console.warn(
              "El valor para cédula del paciente debe ser un número",
            );
          }
          break;
      }
    }

    // Agregar condiciones a la URL
    if (conditions.length > 0) {
      url += `&${conditions.join("&")}`;
    }

    // Ordenamiento
    url += `&order=fecha_emision.${sortOrder}`;

    // Paginación
    url += `&limit=${limit}&offset=${offset}`;

    // Obtener datos con paginación
    const data = (await supabaseRequest(url)) as Factura[];

    // Obtener el total de registros
    let total = 0;
    try {
      let countUrl = `factura?select=count`;
      const countConditions = [];

      if (estatus.length > 0) {
        const statusValues = estatus
          .map((s) => {
            if (s.includes(" ")) {
              return `"${s}"`;
            }
            return s;
          })
          .join(",");
        countConditions.push(`estatus=in.(${statusValues})`);
      }

      if (searchCriterion && searchValue) {
        const cleanValue = searchValue.trim();

        switch (searchCriterion) {
          case "id_factura":
            countConditions.push(
              `id_factura=eq.${encodeURIComponent(cleanValue)}`,
            );
            break;
          case "id_historia":
            if (/^\d+$/.test(cleanValue)) {
              countConditions.push(`id_historia=eq.${cleanValue}`);
            }
            break;
          case "cedula_paciente":
            if (/^\d+$/.test(cleanValue)) {
              countConditions.push(
                `historia.paciente.cedula_paciente=eq.${cleanValue}`,
              );
            }
            break;
        }
      }

      if (countConditions.length > 0) {
        countUrl += `&${countConditions.join("&")}`;
      }

      const countResponse = await supabaseRequest(countUrl);
      if (Array.isArray(countResponse) && countResponse.length > 0) {
        total = (countResponse[0] as any)?.count || 0;
      }
    } catch (countError) {
      console.error("Error obteniendo el total:", countError);
      total = data.length;
    }

    return { data, total };
  },

  async getFacturasRango(filters: FacturaFilters = {}): Promise<Factura[]> {
    const {
      searchCriterion,
      searchValue,
      estatus = [],
      sortOrder = "desc",
      limit = 50,
      offset = 0,
    } = filters;

    let url = `factura?select=id_factura,id_historia,id_empresa,id_seguro,nuevo_titular,codigo_control,fecha_emision,titular,tipo_ingreso,forma_pago,suministros_hospitalarios,servicios_cobrables,medicamentos,honorarios_medicos_y_servicios_auxiliares,tasa_dolar_bcv,estatus,motivo,empresa(id_empresa,nombre,ruc),seguro(id_seguro,nombre,tipo),historia(id_historia,fecha_ingreso,fecha_egreso,diagnostico,cirugia,plan,cedula_medico,medico(cedula_medico,nombres,apellidos),paciente(cedula_paciente,nombres,apellidos,fecha_nacimiento,edad,direccion))`;

    const conditions = [];

    if (estatus.length > 0) {
      const statusValues = estatus
        .map((s) => {
          if (s.includes(" ")) {
            return `"${s}"`;
          }
          return s;
        })
        .join(",");
      conditions.push(`estatus=in.(${statusValues})`);
    }

    if (searchCriterion && searchValue) {
      const cleanValue = searchValue.trim();

      switch (searchCriterion) {
        case "id_factura":
          conditions.push(`id_factura=eq.${encodeURIComponent(cleanValue)}`);
          break;
        case "id_historia":
          if (/^\d+$/.test(cleanValue)) {
            conditions.push(`id_historia=eq.${cleanValue}`);
          }
          break;
        case "cedula_paciente":
          if (/^\d+$/.test(cleanValue)) {
            conditions.push(
              `historia.paciente.cedula_paciente=eq.${cleanValue}`,
            );
          }
          break;
      }
    }

    if (conditions.length > 0) {
      url += `&${conditions.join("&")}`;
    }

    url += `&order=fecha_emision.${sortOrder}`;
    url += `&limit=${limit}&offset=${offset}`;

    return supabaseRequest(url) as Promise<Factura[]>;
  },

  async countFacturas(
    filters: Omit<FacturaFilters, "limit" | "offset"> = {},
  ): Promise<number> {
    const { searchCriterion, searchValue, estatus = [] } = filters;

    let url = "factura?select=count";
    const conditions = [];

    if (estatus.length > 0) {
      const statusValues = estatus
        .map((s) => {
          if (s.includes(" ")) {
            return `"${s}"`;
          }
          return s;
        })
        .join(",");
      conditions.push(`estatus=in.(${statusValues})`);
    }

    if (searchCriterion && searchValue) {
      const cleanValue = searchValue.trim();

      switch (searchCriterion) {
        case "id_factura":
          conditions.push(`id_factura=eq.${encodeURIComponent(cleanValue)}`);
          break;
        case "id_historia":
          if (/^\d+$/.test(cleanValue)) {
            conditions.push(`id_historia=eq.${cleanValue}`);
          }
          break;
        case "cedula_paciente":
          if (/^\d+$/.test(cleanValue)) {
            conditions.push(
              `historia.paciente.cedula_paciente=eq.${cleanValue}`,
            );
          }
          break;
      }
    }

    if (conditions.length > 0) {
      url += `&${conditions.join("&")}`;
    }

    const response = (await supabaseRequest(url)) as any[];
    return response[0]?.count || 0;
  },

  // Obtener una factura por ID (para edición)
  async getFacturaById(idFactura: string): Promise<Factura | null> {
    try {
      const url = `factura?select=id_factura,id_historia,id_empresa,id_seguro,nuevo_titular,codigo_control,fecha_emision,titular,tipo_ingreso,forma_pago,suministros_hospitalarios,servicios_cobrables,medicamentos,honorarios_medicos_y_servicios_auxiliares,tasa_dolar_bcv,estatus,motivo,empresa(id_empresa,nombre,ruc),seguro(id_seguro,nombre,tipo),historia(id_historia,fecha_ingreso,fecha_egreso,diagnostico,cirugia,plan,cedula_medico,medico(cedula_medico,nombres,apellidos),paciente(cedula_paciente,nombres,apellidos,fecha_nacimiento,edad,direccion))&id_factura=eq.${encodeURIComponent(idFactura)}`;

      const data = (await supabaseRequest(url)) as Factura[];
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Error obteniendo factura por ID:", error);
      return null;
    }
  },
};
