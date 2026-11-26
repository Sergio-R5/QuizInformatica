# Quiz Informática (T10 – Encuesta o quiz con resultados inmediatos)

App Android (Kotlin + Jetpack Compose) con las 30 preguntas del *Informe de Evaluación Técnica en Informática*.

## Funcionalidades
- **Elegir cantidad de preguntas** (1 a 30) con deslizador o accesos rápidos (5, 10, 15, 20, Todas).
- **Preguntas al azar** en cada intento; además se **barajan las alternativas** (la correcta no queda siempre en la misma letra).
- **Corrección inmediata**:
  - Si aciertas: mensaje breve de *por qué es correcto*.
  - Si fallas: muestra lo que elegiste, cuál era la correcta y la explicación completa.
- **Informe final**: porcentaje animado, correctas, errores, mejor racha y la lista de errores cometidos con su explicación.
- **Repetir solo las falladas**: nueva ronda solo con las preguntas erradas (barajadas otra vez), se puede repetir hasta no tener errores.
- **7 temas de colores**: Claro, Oscuro, Matrix (fuente monoespaciada), Océano, Atardecer, Neón y Bosque. El tema elegido se recuerda.

## Cómo cumple lo que pide la pauta ("Debe demostrar")
| Requisito (pauta) | Dónde está |
|---|---|
| **Estado complejo con useState** | En Compose el equivalente a `useState` es `mutableStateOf`. `QuizViewModel.kt` guarda todo el quiz en un solo objeto inmutable `QuizState` (preguntas, índice, selección, respuestas, ronda, racha) y lo actualiza con `copy(...)`, igual que `setState({...state})` en React. Estado local de pantalla: `rememberSaveable { mutableIntStateOf(10) }` en `HomeScreen.kt`. |
| **Render condicional** | `QuizScreen.kt`: la retroalimentación solo aparece cuando hay respuesta (`AnimatedVisibility(visible = selected != null)`), mensaje distinto si es correcta o no, colores según estado. `ResultScreen.kt`: botón "Repetir falladas" solo si hay errores; tarjeta "¡Sin errores!" si no los hay. |
| **Navegación controlada** | `MainActivity.kt` usa Navigation Compose con 3 rutas (`home`, `quiz`, `results`). No se avanza sin responder (botón deshabilitado) y salir del quiz pide confirmación (`BackHandler` + diálogo). |
| **Uso correcto de replace** | Al terminar: `navigate(RESULTS) { popUpTo(QUIZ) { inclusive = true } }` → reemplaza el quiz por los resultados. Al repetir falladas: `popUpTo(RESULTS) { inclusive = true }`. Así el botón **atrás** nunca vuelve a un quiz ya terminado: desde resultados siempre lleva al inicio. `launchSingleTop` evita pantallas duplicadas por doble toque. |

## Estructura
```
app/src/main/java/cl/utem/quiz/
├── MainActivity.kt          # NavHost, rutas y "replace" (popUpTo inclusive)
├── QuizViewModel.kt         # Estado complejo del quiz
├── data/
│   ├── Question.kt          # Modelos (pregunta, alternativas barajadas, respuesta)
│   └── QuestionBank.kt      # Banco de 30 preguntas
└── ui/
    ├── theme/AppTheme.kt    # 7 temas + persistencia del tema
    └── screens/             # HomeScreen, QuizScreen, ResultScreen, componentes
```

## Compilar
Abrir la carpeta `QuizInformatica` en Android Studio y ejecutar ▶, o por consola:
```
gradlew assembleRelease
```
El APK queda en `app/build/outputs/apk/release/app-release.apk` (optimizado con R8 y firmado con la clave de depuración para instalarlo directo).
