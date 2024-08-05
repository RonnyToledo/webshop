import React from "react";
import CartPage from "@/components/Chadcn-components/Cart";
import { context } from "@/app/t/[tienda]/layout";

export default function page() {
  return <CartPage context={context} />;
}
