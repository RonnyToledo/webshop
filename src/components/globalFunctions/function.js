export const transitionVariants = {
  hidden: { opacity: 0, y: -100 }, // Más pequeño y se desliza desde arriba
  enter: { opacity: 1, y: 0 }, // Aparece a tamaño normal y posición
  exit: { opacity: 0, y: 100 }, // Desaparece hacia abajo y se hace más pequeño
};

export const Promedio = (array, campo) => {
  if (array?.length > 0) {
    const total = array.reduce((acc, obj) => acc + (obj[campo] || 0), 0);
    return total / array.length;
  }
  return 0;
};

export const generateSchedule = (inputArray) => {
  const today = new Date();
  const currentDay = today.getDay(); // Día de la semana (0: domingo, 6: sábado)

  // Genera los horarios comenzando desde el día actual
  const horarios = inputArray.map((item, index) => {
    const dayOffset = (index + 7 - currentDay) % 7; // Offset desde el día actual
    const day = new Date(today);
    day.setDate(today.getDate() + dayOffset); // Ajuste al día correcto

    const apertura = new Date(day);
    const cierre = new Date(day);

    // Configura la hora de apertura
    if (item.apertura === 24) {
      apertura.setHours(0, 0, 0, 0); // Medianoche
    } else {
      apertura.setHours(item.apertura, 0, 0, 0);
    }

    // Configura la hora de cierre
    if (item.cierre === 24) {
      cierre.setHours(0, 0, 0, 0);
      cierre.setDate(cierre.getDate() + 1); // Cierra al día siguiente
    } else if (item.cierre < item.apertura) {
      cierre.setHours(item.cierre, 0, 0, 0);
      cierre.setDate(cierre.getDate() + 1); // Cierra al día siguiente si el cierre es más temprano
    } else {
      cierre.setHours(item.cierre, 0, 0, 0);
    }

    return {
      dia: item.dia, // Mantén el nombre del día según el input
      apertura: apertura,
      cierre: cierre,
    };
  });

  // Devuelve los horarios organizados a partir de hoy
  return horarios;
};
export function ExtraerCategorias(store, products) {
  const categoriasProductos = new Set(products.map((prod) => prod.caja));
  return store.categoria.filter((cat) => categoriasProductos.has(cat));
}
