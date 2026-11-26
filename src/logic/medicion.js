// Medición de tiempos con el reloj de alta precisión del motor JavaScript.
// performance.now() entrega milisegundos con decimales (precisión de microsegundos).

export function ahora() {
  return performance.now();
}

/** Promedio de una lista de tiempos (0 si está vacía). Usa reduce. */
export function promedio(lista) {
  return lista.length ? lista.reduce((suma, t) => suma + t, 0) / lista.length : 0;
}
