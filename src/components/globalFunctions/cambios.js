const { createClient } = require("@supabase/supabase-js");

// Configura tu Supabase con URL y Key
const supabaseUrl = "https://lwuooleghpdcgnmgubdt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dW9vbGVnaHBkY2dubWd1YmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1NTY3MjEsImV4cCI6MjAyMjEzMjcyMX0.dlXYpSUceF_4y1l-TXE6FZ5gsbSTxw_7XfXEk28C5Sk";
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProducts() {
  try {
    console.log("Cargando categorías...");
    // Obtener todas las categorías
    const { data: categorias, error: categoriasError } = await supabase
      .from("categorias")
      .select("id, name"); // id (UUID) y name (nombre de la categoría)

    if (categoriasError) {
      throw new Error(
        `Error obteniendo categorías: ${categoriasError.message}`
      );
    }

    console.log(`Se encontraron ${categorias.length} categorías.`);

    console.log("Cargando productos...");
    // Obtener todos los productos
    const { data: products, error: productsError } = await supabase
      .from("Products")
      .select("id, caja"); // id del producto y caja (nombre de la categoría actual)

    if (productsError) {
      throw new Error(`Error obteniendo productos: ${productsError.message}`);
    }

    console.log(`Se encontraron ${products.length} productos.`);

    // Crear un mapa de categorías por nombre para búsqueda rápida
    const categoryMap = categorias.reduce((map, category) => {
      map[category.name] = category.id; // Relacionar name con id
      return map;
    }, {});

    // Actualizar productos uno por uno o por lotes pequeños
    const batchSize = 50; // Lotes pequeños para evitar conflictos
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);

      // Realizar las actualizaciones
      for (const product of batch) {
        const newCaja = categoryMap[product.caja]; // Buscar el UUID correspondiente al nombre en caja
        if (newCaja) {
          const { error: updateError } = await supabase
            .from("Products")
            .update({ caja: newCaja })
            .eq("id", product.id); // Identificar la fila por ID

          if (updateError) {
            console.error(
              `Error actualizando producto con ID ${product.id}: ${updateError.message}`
            );
          } else {
            console.log(
              `Producto con ID ${product.id} actualizado correctamente.`
            );
          }
        } else {
          console.warn(
            `No se encontró categoría para el producto con ID ${product.id} y caja "${product.caja}".`
          );
        }
      }
    }

    console.log("Actualización completada.");
  } catch (error) {
    console.error("Error ejecutando el script:", error.message);
  }
}

// Ejecutar el script
updateProducts();
