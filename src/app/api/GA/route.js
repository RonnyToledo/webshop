import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const propertyId = process.env.NEXT_PUBLIC_GA_PROPERTY_ID; // ID de propiedad de GA4

// Configura autenticación con Google Auth
const auth = new GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
});

const analyticsDataClient = new BetaAnalyticsDataClient({ auth });

export async function GET(request) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: "pagePath" }, { name: "hour" }, { name: "date" }],
      metrics: [{ name: "sessions" }],
      dateRanges: [{ startDate: "365daysAgo", endDate: "today" }],
    });
    // Formatea los datos de Analytics
    const formattedData = formatAnalyticsDataByDate(response);
    return NextResponse.json(aggregateSessions(formattedData));
  } catch (error) {
    console.error("Error al ejecutar el reporte:", error);
    return NextResponse.json(
      {
        message: "Error al ejecutar el reporte de Analytics",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Función para formatear los datos de Analytics
function formatAnalyticsDataByDate(data) {
  return data.rows.reduce((acc, row) => {
    const [pagePath, hour, date] = row.dimensionValues.map((val) => val.value);
    const sessions = parseInt(row.metricValues[0].value, 10);

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({ pagePath, hour, sessions });

    return acc;
  }, {});
}

// Convierte los datos a un formato específico
function aggregateSessions(data) {
  const result = {};

  for (const date in data) {
    data[date].forEach((entry) => {
      const { pagePath, sessions } = entry;

      // Verificar si es una tienda
      const storeMatch = pagePath.match(/^\/t\/([^/]+)/);
      if (storeMatch) {
        const storeName = storeMatch[1];

        // Inicializar la tienda si no existe
        if (!result[storeName]) {
          result[storeName] = { totalSessions: 0, products: {} };
        }

        // Sumar sesiones de la tienda
        result[storeName].totalSessions += sessions;

        // Verificar si es un producto
        const productMatch = pagePath.match(/^\/t\/[^/]+\/products\/([^/]+)/);
        if (productMatch) {
          const productId = productMatch[1];

          // Inicializar el producto si no existe
          if (!result[storeName].products[productId]) {
            result[storeName].products[productId] = 0;
          }

          // Sumar sesiones del producto
          result[storeName].products[productId] += sessions;
        }
      }
    });
  }

  return result;
}
