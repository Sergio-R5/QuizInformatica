// Componentes visuales reutilizables. Todos leen el tema activo con useTema(),
// por eso al cambiar de tema toda la app cambia de colores de inmediato.

import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTema } from '../theme/TemaContext';
import { alfa } from '../theme/temas';

/**
 * Escala para textos grandes según el ancho de la pantalla.
 * En un teléfono de 390 dp o más vale 1; en uno angosto (por ejemplo 320 dp) vale 0,82.
 */
export function useEscala() {
  const { width } = useWindowDimensions();
  return Math.min(1, Math.max(0.75, width / 390));
}

/**
 * Texto con el color y la tipografía del tema.
 * - Usa la fuente Inter incluida en la app, así se ve igual en cualquier teléfono
 *   (algunas marcas reemplazan la fuente del sistema y cortan los números en negrita).
 *   Matrix usa la letra monoespaciada del sistema.
 * - maxFontSizeMultiplier limita cuánto crece con la "letra grande" del sistema.
 * - ajustar: una sola línea que se achica si no cabe (para números grandes).
 */
export function Texto({ style, suave, ajustar, children, ...props }) {
  const { tema } = useTema();
  return (
    <Text
      style={[
        { color: suave ? tema.textoSuave : tema.texto, fontFamily: tema.mono ? 'monospace' : 'Inter' },
        style,
      ]}
      maxFontSizeMultiplier={1.3}
      {...(ajustar && { numberOfLines: 1, adjustsFontSizeToFit: true, minimumFontScale: 0.5 })}
      {...props}
    >
      {children}
    </Text>
  );
}

/** Contenedor de pantalla: fondo del tema y márgenes seguros (barra de estado, gestos). */
export function Pantalla({ children, style }) {
  const { tema } = useTema();
  return (
    <SafeAreaView style={[estilos.pantalla, { backgroundColor: tema.fondo }]} edges={['top', 'bottom']}>
      <View style={[estilos.pantalla, style]}>{children}</View>
    </SafeAreaView>
  );
}

/** Tarjeta con borde redondeado. `colorBorde` resalta (verde/rojo) cuando hace falta. */
export function Tarjeta({ children, colorBorde, style }) {
  const { tema } = useTema();
  return (
    <View
      style={[
        estilos.tarjeta,
        {
          backgroundColor: tema.tarjeta,
          borderColor: colorBorde ?? tema.borde,
          borderWidth: colorBorde ? 2 : 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Botón principal (relleno) o secundario (solo borde). */
export function Boton({ titulo, onPress, deshabilitado, secundario, style }) {
  const { tema } = useTema();
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado}
      android_ripple={{ color: alfa(secundario ? tema.primario : tema.sobrePrimario, 0.2) }}
      style={({ pressed }) => [
        estilos.boton,
        secundario
          ? { borderWidth: 1.5, borderColor: tema.primario, backgroundColor: 'transparent' }
          : { backgroundColor: deshabilitado ? alfa(tema.primario, 0.3) : tema.primario },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      <Texto
        style={[
          estilos.textoBoton,
          { color: secundario ? tema.primario : tema.sobrePrimario },
          deshabilitado && { opacity: 0.6 },
        ]}
      >
        {titulo}
      </Texto>
    </Pressable>
  );
}

/** Etiqueta pequeña tipo "píldora". */
export function Etiqueta({ texto, color }) {
  return (
    <View style={[estilos.etiqueta, { backgroundColor: alfa(color, 0.15) }]}>
      <Texto style={[estilos.textoEtiqueta, { color }]}>{texto}</Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1 },
  tarjeta: { borderRadius: 20, padding: 18 },
  boton: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  textoBoton: { fontSize: 17, fontWeight: '800', textAlign: 'center' },
  etiqueta: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  textoEtiqueta: { fontSize: 12, fontWeight: '800' },
});
