import React, { Suspense } from "react";
import { context } from "@/app/r/[tienda]/layout";
import Search from "@/components/component/search";

export default function page() {
  return <Search context={context} />;
}
