import React from "react";
import { format, addDays, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default function Housr({ horario }) {
  const now = new Date();

  const newHorario = generateSchedule(horario);

  function isOpen() {
    if (newHorario[0]?.apertura <= now && newHorario[0]?.cierre > now) {
      return { week: 0, open: true };
    } else if (newHorario[1]?.apertura <= now && newHorario[1]?.cierre > now) {
      return { week: 1, open: true };
    } else if (newHorario[2]?.apertura <= now && newHorario[2]?.cierre > now) {
      return { week: 2, open: true };
    } else if (newHorario[3]?.apertura <= now && newHorario[3]?.cierre > now) {
      return { week: 3, open: true };
    } else if (newHorario[4]?.apertura <= now && newHorario[4]?.cierre > now) {
      return { week: 4, open: true };
    } else if (newHorario[5]?.apertura <= now && newHorario[5]?.cierre > now) {
      return { week: 5, open: true };
    } else if (newHorario[6]?.apertura <= now && newHorario[6]?.cierre > now) {
      return { week: 6, open: true };
    } else {
      return { week: 6, open: false }; // Está cerrado
    }
  }

  return (
    <div className="flex items-center space-x-2 mb-2">
      <Badge variant={!isOpen().open && "destructive"}>
        {isOpen().open ? "ABIERTO" : "CERRADO"}
      </Badge>
      {isOpen().open ? (
        <p className="text-gray-500">
          Cierra{" "}
          <relative-time
            lang="es"
            datetime={estadoCierre(newHorario)}
            no-title
          ></relative-time>
        </p>
      ) : (
        <p className="text-gray-500">
          Abre{" "}
          <relative-time
            lang="es"
            datetime={estadoApertura(newHorario)}
            no-title
          ></relative-time>
        </p>
      )}
    </div>
  );
}

function estadoApertura(fechas) {
  const ahora = new Date();
  let resultados = [];

  fechas.forEach(({ apertura, cierre }) => {
    const abierto = ahora >= apertura && ahora < cierre;

    let tiempoRestante = null;
    if (abierto) {
      tiempoRestante = new Date(cierre - ahora);
    } else {
      // Si está cerrado, se calcula el tiempo hasta la próxima apertura
      tiempoRestante = new Date(apertura - ahora);
    }

    resultados.push({
      apertura,
      cierre,
      abierto,
      tiempoRestante: {
        horas: Math.floor(tiempoRestante / (1000 * 60 * 60)),
        minutos: Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((tiempoRestante % (1000 * 60)) / 1000),
      },
    });
  });
  let proximaApertura = null;

  for (let i = 0; i < resultados.length; i++) {
    const tiempo = resultados[i].tiempoRestante;
    const apertura = resultados[i % 7].apertura;
    const cierre = resultados[(i + 6) % 7].cierre;
    const cierreHoy = resultados[i % 7].cierre;

    // Verifica si hay horas, minutos o segundos positivos
    if (!(apertura.toISOString() == cierre.toISOString())) {
      if (!(apertura.toISOString() == cierreHoy.toISOString())) {
        if (resultados[i].apertura > ahora) {
          if (tiempo.horas > 0 || tiempo.minutos > 0 || tiempo.segundos > 0) {
            proximaApertura = resultados[i].apertura; // Guarda la apertura
            break; // Rompe el ciclo al encontrar el primer tiempo positivo
          }
        }
      }
    }
  }
  return proximaApertura;
}
function estadoCierre(fechas) {
  const ahora = new Date();
  let estado = [];

  for (let i = 0; i < fechas.length; i++) {
    const cerrado =
      ahora >= fechas[i]?.cierre && ahora < fechas[(i + 1) % 7]?.apertura;

    let tiempoRestante = null;

    tiempoRestante = new Date(fechas[(i + 1) % 7]?.apertura - ahora);

    estado.push({
      apertura: fechas[i % 7]?.apertura,
      cierre: fechas[i % 7]?.cierre,
      cerrado,
      tiempoRestante: {
        horas: Math.floor(tiempoRestante / (1000 * 60 * 60)),
        minutos: Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((tiempoRestante % (1000 * 60)) / 1000),
      },
    });
  }

  let proximoCierre = null;

  for (let i = 0; i < estado.length; i++) {
    const tiempo = estado[i].tiempoRestante;
    const apertura = estado[(i + 1) % 7].apertura;
    const cierre = estado[i % 7].cierre;

    //No contar el cierre si es 24 horas
    if (!(apertura.toISOString() == cierre.toISOString())) {
      // Verifica si hay horas, minutos o segundos positivos
      if (tiempo.horas > 0 || tiempo.minutos > 0 || tiempo.segundos > 0) {
        proximoCierre = estado[i].cierre; // Guarda la apertura
        break; // Rompe el ciclo al encontrar el primer tiempo positivo
      }
    }
  }
  return proximoCierre;
}
const generateSchedule = (inputArray) => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: today.getDay() });
  //Generar los horarios a partir del dia de hoy sin organizarlos
  const horarios = inputArray.map((item, index) => {
    const day = addDays(weekStart, (index + today.getDay() - 1) % 7);
    const apertura = new Date(day);
    let cierre = new Date(day);

    if (item.apertura === 24) {
      apertura.setHours(0, 0, 0, 0);
      apertura.setDate(apertura.getDate() + 1);
    } else {
      apertura.setHours(item.apertura, 0, 0, 0);
    }

    if (item.cierre === 24) {
      cierre.setHours(0, 0, 0, 0);
      cierre.setDate(cierre.getDate() + 1);
    } else if (item.cierre < item.apertura) {
      cierre.setHours(item.cierre, 0, 0, 0);
      cierre.setDate(cierre.getDate() + 1);
    } else {
      cierre.setHours(item.cierre, 0, 0, 0);
    }

    return {
      dia: item.dia,
      apertura: apertura,
      cierre: cierre,
    };
  });
  const organizados = [];
  for (let i = today.getDay(); i < horarios.length + today.getDay(); i++) {
    organizados.push(horarios[i % 7]);
  }
  return organizados;
};
