"use client";
import React, { createContext, useReducer } from "react";
import { reducerStore } from "@/reducer/reducerGeneral";

export const MyContext = createContext(); // Cambié el nombre a MyContext para mayor claridad
const initialState = {
  moneda_default: {},
  moneda: [],
  horario: [],
  comentario: [],
  categoria: [],
  envios: [],
  insta: "",
  products: [],
  loading: 0,
  search: "",
};

export default function MyProvider({ children }) {
  const [store, dispatchStore] = useReducer(reducerStore, initialState);

  return (
    <MyContext.Provider value={{ store, dispatchStore }}>
      {children}
    </MyContext.Provider>
  );
}
