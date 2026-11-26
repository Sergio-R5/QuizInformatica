// Lógica del quiz: funciones puras (no tocan la interfaz ni el estado de React).
// Al ser puras se pueden probar por separado y son muy rápidas: todo ocurre en memoria.

import PREGUNTAS from '../data/preguntas';

export const LETRAS = ['A', 'B', 'C', 'D'];

/** Mezcla Fisher-Yates: devuelve una copia barajada, sin modificar el original (inmutable). */
export function barajar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Prepara una pregunta para mostrarla: baraja sus alternativas y recalcula
 * en qué posición quedó la correcta. Así la respuesta no está siempre en la misma letra.
 */
function prepararPregunta(pregunta) {
  const orden = barajar([0, 1, 2, 3]); // orden[i] = índice original que se muestra en la posición i
  return {
    ...pregunta,
    alternativas: orden.map((i) => pregunta.alternativas[i]),
    correcta: orden.indexOf(pregunta.correcta),
  };
}

/** Elige `cantidad` preguntas al azar del banco, con alternativas barajadas. */
export function nuevoQuiz(cantidad) {
  const n = Math.min(Math.max(cantidad, 1), PREGUNTAS.length);
  return barajar(PREGUNTAS).slice(0, n).map(prepararPregunta);
}

/** Arma una ronda solo con las preguntas indicadas (las falladas), barajadas otra vez. */
export function quizDeRepaso(ids) {
  const falladas = PREGUNTAS.filter((p) => ids.includes(p.id));
  return barajar(falladas).map(prepararPregunta);
}

/** Primera oración de un texto: se usa como mensaje breve cuando la respuesta es correcta. */
export function primeraOracion(texto) {
  const corte = texto.search(/\.\s/);
  return corte === -1 ? texto : texto.slice(0, corte + 1);
}

/** Mensaje motivacional según el porcentaje obtenido. */
export function mensajeFinal(porcentaje) {
  if (porcentaje >= 100) return '¡Perfecto! Dominas el tema 🏆';
  if (porcentaje >= 80) return '¡Excelente trabajo! 🚀';
  if (porcentaje >= 60) return '¡Bien! Vas por buen camino 💪';
  if (porcentaje >= 40) return 'Puedes mejorar, repasa tus errores 📚';
  return 'A estudiar un poco más, ¡tú puedes! 🔁';
}

export const TOTAL_PREGUNTAS = PREGUNTAS.length;

/**
 * Corrige la pregunta actual con la alternativa `i` y devuelve el NUEVO estado.
 * Función pura: no modifica `estado`, crea una copia con spread. Es solo una comparación
 * en memoria, por eso tarda microsegundos.
 */
export function corregir(estado, i) {
  const actual = estado.preguntas[estado.indice];
  const acierto = i === actual.correcta;
  const racha = acierto ? estado.racha + 1 : 0;
  return {
    ...estado,
    seleccion: i,
    respuestas: [...estado.respuestas, { ...actual, elegida: i }],
    racha,
    mejorRacha: Math.max(estado.mejorRacha, racha),
  };
}
