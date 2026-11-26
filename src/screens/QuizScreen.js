// Pantalla del quiz: avance pregunta a pregunta con corrección inmediata.
//
// ESTADO COMPLEJO CON useState: todo el progreso vive en UN solo objeto.
// Cada cambio crea un objeto nuevo con spread (...prev), nunca se modifica el anterior.

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Alert, Animated, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Boton, Etiqueta, Pantalla, Tarjeta, Texto } from '../components/ui';
import { ahora } from '../logic/medicion';
import { corregir, LETRAS, nuevoQuiz, primeraOracion, quizDeRepaso } from '../logic/quiz';
import { useTema } from '../theme/TemaContext';
import { alfa } from '../theme/temas';

export default function QuizScreen({ navigation, route }) {
  const { tema } = useTema();
  const { cantidad = 10, repasarIds = null, ronda = 1 } = route.params ?? {};

  // Inicialización perezosa: la función se ejecuta UNA sola vez al montar la pantalla,
  // así las preguntas no se vuelven a barajar en cada render.
  const [estado, setEstado] = useState(() => ({
    preguntas: repasarIds ? quizDeRepaso(repasarIds) : nuevoQuiz(cantidad),
    indice: 0,          // pregunta actual
    seleccion: null,    // alternativa elegida en la pregunta actual (null = sin responder)
    respuestas: [],     // historial: { ...pregunta, elegida }
    racha: 0,           // aciertos seguidos
    mejorRacha: 0,
    tiempos: [],        // medición propia por respuesta: { logica, pantalla } en ms
  }));

  // Valores derivados: se calculan desde el estado, no se guardan aparte.
  const { preguntas, indice, seleccion, respuestas, racha, tiempos } = estado;
  const pregunta = preguntas[indice];
  const respondida = seleccion !== null;
  const esUltima = indice === preguntas.length - 1;
  const correctas = respuestas.filter((r) => r.elegida === r.correcta).length;
  const esRepaso = repasarIds !== null;
  // Tiempo de la corrección actual: el último medido, solo si ya se respondió esta pregunta.
  const ultimoTiempo = respondida && tiempos.length === respuestas.length ? tiempos[tiempos.length - 1] : null;

  // Refs: datos que NO deben provocar un nuevo render (se usan solo en eventos y efectos).
  const inicioToque = useRef(0);
  const tiempoLogica = useRef(0);
  const scroll = useRef(null);

  // ---------- Responder ----------
  // La corrección es síncrona: no hay nada que esperar (sin red ni disco), así que NO se usa
  // await aquí. Un await solo agregaría una vuelta extra por la cola de tareas.
  const responder = (i) => {
    if (estado.seleccion !== null) return; // ya respondida: se ignoran toques extra
    const t0 = ahora();
    const nuevo = corregir(estado, i);           // lógica pura en memoria
    tiempoLogica.current = ahora() - t0;          // medición 1: solo la lógica
    inicioToque.current = t0;
    setEstado(nuevo);
  };

  // Medición 2: tiempo hasta que React aplicó la corrección en la interfaz.
  // useLayoutEffect corre justo después de aplicar los cambios y antes de pintar.
  useLayoutEffect(() => {
    if (seleccion === null) return;
    const medicion = { logica: tiempoLogica.current, pantalla: ahora() - inicioToque.current };
    setEstado((prev) => ({ ...prev, tiempos: [...prev.tiempos, medicion] }));
  }, [seleccion]);

  // Animación de aparición de la retroalimentación (hilo nativo, no bloquea JavaScript).
  // El valor animado se crea una sola vez (inicialización perezosa de useState).
  const [aparicion] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (seleccion === null) {
      aparicion.setValue(0);
      return;
    }
    Animated.timing(aparicion, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    // Bajar hasta el mensaje para que siempre se vea.
    const t = setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(t); // limpieza del temporizador al cambiar o desmontar
  }, [seleccion, aparicion]);

  // Barra de progreso animada.
  const [progreso] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const valor = (indice + (respondida ? 1 : 0)) / preguntas.length;
    Animated.timing(progreso, { toValue: valor, duration: 300, useNativeDriver: true }).start();
  }, [indice, respondida, preguntas.length, progreso]);

  // ---------- Avanzar ----------
  const siguiente = () => {
    if (!respondida) return;
    if (esUltima) {
      // REPLACE: Resultados reemplaza al Quiz en la pila de navegación.
      // Así, "atrás" desde Resultados vuelve a Inicio y no a un quiz ya terminado.
      navigation.replace('Resultados', {
        respuestas,
        ronda,
        esRepaso,
        mejorRacha: estado.mejorRacha,
        tiempos,
      });
      return;
    }
    setEstado((prev) => ({ ...prev, indice: prev.indice + 1, seleccion: null }));
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  // ---------- Navegación controlada ----------
  // Si el usuario intenta salir (botón atrás de Android o la X), se pide confirmación.
  // El replace hacia Resultados se deja pasar sin preguntar: es el final normal del flujo.
  useEffect(() => {
    const quitar = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === 'REPLACE') return;
      e.preventDefault();
      Alert.alert(
        '¿Abandonar el quiz?',
        `Perderás el progreso de esta ronda (${respuestas.length} de ${preguntas.length} respondidas).`,
        [
          { text: 'Seguir jugando', style: 'cancel' },
          { text: 'Salir', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
        ],
      );
    });
    return quitar; // limpieza: se quita el listener al salir de la pantalla
  }, [navigation, respuestas.length, preguntas.length]);

  return (
    <Pantalla style={estilos.pantalla}>
      {/* ---------- Encabezado ---------- */}
      <View style={estilos.encabezado}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={[estilos.cerrar, { backgroundColor: tema.tarjeta, borderColor: tema.borde }]}
        >
          <Texto style={estilos.textoCerrar}>✕</Texto>
        </Pressable>
        <View style={estilos.tituloEncabezado}>
          <Texto style={estilos.textoTitulo} numberOfLines={1}>
            {esRepaso ? `Repaso de errores · ronda ${ronda}` : `Pregunta ${indice + 1} de ${preguntas.length}`}
          </Texto>
          {esRepaso && <Texto suave style={estilos.textoSub}>Pregunta {indice + 1} de {preguntas.length}</Texto>}
        </View>
        <Etiqueta texto={`✔ ${correctas}`} color={tema.correcto} />
        {racha >= 2 && (
          <View style={estilos.racha}>
            <Etiqueta texto={`🔥 ${racha}`} color={tema.acento} />
          </View>
        )}
      </View>

      <View style={[estilos.pista, { backgroundColor: tema.borde }]}>
        <Animated.View
          style={[
            estilos.relleno,
            { backgroundColor: tema.primario, transform: [{ scaleX: progreso }] },
          ]}
        />
      </View>

      {/* ---------- Pregunta ---------- */}
      <ScrollView ref={scroll} style={estilos.scroll} contentContainerStyle={estilos.contenido}>
        <Etiqueta texto={pregunta.modulo} color={tema.acento} />
        <Texto style={estilos.pregunta}>{pregunta.texto}</Texto>

        {pregunta.alternativas.map((texto, i) => (
          <Alternativa
            key={`${pregunta.id}-${i}`}
            letra={LETRAS[i]}
            texto={texto}
            respondida={respondida}
            esCorrecta={i === pregunta.correcta}
            esElegida={i === seleccion}
            indice={i}
            onElegir={responder}
          />
        ))}

        {/* RENDER CONDICIONAL: la retroalimentación existe solo si ya se respondió */}
        {respondida && (
          <Animated.View
            style={{
              opacity: aparicion,
              transform: [{ translateY: aparicion.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
            }}
          >
            <Retroalimentacion pregunta={pregunta} seleccion={seleccion} medicion={ultimoTiempo} />
          </Animated.View>
        )}
      </ScrollView>

      <Boton
        titulo={esUltima ? 'Ver resultados  🏁' : 'Siguiente  ➜'}
        onPress={siguiente}
        deshabilitado={!respondida}
        style={estilos.botonSiguiente}
      />
    </Pantalla>
  );
}

/** Una alternativa. Su color depende del estado: sin responder, correcta, elegida mal o atenuada. */
function Alternativa({ letra, texto, respondida, esCorrecta, esElegida, indice, onElegir }) {
  const { tema } = useTema();
  const marcada = respondida && (esCorrecta || esElegida);
  const color = !respondida ? tema.primario : esCorrecta ? tema.correcto : esElegida ? tema.incorrecto : tema.primario;
  const atenuada = respondida && !marcada;

  return (
    <Pressable
      onPress={() => onElegir(indice)}
      disabled={respondida}
      android_ripple={{ color: alfa(tema.primario, 0.15) }}
      style={[
        estilos.alternativa,
        {
          backgroundColor: marcada ? alfa(color, 0.16) : tema.tarjeta,
          borderColor: marcada ? color : tema.borde,
          borderWidth: marcada ? 2 : 1,
        },
      ]}
    >
      <View style={[estilos.circulo, { backgroundColor: color, opacity: atenuada ? 0.3 : 1 }]}>
        <Texto style={[estilos.letra, { color: tema.sobrePrimario }]}>
          {respondida && esCorrecta ? '✓' : respondida && esElegida ? '✕' : letra}
        </Texto>
      </View>
      <Texto style={[estilos.textoAlternativa, atenuada && { opacity: 0.45 }]}>{texto}</Texto>
    </Pressable>
  );
}

/** Mensaje después de responder: breve si acierta, completo con el error si falla. */
function Retroalimentacion({ pregunta, seleccion, medicion }) {
  const { tema } = useTema();
  const acierto = seleccion === pregunta.correcta;
  const color = acierto ? tema.correcto : tema.incorrecto;

  return (
    <Tarjeta colorBorde={color} style={estilos.retro}>
      <Texto style={[estilos.tituloRetro, { color }]}>{acierto ? '🎉 ¡Correcto!' : '❌ Incorrecto'}</Texto>

      {acierto ? (
        <>
          <Texto style={estilos.subRetro}>¿Por qué es correcto?</Texto>
          <Texto suave style={estilos.explicacion}>{primeraOracion(pregunta.explicacion)}</Texto>
        </>
      ) : (
        <>
          <Texto style={[estilos.detalle, { color: tema.incorrecto }]}>
            Elegiste {LETRAS[seleccion]}) {pregunta.alternativas[seleccion]}
          </Texto>
          <Texto style={[estilos.detalle, { color: tema.correcto }]}>
            La respuesta correcta es {LETRAS[pregunta.correcta]}) {pregunta.alternativas[pregunta.correcta]}
          </Texto>
          <Texto style={estilos.subRetro}>¿Por qué?</Texto>
          <Texto suave style={estilos.explicacion}>{pregunta.explicacion}</Texto>
        </>
      )}

      {medicion !== null && (
        <Texto suave style={estilos.tiempo}>
          ⚡ Corrección: {(medicion.logica * 1000).toFixed(1)} µs · pantalla lista en {medicion.pantalla.toFixed(1)} ms
        </Texto>
      )}
    </Tarjeta>
  );
}

