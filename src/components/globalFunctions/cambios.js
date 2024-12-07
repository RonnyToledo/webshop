const { createClient } = require("@supabase/supabase-js");

// Configura tu Supabase con URL y Key
const supabaseUrl = "https://lwuooleghpdcgnmgubdt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dW9vbGVnaHBkY2dubWd1YmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1NTY3MjEsImV4cCI6MjAyMjEzMjcyMX0.dlXYpSUceF_4y1l-TXE6FZ5gsbSTxw_7XfXEk28C5Sk";
const supabase = createClient(supabaseUrl, supabaseKey);

const procesarCategorias = async () => {
  try {
    // Obtener datos de la tabla 'Sitios'
    const { data: tiendaData, error: fetchError } = await supabase
      .from("Sitios")
      .select("*");

    if (fetchError) {
      throw new Error(
        `Error al obtener los datos de Sitios: ${fetchError.message}`
      );
    }

    // Procesar cada sitio
    for (const sitio of tiendaData) {
      const { UUID, categoria } = sitio;

      if (!UUID || !categoria) {
        console.warn(
          `El sitio con datos incompletos fue ignorado: ${sitio.UUID}`
        );
        continue;
      }

      // Parsear la categoría desde JSON
      let categorias;
      try {
        categorias = JSON.parse(categoria);
      } catch (parseError) {
        console.error(
          `Error al parsear la categoría para el sitio con UUID ${UUID}: ${parseError.message}`
        );
        continue;
      }

      // Insertar cada categoría en la tabla 'categoria' de forma secuencial
      for (let index = 0; index < categorias.length; index++) {
        const cat = categorias[index];
        const { error: insertError } = await supabase
          .from("categorias")
          .insert({
            name: cat,
            storeId: UUID,
            order: index, // Índice de la categoría
          });

        if (insertError) {
          console.error(
            `Error al insertar la categoría "${cat}" para el sitio con UUID ${UUID}: ${insertError.message}`
          );
        } else {
          console.log(
            `Categoría "${cat}" con índice ${index} insertada correctamente para el sitio con UUID ${UUID}.`
          );
        }
      }
    }

    console.log("Proceso completado.");
  } catch (error) {
    console.error(`Error general: ${error.message}`);
  }
};

// Ejecutar la función
procesarCategorias();
