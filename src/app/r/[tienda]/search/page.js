import React, { Suspense } from "react";
import { MyContext } from "@/context/MyContext";
import { ProductSearchComponent } from "@/components/VarR/product-search";

export default function page() {
  return <ProductSearchComponent context={MyContext} />;
}
