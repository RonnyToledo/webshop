export const transitionVariants = {
  hidden: { opacity: 0, filter: "blur(10px)" }, // Comienza pequeño y desenfocado
  enter: {
    opacity: 1,
    filter: "blur(0px)", // Se enfoca progresivamente
    transition: { duration: 0.6 },
  },
  exit: {
    opacity: 0,

    filter: "blur(10px)", // Desenfoque al desaparecer
    transition: { duration: 0.4 },
  },
};

// Desordena Arrays
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Calcula el promedio de un campo específico en un array de objetos
export const Promedio = (array, field) => {
  if (!array?.length) return 0;
  const total = array.reduce((acc, obj) => acc + (obj[field] || 0), 0);
  return total / array.length;
};

// Genera horarios a partir del día actual
export const generateSchedule = (inputArray) => {
  const today = new Date();
  const currentDay = today.getDay();
  return inputArray.map((item, index) => {
    const dayOffset = (index + 7 - currentDay) % 7;
    const day = new Date(today);
    day.setDate(today.getDate() + dayOffset);

    const apertura = configureTime(day, item.apertura);
    const cierre = configureTime(day, item.cierre, item.apertura);

    return {
      dia: item.dia,
      apertura,
      cierre,
    };
  });
};

// Configura la hora de apertura o cierre considerando posibles ajustes al día siguiente
const configureTime = (day, hour, apertura) => {
  const time = new Date(day);
  if (hour === 24) {
    time.setHours(0, 0, 0, 0);
    if (apertura !== undefined && apertura !== 24)
      time.setDate(time.getDate() + 1);
  } else {
    time.setHours(hour, 0, 0, 0);
    if (apertura !== undefined && hour < apertura)
      time.setDate(time.getDate() + 1);
  }
  return time;
};

// Extrae las categorías presentes en los productos de la tienda
export function ExtraerCategorias(categoria, products) {
  const productCategories = new Set(products.map((product) => product.caja));
  return categoria.filter((category) => productCategories.has(category.id));
}
