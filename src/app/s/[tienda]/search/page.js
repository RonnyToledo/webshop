import React, { Suspense } from "react";
import { context } from "@/app/s/[tienda]/layout";
import Search from "@/components/component/search";

export default function page() {
  return <Search context={context} />;
}
