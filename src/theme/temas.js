// Paletas de colores de la app. Cada tema define los mismos campos,
// así los componentes no necesitan saber qué tema está activo.

export const TEMAS = {
  claro: {
    nombre: 'Claro', emoji: '☀️', oscuro: false,
    fondo: '#EEF2FF', fondo2: '#FDF2F8',
    tarjeta: '#FFFFFF', borde: '#E2E8F0',
    texto: '#0F172A', textoSuave: '#64748B',
    primario: '#6D28D9', sobrePrimario: '#FFFFFF', acento: '#DB2777',
    correcto: '#16A34A', incorrecto: '#DC2626',
  },
  oscuro: {
    nombre: 'Oscuro', emoji: '🌙', oscuro: true,
    fondo: '#0F172A', fondo2: '#1E1B4B',
    tarjeta: '#1E293B', borde: '#334155',
    texto: '#F1F5F9', textoSuave: '#94A3B8',
    primario: '#8B5CF6', sobrePrimario: '#FFFFFF', acento: '#22D3EE',
    correcto: '#22C55E', incorrecto: '#F43F5E',
  },
  matrix: {
    nombre: 'Matrix', emoji: '💊', oscuro: true, mono: true,
    fondo: '#000000', fondo2: '#001A08',
    tarjeta: '#031207', borde: '#0B5D1E',
    texto: '#39FF14', textoSuave: '#1FA84A',
    primario: '#00FF41', sobrePrimario: '#000000', acento: '#B6FFB0',
    correcto: '#00FF41', incorrecto: '#FF3B3B',
  },
  oceano: {
    nombre: 'Océano', emoji: '🌊', oscuro: true,
    fondo: '#042F4B', fondo2: '#0E7490',
    tarjeta: '#0B3B5C', borde: '#155E75',
    texto: '#E0F2FE', textoSuave: '#7DD3FC',
    primario: '#38BDF8', sobrePrimario: '#042F4B', acento: '#5EEAD4',
    correcto: '#34D399', incorrecto: '#FB7185',
  },
  atardecer: {
    nombre: 'Atardecer', emoji: '🌅', oscuro: false,
    fondo: '#FFEDD5', fondo2: '#FECDD3',
    tarjeta: '#FFFBF5', borde: '#FED7AA',
    texto: '#431407', textoSuave: '#9A3412',
    primario: '#EA580C', sobrePrimario: '#FFFFFF', acento: '#E11D48',
    correcto: '#15803D', incorrecto: '#BE123C',
  },
  neon: {
    nombre: 'Neón', emoji: '⚡', oscuro: true,
    fondo: '#12001F', fondo2: '#2A0040',
    tarjeta: '#1C0530', borde: '#FF00E5',
    texto: '#FFFFFF', textoSuave: '#E9A8FF',
    primario: '#FF00E5', sobrePrimario: '#FFFFFF', acento: '#00F0FF',
    correcto: '#00FFA3', incorrecto: '#FF2E63',
  },
  bosque: {
    nombre: 'Bosque', emoji: '🌲', oscuro: true,
    fondo: '#052E16', fondo2: '#1A2E05',
    tarjeta: '#14361F', borde: '#3F6212',
    texto: '#ECFCCB', textoSuave: '#A3E635',
    primario: '#84CC16', sobrePrimario: '#052E16', acento: '#FACC15',
    correcto: '#4ADE80', incorrecto: '#F87171',
  },
};

export const TEMA_INICIAL = 'oscuro';

/** Agrega transparencia a un color hexadecimal (#RRGGBB) -> #RRGGBBAA. */
export function alfa(hex, opacidad) {
  const a = Math.round(opacidad * 255).toString(16).padStart(2, '0');
  return hex + a;
}
