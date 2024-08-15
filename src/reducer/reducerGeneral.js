export const reducerStore = (state, action) => {
  switch (action.type) {
    case "Add":
      return action.payload;
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
    default:
      return state;
  }
};
