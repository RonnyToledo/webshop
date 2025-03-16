"use client"

import { useEffect, useState } from "react"
import { RefreshCw, WifiOff } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine)

    // Add event listeners for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up event listeners
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    };
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  if (isOnline) {
    return null
  }

  return (
    (<div
      className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="flex flex-col items-center text-center">
          <div
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <WifiOff className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Sin conexión a Internet</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            No se puede conectar a Internet. Por favor, verifica tu conexión e intenta nuevamente.
          </p>
          <Button onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Intentar nuevamente
          </Button>
        </div>
      </div>
    </div>)
  );
}

