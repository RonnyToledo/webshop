'use client'

import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function BannerTiendaInactiva() {
  return (
    (<Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Tienda Inactiva</AlertTitle>
      <AlertDescription>
        Lo sentimos, esta tienda está temporalmente fuera de servicio. Por favor, vuelva más tarde.
      </AlertDescription>
    </Alert>)
  );
}