// Informe final: puntaje, estadísticas, errores cometidos y opción de repetir solo lo fallado.
// Llega aquí con navigation.replace() desde el Quiz, por eso "atrás" vuelve a Inicio.

import { useEffect, useState } from 'react';
import { Animated, FlatList, StyleSheet, View } from 'react-native';
import { Boton, Etiqueta, Pantalla, Tarjeta, Texto, useEscala } from '../components/ui';
import { almacen } from '../logic/almacen';
import { promedio } from '../logic/medicion';
import { LETRAS, mensajeFinal } from '../logic/quiz';
import { useTema } from '../theme/TemaContext';

const CLAVE_RECORD = 'mejorPorcentaje';

export default function ResultadosScreen({ navigation, route }) {
  const { tema } = useTema();
  const escala = useEscala(); // achica los textos grandes en pantallas angostas
  const { respuestas = [], ronda = 1, esRepaso = false, mejorRacha = 0, tiempos = [] } = route.params ?? {};

  // Todo derivado de los parámetros: no se duplica en otro estado.
  const total = respuestas.length;
  const errores = respuestas.filter((r) => r.elegida !== r.correcta);
  const correctas = total - errores.length;
  const porcentaje = total === 0 ? 0 : Math.round((correctas * 100) / total);
  const promedioLogica = promedio(tiempos.map((t) => t.logica));
  const promedioPantalla = promedio(tiempos.map((t) => t.pantalla));
  const colorPuntaje = porcentaje >= 80 ? tema.correcto : porcentaje >= 50 ? tema.acento : tema.incorrecto;

  // Récord histórico guardado en el teléfono (async/await en segundo plano).
  // La pantalla se muestra de inmediato; el récord aparece cuando termina la lectura.
  const [record, setRecord] = useState(null);
  useEffect(() => {
    if (esRepaso || total === 0) return; // el récord solo cuenta en quizzes normales
    let activo = true;
    (async () => {
      const anterior = (await almacen.leer(CLAVE_RECORD)) ?? 0;
      const nuevo = Math.max(anterior, porcentaje);
      if (nuevo !== anterior) await almacen.guardar(CLAVE_RECORD, nuevo);
      if (activo) setRecord({ valor: nuevo, superado: porcentaje > anterior });
    })();
    return () => { activo = false; };
  }, [esRepaso, total, porcentaje]);

  // Barra de puntaje animada.
  const [barra] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(barra, { toValue: porcentaje / 100, duration: 900, useNativeDriver: true }).start();
  }, [porcentaje, barra]);

  const repetirFalladas = () => {
    // REPLACE: la nueva ronda reemplaza a Resultados. Pila resultante: Inicio -> Quiz.
    navigation.replace('Quiz', { repasarIds: errores.map((e) => e.id), ronda: ronda + 1 });
  };

  const nuevoQuiz = () => navigation.popToTop(); // vuelve a Inicio

  const cabecera = (
    <View>
      <Texto ajustar style={[estilos.titulo, { fontSize: 28 * escala, lineHeight: 36 * escala }]}>
        {esRepaso ? 'Resultado del repaso' : 'Informe final'}
      </Texto>

      <Tarjeta style={estilos.bloque}>
        <View style={estilos.filaPuntaje}>
          <Texto ajustar style={[estilos.porcentaje, { color: colorPuntaje, fontSize: 56 * escala, lineHeight: 66 * escala }]}>
            {porcentaje}%
          </Texto>
          <Texto suave ajustar style={estilos.fraccion}>{correctas}/{total}</Texto>
        </View>
        <View style={[estilos.pista, { backgroundColor: tema.borde }]}>
          <Animated.View style={[estilos.relleno, { backgroundColor: colorPuntaje, transform: [{ scaleX: barra }] }]} />
        </View>
        <Texto style={estilos.mensaje}>{mensajeFinal(porcentaje)}</Texto>
        {record && (
          <Texto suave style={estilos.record}>
            {record.superado ? `🏅 ¡Nuevo récord personal: ${record.valor}%!` : `🏅 Tu récord: ${record.valor}%`}
          </Texto>
        )}
      </Tarjeta>

      <View style={[estilos.filaStats, estilos.bloque]}>
        <Estadistica valor={correctas} titulo="Correctas" color={tema.correcto} />
        <Estadistica valor={errores.length} titulo="Errores" color={tema.incorrecto} />
        <Estadistica valor={`🔥${mejorRacha}`} titulo="Racha" color={tema.acento} />
      </View>

      <Texto suave style={estilos.medicion}>
        ⚡ Promedio por respuesta: corrección {(promedioLogica * 1000).toFixed(1)} µs · pantalla{' '}
        {promedioPantalla.toFixed(1)} ms
      </Texto>

      <View style={estilos.bloque}>
        {/* Render condicional: solo se ofrece repetir si hubo errores */}
        {errores.length > 0 && (
          <Boton titulo={`🔁 Repetir falladas (${errores.length})`} onPress={repetirFalladas} />
        )}
        <Boton titulo="🏠 Nuevo quiz" secundario onPress={nuevoQuiz} style={estilos.separado} />
      </View>

      {errores.length === 0 ? (
        <Tarjeta colorBorde={tema.correcto} style={estilos.bloque}>
          <Texto style={[estilos.perfecto, { color: tema.correcto }]}>🏆 ¡Sin errores!</Texto>
          <Texto suave>Respondiste todo correctamente. No hay preguntas que repasar.</Texto>
        </Tarjeta>
      ) : (
        <Texto style={[estilos.subtitulo, estilos.bloque]}>Errores cometidos ({errores.length})</Texto>
      )}
    </View>
  );

  return (
    <Pantalla>
      {/* FlatList: dibuja solo los errores visibles, eficiente aunque sean 30 */}
      <FlatList
        data={errores}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={cabecera}
        contentContainerStyle={estilos.contenido}
        renderItem={({ item }) => <TarjetaError item={item} />}
      />
    </Pantalla>
  );
}

