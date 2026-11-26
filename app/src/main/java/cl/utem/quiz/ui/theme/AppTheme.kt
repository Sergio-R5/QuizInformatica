package cl.utem.quiz.ui.theme

import android.content.Context
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily

/** Paleta de cada tema visual de la app. */
@Immutable
data class QuizPalette(
    val name: String,
    val emoji: String,
    val isDark: Boolean,
    val bgTop: Color,
    val bgBottom: Color,
    val card: Color,
    val cardBorder: Color,
    val text: Color,
    val textSoft: Color,
    val primary: Color,
    val onPrimary: Color,
    val accent: Color,
    val correct: Color,
    val wrong: Color,
    val monospace: Boolean = false,
) {
    val background: Brush get() = Brush.verticalGradient(listOf(bgTop, bgBottom))
}

object Themes {
    val Claro = QuizPalette(
        name = "Claro", emoji = "☀️", isDark = false,
        bgTop = Color(0xFFEEF2FF), bgBottom = Color(0xFFFDF2F8),
        card = Color(0xFFFFFFFF), cardBorder = Color(0xFFE2E8F0),
        text = Color(0xFF0F172A), textSoft = Color(0xFF64748B),
        primary = Color(0xFF6D28D9), onPrimary = Color.White, accent = Color(0xFFDB2777),
        correct = Color(0xFF16A34A), wrong = Color(0xFFDC2626),
    )
    val Oscuro = QuizPalette(
        name = "Oscuro", emoji = "🌙", isDark = true,
        bgTop = Color(0xFF0F172A), bgBottom = Color(0xFF1E1B4B),
        card = Color(0xFF1E293B), cardBorder = Color(0xFF334155),
        text = Color(0xFFF1F5F9), textSoft = Color(0xFF94A3B8),
        primary = Color(0xFF8B5CF6), onPrimary = Color.White, accent = Color(0xFF22D3EE),
        correct = Color(0xFF22C55E), wrong = Color(0xFFF43F5E),
    )
    val Matrix = QuizPalette(
        name = "Matrix", emoji = "💊", isDark = true,
        bgTop = Color(0xFF000000), bgBottom = Color(0xFF001A08),
        card = Color(0xFF031207), cardBorder = Color(0xFF0B5D1E),
        text = Color(0xFF39FF14), textSoft = Color(0xFF1FA84A),
        primary = Color(0xFF00FF41), onPrimary = Color.Black, accent = Color(0xFFB6FFB0),
        correct = Color(0xFF00FF41), wrong = Color(0xFFFF3B3B),
        monospace = true,
    )
    val Oceano = QuizPalette(
        name = "Océano", emoji = "🌊", isDark = true,
        bgTop = Color(0xFF042F4B), bgBottom = Color(0xFF0E7490),
        card = Color(0xFF0B3B5C), cardBorder = Color(0xFF155E75),
        text = Color(0xFFE0F2FE), textSoft = Color(0xFF7DD3FC),
        primary = Color(0xFF38BDF8), onPrimary = Color(0xFF042F4B), accent = Color(0xFF5EEAD4),
        correct = Color(0xFF34D399), wrong = Color(0xFFFB7185),
    )
    val Atardecer = QuizPalette(
        name = "Atardecer", emoji = "🌅", isDark = false,
        bgTop = Color(0xFFFFEDD5), bgBottom = Color(0xFFFECDD3),
        card = Color(0xFFFFFBF5), cardBorder = Color(0xFFFED7AA),
        text = Color(0xFF431407), textSoft = Color(0xFF9A3412),
        primary = Color(0xFFEA580C), onPrimary = Color.White, accent = Color(0xFFE11D48),
        correct = Color(0xFF15803D), wrong = Color(0xFFBE123C),
    )
    val Neon = QuizPalette(
        name = "Neón", emoji = "⚡", isDark = true,
        bgTop = Color(0xFF12001F), bgBottom = Color(0xFF2A0040),
        card = Color(0xFF1C0530), cardBorder = Color(0xFFFF00E5),
        text = Color(0xFFFFFFFF), textSoft = Color(0xFFE9A8FF),
        primary = Color(0xFFFF00E5), onPrimary = Color.White, accent = Color(0xFF00F0FF),
        correct = Color(0xFF00FFA3), wrong = Color(0xFFFF2E63),
    )
    val Bosque = QuizPalette(
        name = "Bosque", emoji = "🌲", isDark = true,
        bgTop = Color(0xFF052E16), bgBottom = Color(0xFF1A2E05),
        card = Color(0xFF14361F), cardBorder = Color(0xFF3F6212),
        text = Color(0xFFECFCCB), textSoft = Color(0xFFA3E635),
        primary = Color(0xFF84CC16), onPrimary = Color(0xFF052E16), accent = Color(0xFFFACC15),
        correct = Color(0xFF4ADE80), wrong = Color(0xFFF87171),
    )

    val all = listOf(Claro, Oscuro, Matrix, Oceano, Atardecer, Neon, Bosque)

    fun byName(name: String?): QuizPalette = all.firstOrNull { it.name == name } ?: Oscuro
}

/** Guarda el tema elegido para recordarlo al abrir la app de nuevo. */
object ThemePrefs {
    private const val FILE = "quiz_prefs"
    private const val KEY = "theme"
    fun load(ctx: Context): QuizPalette =
        Themes.byName(ctx.getSharedPreferences(FILE, Context.MODE_PRIVATE).getString(KEY, null))

    fun save(ctx: Context, p: QuizPalette) {
        ctx.getSharedPreferences(FILE, Context.MODE_PRIVATE).edit().putString(KEY, p.name).apply()
    }
}

val LocalPalette = staticCompositionLocalOf { Themes.Oscuro }

@Composable
fun QuizTheme(palette: QuizPalette, content: @Composable () -> Unit) {
    val scheme = remember(palette) {
        if (palette.isDark) darkColorScheme(
            primary = palette.primary, onPrimary = palette.onPrimary,
            secondary = palette.accent, background = palette.bgTop,
            surface = palette.card, onSurface = palette.text, onBackground = palette.text,
        ) else lightColorScheme(
            primary = palette.primary, onPrimary = palette.onPrimary,
            secondary = palette.accent, background = palette.bgTop,
            surface = palette.card, onSurface = palette.text, onBackground = palette.text,
        )
    }
    val typography = remember(palette.monospace) {
        if (!palette.monospace) Typography() else {
            val base = Typography()
            fun TextStyle.mono() = copy(fontFamily = FontFamily.Monospace)
            base.copy(
                displayLarge = base.displayLarge.mono(), displayMedium = base.displayMedium.mono(),
                displaySmall = base.displaySmall.mono(), headlineLarge = base.headlineLarge.mono(),
                headlineMedium = base.headlineMedium.mono(), headlineSmall = base.headlineSmall.mono(),
                titleLarge = base.titleLarge.mono(), titleMedium = base.titleMedium.mono(),
                titleSmall = base.titleSmall.mono(), bodyLarge = base.bodyLarge.mono(),
                bodyMedium = base.bodyMedium.mono(), bodySmall = base.bodySmall.mono(),
                labelLarge = base.labelLarge.mono(), labelMedium = base.labelMedium.mono(),
                labelSmall = base.labelSmall.mono(),
            )
        }
    }
    CompositionLocalProvider(LocalPalette provides palette) {
        MaterialTheme(colorScheme = scheme, typography = typography, content = content)
    }
}
