# Quiz Informática · T10 Encuesta o quiz con resultados inmediatos

App móvil en **React Native + Expo (JavaScript)** para la Evaluación Unidad 3 de *Desarrollo de Aplicaciones Móviles y Web* (UTEM, 2026). Contiene 30 preguntas de informática con corrección inmediata, un informe final con los errores y la opción de repetir solo las preguntas falladas.

## Funcionalidades
- **Elegir la cantidad de preguntas** (de 1 a 30), con botones − / + o accesos rápidos (5, 10, 15, 20, Todas).
- **Orden aleatorio**: en cada intento cambian las preguntas y también el orden de sus alternativas.
- **Corrección inmediata**:
  - Si aciertas, un mensaje breve explica por qué la respuesta es correcta.
  - Si fallas, la app muestra lo que elegiste, la respuesta correcta y la explicación completa.
- **Informe final**: porcentaje, correctas, errores, mejor racha, récord personal guardado y lista de errores cometidos.
- **Repetir solo las falladas**: una ronda nueva con las preguntas erradas, que se puede repetir hasta no tener errores.
- **7 temas de colores** (Claro, Oscuro, Matrix, Océano, Atardecer, Neón y Bosque). La app recuerda el tema elegido.
- **Medición de velocidad**: cada respuesta muestra cuánto tardó la corrección (en microsegundos) y en cuánto quedó lista la pantalla (en milisegundos). El informe muestra los promedios.

## Lo que pide la pauta ("Debe demostrar")
| Concepto | Dónde está |
|---|---|
| **Estado complejo con `useState`** | `src/screens/QuizScreen.js`: un solo objeto `estado` (preguntas, índice, selección, respuestas, racha, mejor racha). Se inicializa de forma perezosa (`useState(() => ...)`) y se actualiza con funciones `setEstado(prev => ({ ...prev, ... }))`, sin modificar el objeto anterior. |
| **Render condicional** | La retroalimentación existe solo si hay respuesta (`{respondida && ...}`), con mensaje distinto si acierta o falla. En `ResultadosScreen.js` el botón "Repetir falladas" solo aparece si hubo errores, y si no los hubo se muestra "¡Sin errores!". |
| **Navegación controlada** | React Navigation (native stack). No se avanza sin responder. Salir del quiz (botón atrás de Android o la ✕) pide confirmación con el evento `beforeRemove`. El gesto de deslizar para volver está desactivado en el quiz. |
| **Uso correcto de `replace`** | Al terminar: `navigation.replace('Resultados', ...)`; el quiz sale de la pila y "atrás" desde Resultados vuelve a Inicio, no a un quiz ya terminado. Al repetir falladas: `navigation.replace('Quiz', ...)`, y la pila queda Inicio → Quiz. |

### Flujo de la pila de navegación
```
Inicio --navigate--> Inicio, Quiz --replace--> Inicio, Resultados --replace--> Inicio, Quiz ...
                                         atrás desde Resultados → Inicio
```

## Rendimiento y async/await
- La **corrección es síncrona y ocurre en memoria** (`corregir()` en `src/logic/quiz.js`): es una comparación entre la alternativa elegida y la correcta, sin red ni disco. Se miden dos tiempos con `performance.now()`:
  1. **Corrección (lógica)**: solo la función `corregir()`. Tarda **microsegundos**.
  2. **Pantalla lista**: desde el toque hasta que React aplicó el cambio en la interfaz (`useLayoutEffect`). Tarda **milisegundos**, porque incluye dibujar las alternativas y el mensaje.
- **Por qué la corrección NO usa `await`**: `await` sirve para esperar operaciones lentas (red, disco). La corrección no espera nada; ponerle `await` solo la retrasaría una vuelta en la cola de tareas.
- **async/await se usa donde corresponde**, en lo que sí es lento: leer y guardar en el almacenamiento del teléfono (`src/logic/almacen.js`, con `try/catch`). El tema y el récord se guardan **en segundo plano**; la interfaz no espera a que termine el guardado.

### Medición propia (emulador, sin aceleración gráfica)
| Medición | Valor |
|---|---|
| Corrección (lógica) | 57,5 µs en una respuesta; 315 µs de promedio en 5 respuestas |
| Pantalla lista tras responder | 40 a 44 ms |
| Apertura en frío de la app | 5,5 a 8,5 s (emulador por software) |

> Estos valores son del emulador, que dibuja sin GPU. En un teléfono real deberían ser bastante menores: **la medición en teléfono físico queda pendiente** y es la que pide la pauta.
- Las animaciones usan `useNativeDriver: true` (corren en el hilo nativo y no bloquean JavaScript), y la lista de errores usa `FlatList`.

## Estructura
```
App.js                      # Proveedor de tema + pila de navegación
src/
├── data/preguntas.js       # Banco de 30 preguntas
├── logic/quiz.js           # Funciones puras: barajar, armar quiz, corregir, repaso
├── logic/almacen.js        # AsyncStorage con async/await y try/catch
├── logic/medicion.js       # performance.now() y promedio con reduce
├── theme/temas.js          # 7 paletas de colores
├── theme/TemaContext.js    # Contexto del tema (lectura/guardado asíncrono)
├── components/ui.js        # Pantalla, Tarjeta, Boton, Etiqueta, Texto
└── screens/
    ├── InicioScreen.js     # Cantidad de preguntas y tema
    ├── QuizScreen.js       # Estado del quiz, corrección, navegación controlada
    └── ResultadosScreen.js # Informe final y repetir falladas
```

## Cómo ejecutarlo
Requisitos: Node.js 20 o superior.

```bash
npm install
npx expo start
```
- **Teléfono real**: instala **Expo Go** desde Play Store y escanea el código QR que aparece en la terminal (el PC y el teléfono deben estar en la misma red Wi‑Fi).
- **APK instalable**: el archivo `QuizInformatica.apk` está en la sección *Releases* del repositorio.

Para compilar el APK localmente (requiere Android SDK y JDK 17 o 21). En Windows, además: rutas largas activadas (`LongPathsEnabled`), CMake 3.31 o superior (`cmake.dir` en `android/local.properties`) y el proyecto en una ruta corta, por ejemplo `D:\qz`:
```bash
npx expo prebuild -p android
cd android && ./gradlew assembleRelease
```
