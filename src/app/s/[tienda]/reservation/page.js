import React, { Suspense } from "react";
import ReservationPage from "@/components/Chadcn-components/ReservationPage";
import { context } from "@/app/s/[tienda]/layout";

export default function page() {
  return <ReservationPage context={context} />;
}
