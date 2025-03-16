export const reducerStore = (state, action) => {
  switch (action.type) {
    case "Add":
      const value = {
        ...action.payload,
      };
      return value;
    case "ChangeCurrent":
      const a = JSON.parse(action.payload);
      return {
        ...state,
        moneda_default: a,
        moneda: state?.moneda.map((obj) => {
          return {
            ...obj,
            valor: redondearAMultiploDe5(obj.valor / a.valor),
          };
        }),
        products: state.products.map((obj) => ({
          ...obj,
          price: redondearAMultiploDe5(obj.price / a.valor),
        })),
      };
    case "Clean":
      return {
        ...state,
        products: state.products.map((obj) => ({
          ...obj,
          Cant: 0,
          agregados: obj.agregados.map((agr) => ({ ...agr, cantidad: 0 })),
        })),
      };
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
        comentTienda: {
          ...state.comentTienda,
          data: [...state.comentTienda.data, ...action.payload],
        },
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

function redondearAMultiploDe5(valor) {
  if (valor < 5) {
    // Redondear a 6 decimales si el valor es menor que 5
    return parseFloat(valor.toFixed(6));
  } else {
    // Redondear al múltiplo de 5 más cercano
    return Math.round(valor / 5) * 5;
  }
}
