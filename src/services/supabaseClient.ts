const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Faltan variables de entorno de Supabase");
}

export const supabaseRequest = async (
  endpoint: string,
  options: RequestInit = {},
) => {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Error ${response.status}: ${response.statusText} - ${JSON.stringify(errorData)}`,
      );
    }

    // Si es un DELETE o no hay contenido, retornar vacío
    if (response.status === 204) {
      return {};
    }

    return response.json();
  } catch (error) {
    console.error("Error en petición a Supabase:", error);
    throw error;
  }
};