const estilos = StyleSheet.create({
  pantalla: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 12 },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cerrar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  textoCerrar: { fontSize: 16 },
  tituloEncabezado: { flex: 1 },
  textoTitulo: { fontSize: 16, fontWeight: '800' },
  textoSub: { fontSize: 12 },
  racha: { marginLeft: -4 },
  pista: { height: 10, borderRadius: 5, overflow: 'hidden', marginTop: 12 },
  relleno: { height: '100%', width: '100%', borderRadius: 5, transformOrigin: 'left' },
  scroll: { flex: 1, marginTop: 14 },
  contenido: { paddingBottom: 12 },
  pregunta: { fontSize: 21, fontWeight: '800', lineHeight: 28, marginTop: 10, marginBottom: 14 },
  alternativa: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 14,
    marginBottom: 10, gap: 12, overflow: 'hidden',
  },
  circulo: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  letra: { fontWeight: '900', fontSize: 15 },
  textoAlternativa: { flex: 1, fontSize: 16, lineHeight: 22 },
  retro: { marginTop: 4 },
  tituloRetro: { fontSize: 22, fontWeight: '900', marginBottom: 6 },
  subRetro: { fontWeight: '800', marginTop: 8 },
  detalle: { fontWeight: '700', marginTop: 4, lineHeight: 20 },
  explicacion: { marginTop: 2, lineHeight: 20 },
  tiempo: { marginTop: 10, fontSize: 12, textAlign: 'right' },
  botonSiguiente: { marginTop: 8 },
});
