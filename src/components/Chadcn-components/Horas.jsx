import React from "react";
import { addDays, startOfWeek } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Housr({ horario }) {
  const now = new Date();
  const newHorario = generateSchedule(horario);

  const { open, nextOpening, nextClosing } = checkStoreStatus(newHorario, now);

  return (
    <div className="flex items-center space-x-2 mb-2">
      <Badge variant={open ? "default" : "destructive"}>
        {open ? "ABIERTO" : "CERRADO"}
      </Badge>
      <p className="text-gray-500">
        {open ? (
          <>
            Cierra{" "}
            <relative-time
              lang="es"
              datetime={nextClosing}
              no-title
            ></relative-time>
          </>
        ) : (
          <>
            Abre{" "}
            <relative-time
              lang="es"
              datetime={nextOpening}
              no-title
            ></relative-time>
          </>
        )}
      </p>
    </div>
  );
}

function checkStoreStatus(horario, now) {
  let open = false;
  let nextOpening = null;
  let nextClosing = null;

  horario.forEach(({ apertura, cierre }) => {
    if (now >= apertura && now < cierre) {
      open = true;
      nextClosing = cierre;
    } else if (now < apertura && (!nextOpening || apertura < nextOpening)) {
      nextOpening = apertura;
    }
  });

  return { open, nextOpening, nextClosing };
}

const generateSchedule = (inputArray) => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });

  return inputArray.map((item, index) => {
    const day = addDays(weekStart, (index + today.getDay()) % 7);
    const apertura = createDate(day, item.apertura);
    const cierre = createDate(day, item.cierre, item.apertura);

    return { dia: item.dia, apertura, cierre };
  });
};

const createDate = (day, hour, apertura) => {
  const date = new Date(day);
  if (hour === 24) {
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 1);
  } else {
    date.setHours(hour, 0, 0, 0);
    if (hour < apertura) {
      date.setDate(date.getDate() + 1);
    }
  }
  return date;
};
