export const reducerStore = (state, action) => {
  switch (action.type) {
    case "Add":
      const value = {
        ...action.payload,
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
