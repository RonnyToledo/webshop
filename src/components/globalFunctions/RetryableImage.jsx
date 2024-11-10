"use client";
import { useState } from "react";
import Image from "next/image";

const RetryableImage = ({ src, alt, maxRetries = 3, ...props }) => {
  const [attempt, setAttempt] = useState(0);

  const handleError = () => {
    if (attempt < maxRetries) {
      setAttempt((prevAttempt) => prevAttempt + 1);
    }
  };

  return (
    <Image
      {...props}
      key={attempt} // Cambiar el `key` fuerza que el componente recargue
      src={src}
      alt={alt}
      onError={handleError}
    />
  );
};

export default RetryableImage;
