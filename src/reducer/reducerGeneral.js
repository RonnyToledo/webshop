export const reducerStore = (state, action) => {
  switch (action.type) {
    case "Add":
      const value = {
        ...action.payload,
        products: organizarProductos(action?.payload?.products),
      };
      return value;
    case "ChangeCurrent":
      const a = JSON.parse(action.payload);
      return { ...state, moneda_default: a };
    case "AddCart":
      const c = JSON.parse(action.payload);
      const b = state.products.map((env) =>
        env.productId === c.productId ? c : env
      );
      return { ...state, products: b };

    case "Loader":
      return { ...state, loading: action.payload };
    case "Search":
      return { ...state, search: action.payload };
    case "Top":
      return { ...state, top: action.payload };
    case "animateCart":
      return { ...state, animateCart: action.payload };
    case "AddComent":
      return {
        ...state,
        comentTienda: [...state.comentTienda, ...action.payload],
      };
    case "AddComentProduct":
      return {
        ...state,
        products: state.products.map((env) =>
          env.productId === action.payload.specific
            ? {
                ...env,
                coment: [...env.coment, ...action.payload.data],
              }
            : env
        ),
      };
    default:
      return state;
  }
};

const organizarProductos = (productos) => {
  // Agrupar productos según el campo 'caja'
  const productosPorCaja = productos
    .sort((a, b) => a.order - b.order)
    .reduce((acc, producto) => {
      const { caja } = producto;
      if (!acc[caja]) acc[caja] = [];
      acc[caja].push(producto);
      return acc;
    }, {});

  // Aplicar la lógica de organización dentro de cada grupo de 'caja'
  const resultado = Object.values(productosPorCaja).flatMap((grupo) => {
    const productosSpanTrue = grupo.filter((producto) => producto.span);
    const productosSpanFalse = grupo.filter((producto) => !producto.span);

    let grupoResultado = [];
    let spanIndex = 0;
    let skipCount = 0;
    grupo.forEach((_, index) => {
      if (spanIndex < productosSpanTrue.length && skipCount === 0) {
        // Coloca un producto con span y reinicia skipCount
        grupoResultado.push(productosSpanTrue[spanIndex]);
        spanIndex++;
        skipCount = 2; // Se establece el salto de dos elementos
      } else {
        // Coloca un producto sin span y decrementa skipCount si es mayor que 0
        const productoSinSpan = productosSpanFalse.shift();
        if (productoSinSpan) {
          grupoResultado.push(productoSinSpan);
        }
        if (skipCount > 0) {
          skipCount--;
        }
      }
    });

    return grupoResultado;
  });
  return resultado;
};
