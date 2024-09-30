const getTiendas = async () => {
  const data = await fetchData1(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Sitios?select=id,sitioweb`
  );
  return data.map((obj) => obj.sitioweb); // Ejemplo
};

module.exports = {
  siteUrl: "https://rh-menu.vercel.app",
  generateRobotsTxt: true, // Generar robots.txt automáticamente
  additionalPaths: async (config) => {
    const tiendas = await getTiendas();
    return tiendas.map((tienda) => ({
      loc: `/t/${tienda}`, // Ruta de la tienda
      lastmod: new Date().toISOString(),
    }));
  },
};

async function fetchData1(url) {
  try {
    const response = await fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      cache: "no-store",
    });
    // Verifica si la respuesta fue exitosa (código de estado 2xx)
    if (!response.ok) {
      // Si no fue exitosa, lanza un error con el código de estado
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Si la respuesta es exitosa, procesa los datos
    const data = await response.json();
    return data;
  } catch (error) {
    // Maneja cualquier error que ocurra durante la solicitud o el procesamiento
    console.error("Error fetching data:", error.message);
    throw error; // Lanza el error para manejarlo más arriba
  }
}
