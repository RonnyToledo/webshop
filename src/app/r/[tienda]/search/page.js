import React, { Suspense } from "react";
import Search from "@/components/VarT/search";
import { MyContext } from "@/context/MyContext";

export default function page() {
  return <Search context={MyContext} />;
}
