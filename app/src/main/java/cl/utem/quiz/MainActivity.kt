package cl.utem.quiz

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.core.tween
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.toArgb
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import cl.utem.quiz.ui.screens.HomeScreen
import cl.utem.quiz.ui.screens.QuizScreen
import cl.utem.quiz.ui.screens.ResultScreen
import cl.utem.quiz.ui.theme.QuizTheme
import cl.utem.quiz.ui.theme.ThemePrefs

/** Rutas de navegación de la app. */
object Routes {
    const val HOME = "home"
    const val QUIZ = "quiz"
    const val RESULTS = "results"
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            var palette by remember { mutableStateOf(ThemePrefs.load(this)) }

            // Barras del sistema acordes al tema (íconos claros u oscuros).
            LaunchedEffect(palette) {
                val style = if (palette.isDark)
                    SystemBarStyle.dark(android.graphics.Color.TRANSPARENT)
                else
                    SystemBarStyle.light(android.graphics.Color.TRANSPARENT, palette.text.toArgb())
                enableEdgeToEdge(statusBarStyle = style, navigationBarStyle = style)
            }

            QuizTheme(palette) {
                val nav = rememberNavController()
                // ViewModel compartido entre las 3 pantallas (vive mientras viva la Activity).
                val vm: QuizViewModel = viewModel()

                Box(Modifier.fillMaxSize().background(palette.background)) {
                    NavHost(
                        navController = nav,
                        startDestination = Routes.HOME,
                        enterTransition = { slideInHorizontally(tween(280)) { it / 3 } + fadeIn(tween(280)) },
                        exitTransition = { fadeOut(tween(180)) },
                        popEnterTransition = { fadeIn(tween(220)) },
                        popExitTransition = { slideOutHorizontally(tween(260)) { it / 3 } + fadeOut(tween(260)) },
                    ) {
                        composable(Routes.HOME) {
                            HomeScreen(
                                palette = palette,
                                onPaletteChange = {
                                    palette = it
                                    ThemePrefs.save(this@MainActivity, it)
                                },
                                onStart = { count ->
                                    vm.start(count)
                                    // launchSingleTop evita apilar dos quizzes por doble toque.
                                    nav.navigate(Routes.QUIZ) { launchSingleTop = true }
                                },
                            )
                        }
                        composable(Routes.QUIZ) {
                            QuizScreen(
                                state = vm.state,
                                onSelect = vm::select,
                                onNext = {
                                    if (vm.next()) {
                                        // REPLACE: el quiz se saca de la pila y se reemplaza por
                                        // los resultados. Así "atrás" en resultados no vuelve a
                                        // un quiz ya terminado, sino al inicio.
                                        nav.navigate(Routes.RESULTS) {
                                            popUpTo(Routes.QUIZ) { inclusive = true }
                                            launchSingleTop = true
                                        }
                                    }
                                },
                                onExit = { nav.popBackStack(Routes.HOME, inclusive = false) },
                            )
                        }
                        composable(Routes.RESULTS) {
                            ResultScreen(
                                current = vm.state,
                                onRetryWrong = {
                                    vm.retryWrong()
                                    // REPLACE: resultados -> nueva ronda (pila: home, quiz).
                                    nav.navigate(Routes.QUIZ) {
                                        popUpTo(Routes.RESULTS) { inclusive = true }
                                        launchSingleTop = true
                                    }
                                },
                                onHome = { nav.popBackStack(Routes.HOME, inclusive = false) },
                            )
                        }
                    }
                }
            }
        }
    }
}
