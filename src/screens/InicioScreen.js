// Pantalla de inicio: el usuario elige cuántas preguntas responder y el tema de colores.

import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Boton, Etiqueta, Pantalla, Tarjeta, Texto } from '../components/ui';
import { TOTAL_PREGUNTAS } from '../logic/quiz';
import { useTema } from '../theme/TemaContext';
import { alfa, TEMAS } from '../theme/temas';

const OPCIONES_RAPIDAS = [5, 10, 15, 20, TOTAL_PREGUNTAS];

export default function InicioScreen({ navigation }) {
  const { tema, claveTema, cambiarTema } = useTema();
  // Estado local simple: cantidad de preguntas elegida.
  const [cantidad, setCantidad] = useState(10);

  const cambiarCantidad = (delta) =>
    setCantidad((actual) => Math.min(Math.max(actual + delta, 1), TOTAL_PREGUNTAS));

  const comenzar = () => {
    // navigate (no replace): desde el quiz SÍ se puede volver al inicio (con confirmación).
    navigation.navigate('Quiz', { cantidad });
  };

  return (
    <Pantalla>
      <ScrollView contentContainerStyle={estilos.contenido}>
        <View style={[estilos.logo, { backgroundColor: tema.primario, borderColor: tema.acento }]}>
          <Texto style={estilos.emojiLogo}>🧠</Texto>
        </View>
        <Texto style={estilos.titulo}>Quiz Informática</Texto>
        <Texto suave style={estilos.subtitulo}>
          {TOTAL_PREGUNTAS} preguntas · 6 módulos · corrección al instante
        </Texto>

        {/* ---------- Cantidad de preguntas ---------- */}
        <Tarjeta style={estilos.bloque}>
          <Texto style={estilos.tituloBloque}>¿Cuántas preguntas quieres responder?</Texto>

          <View style={estilos.filaContador}>
            <BotonRedondo texto="−" onPress={() => cambiarCantidad(-1)} deshabilitado={cantidad <= 1} />
            <View style={estilos.contador}>
              <Texto style={[estilos.numero, { color: tema.primario }]}>{cantidad}</Texto>
              <Texto suave>de {TOTAL_PREGUNTAS}</Texto>
            </View>
            <BotonRedondo
              texto="+"
              onPress={() => cambiarCantidad(1)}
              deshabilitado={cantidad >= TOTAL_PREGUNTAS}
            />
          </View>

          <View style={estilos.filaChips}>
            {OPCIONES_RAPIDAS.map((n) => {
              const activo = n === cantidad;
              return (
                <Pressable
                  key={n}
                  onPress={() => setCantidad(n)}
                  style={[estilos.chip, { backgroundColor: activo ? tema.primario : alfa(tema.primario, 0.12) }]}
                >
                  <Texto style={[estilos.textoChip, { color: activo ? tema.sobrePrimario : tema.primario }]}>
                    {n === TOTAL_PREGUNTAS ? 'Todas' : n}
                  </Texto>
                </Pressable>
              );
            })}
          </View>
          <Texto suave style={estilos.nota}>
            🔀 Las preguntas y sus alternativas salen en orden aleatorio cada vez.
          </Texto>
        </Tarjeta>

        {/* ---------- Tema de colores ---------- */}
        <Tarjeta style={estilos.bloque}>
          <Texto style={estilos.tituloBloque}>Tema de colores</Texto>
          <View style={estilos.grillaTemas}>
            {/* map + key única: cada tema se dibuja a partir del objeto TEMAS */}
            {Object.entries(TEMAS).map(([clave, t]) => {
              const activo = clave === claveTema;
              return (
                <Pressable key={clave} onPress={() => cambiarTema(clave)} style={estilos.itemTema}>
                  <View
                    style={[
                      estilos.muestraTema,
                      { backgroundColor: t.primario, borderColor: activo ? tema.texto : t.borde },
                      activo && estilos.muestraActiva,
                    ]}
                  >
                    <View style={[estilos.mitadTema, { backgroundColor: t.fondo }]} />
                    <Texto style={estilos.emojiTema}>{t.emoji}</Texto>
                  </View>
                  <Texto
                    suave={!activo}
                    style={[estilos.nombreTema, activo && { color: tema.primario, fontWeight: '800' }]}
                  >
                    {t.nombre}
                  </Texto>
                </Pressable>
              );
            })}
          </View>
        </Tarjeta>

        <Boton titulo="Comenzar  ▶" onPress={comenzar} style={estilos.bloque} />
        <View style={estilos.pie}>
          <Etiqueta texto="UTEM · Desarrollo de Aplicaciones Móviles y Web · T10" color={tema.acento} />
        </View>
      </ScrollView>
    </Pantalla>
  );
}

function BotonRedondo({ texto, onPress, deshabilitado }) {
  const { tema } = useTema();
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado}
      hitSlop={8}
      style={[estilos.redondo, { backgroundColor: alfa(tema.primario, deshabilitado ? 0.08 : 0.18) }]}
    >
      <Texto style={[estilos.textoRedondo, { color: tema.primario, opacity: deshabilitado ? 0.4 : 1 }]}>
        {texto}
      </Texto>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  contenido: { padding: 20, alignItems: 'stretch' },
  logo: {
    width: 88, height: 88, borderRadius: 44, alignSelf: 'center', marginTop: 12,
    alignItems: 'center', justifyContent: 'center', borderWidth: 3,
  },
  emojiLogo: { fontSize: 44 },
  titulo: { fontSize: 32, fontWeight: '900', textAlign: 'center', marginTop: 14 },
  subtitulo: { textAlign: 'center', marginTop: 4 },
  bloque: { marginTop: 18 },
  tituloBloque: { fontSize: 17, fontWeight: '800' },
  filaContador: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 },
  contador: { alignItems: 'center' },
  numero: { fontSize: 52, fontWeight: '900' },
  redondo: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  textoRedondo: { fontSize: 30, fontWeight: '800', lineHeight: 34 },
  filaChips: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  textoChip: { fontWeight: '800' },
  nota: { marginTop: 10, fontSize: 13 },
  grillaTemas: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  itemTema: { width: 64, alignItems: 'center' },
  muestraTema: {
    width: 56, height: 56, borderRadius: 16, borderWidth: 1, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  muestraActiva: { borderWidth: 3 },
  mitadTema: { position: 'absolute', top: 0, left: 0, right: 0, height: '50%' },
  emojiTema: { fontSize: 24 },
  nombreTema: { fontSize: 11, marginTop: 4 },
  pie: { alignItems: 'center', marginTop: 16 },
});