function Estadistica({ valor, titulo, color }) {
  return (
    <Tarjeta style={estilos.stat}>
      <Texto ajustar style={[estilos.valorStat, { color }]}>{valor}</Texto>
      <Texto suave ajustar style={estilos.tituloStat}>{titulo}</Texto>
    </Tarjeta>
  );
}

function TarjetaError({ item }) {
  const { tema } = useTema();
  return (
    <Tarjeta colorBorde={tema.incorrecto} style={estilos.error}>
      <Etiqueta texto={`#${item.id} · ${item.modulo}`} color={tema.acento} />
      <Texto style={estilos.preguntaError}>{item.texto}</Texto>
      <Texto style={[estilos.linea, { color: tema.incorrecto }]}>
        ✕ Tu respuesta: {LETRAS[item.elegida]}) {item.alternativas[item.elegida]}
      </Texto>
      <Texto style={[estilos.linea, { color: tema.correcto, fontWeight: '700' }]}>
        ✓ Correcta: {LETRAS[item.correcta]}) {item.alternativas[item.correcta]}
      </Texto>
      <Texto suave style={estilos.explicacion}>{item.explicacion}</Texto>
    </Tarjeta>
  );
}

const estilos = StyleSheet.create({
  contenido: { padding: 18, paddingBottom: 30 },
  titulo: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginTop: 6 },
  bloque: { marginTop: 14 },
  separado: { marginTop: 10 },
  filaPuntaje: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 10 },
  porcentaje: { fontSize: 56, fontWeight: '900', flexShrink: 1 },
  fraccion: { fontSize: 20 },
  pista: { height: 14, borderRadius: 7, overflow: 'hidden', marginTop: 6 },
  relleno: { height: '100%', width: '100%', transformOrigin: 'left' },
  mensaje: { textAlign: 'center', fontSize: 17, fontWeight: '800', marginTop: 12 },
  record: { textAlign: 'center', marginTop: 6 },
  filaStats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, alignItems: 'center', paddingHorizontal: 6, paddingVertical: 12 },
  valorStat: { fontSize: 24, lineHeight: 30, fontWeight: '900' },
  tituloStat: { fontSize: 12 },
  medicion: { textAlign: 'center', marginTop: 10, fontSize: 12 },
  perfecto: { fontSize: 20, fontWeight: '900' },
  subtitulo: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  error: { marginTop: 12 },
  preguntaError: { fontWeight: '800', marginTop: 8, lineHeight: 20 },
  linea: { marginTop: 6, lineHeight: 20 },
  explicacion: { marginTop: 8, fontSize: 13, lineHeight: 19 },
});
