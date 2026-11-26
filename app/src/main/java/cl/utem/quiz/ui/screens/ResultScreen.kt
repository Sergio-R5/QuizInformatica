package cl.utem.quiz.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cl.utem.quiz.QuizState
import cl.utem.quiz.data.AnswerRecord
import cl.utem.quiz.data.letter
import cl.utem.quiz.ui.theme.LocalPalette
import kotlin.math.roundToInt

@Composable
fun ResultScreen(
    current: QuizState,
    onRetryWrong: () -> Unit,
    onHome: () -> Unit,
) {
    val p = LocalPalette.current
    // Copia fija del resultado al entrar: si se inicia una nueva ronda, esta pantalla
    // (que aún se ve durante la animación de salida) no cambia ni reacciona al estado nuevo.
    val state = remember { current }

    if (state.answers.isEmpty()) {
        LaunchedEffect(Unit) { onHome() }
        return
    }

    // Atrás desde resultados siempre lleva al inicio (el quiz terminado ya no está en la pila).
    BackHandler(onBack = onHome)

    val total = state.answers.size
    val correct = state.correctCount
    val wrong = state.wrongAnswers
    val pct = correct * 100f / total

    LazyColumn(
        modifier = Modifier.fillMaxSize().systemBarsPadding(),
        contentPadding = PaddingValues(horizontal = 18.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item(key = "header") {
            Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    if (state.isRetryRound) "Resultado del repaso" else "Informe final",
                    color = p.text, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.ExtraBold,
                )
                Spacer(Modifier.height(16.dp))
                ScoreRing(pct = pct, label = "$correct/$total")
                Spacer(Modifier.height(12.dp))
                Text(
                    message(pct), color = p.text, style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold, textAlign = TextAlign.Center,
                )
            }
        }

        item(key = "stats") {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Stat("Correctas", "$correct", p.correct, Modifier.weight(1f))
                Stat("Errores", "${wrong.size}", p.wrong, Modifier.weight(1f))
                Stat("Racha", "🔥${state.bestStreak}", p.accent, Modifier.weight(1f))
            }
        }

        item(key = "actions") {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                if (wrong.isNotEmpty()) {
                    PrimaryButton("🔁 Repetir falladas (${wrong.size})", onClick = onRetryWrong)
                }
                SecondaryButton("🏠  Nuevo quiz", onClick = onHome)
            }
        }

        if (wrong.isEmpty()) {
            item(key = "perfect") {
                QuizCard(borderColor = p.correct) {
                    Text("🏆 ¡Sin errores!", color = p.correct, style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Black)
                    Text("Respondiste todo correctamente. No hay preguntas que repasar.",
                        color = p.textSoft, style = MaterialTheme.typography.bodyMedium)
                }
            }
        } else {
            item(key = "errors-title") {
                Text(
                    "Errores cometidos (${wrong.size})",
                    color = p.text, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 8.dp),
                )
            }
            items(wrong, key = { "err-${it.item.question.id}" }) { ErrorCard(it) }
        }
    }
}

@Composable
private fun ScoreRing(pct: Float, label: String) {
    val p = LocalPalette.current
    val anim = remember { Animatable(0f) }
    LaunchedEffect(pct) { anim.animateTo(pct / 100f, tween(1100, easing = FastOutSlowInEasing)) }
    val ringColor = when {
        pct >= 80 -> p.correct
        pct >= 50 -> p.accent
        else -> p.wrong
    }
    Box(Modifier.size(170.dp), contentAlignment = Alignment.Center) {
        Canvas(Modifier.fillMaxSize()) {
            val stroke = Stroke(width = 16.dp.toPx(), cap = StrokeCap.Round)
            drawArc(p.cardBorder, -90f, 360f, false, style = stroke)
            drawArc(ringColor, -90f, 360f * anim.value, false, style = stroke)
        }
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text("${(anim.value * 100).roundToInt()}%", color = ringColor, fontSize = 40.sp, fontWeight = FontWeight.Black)
            Text(label, color = p.textSoft, style = MaterialTheme.typography.titleSmall)
        }
    }
}

@Composable
private fun Stat(title: String, value: String, color: Color, modifier: Modifier) {
    val p = LocalPalette.current
    QuizCard(modifier) {
        Text(value, color = color, fontSize = 24.sp, fontWeight = FontWeight.Black,
            modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.Center)
        Text(title, color = p.textSoft, style = MaterialTheme.typography.labelMedium, maxLines = 1,
            modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.Center)
    }
}

@Composable
private fun ErrorCard(r: AnswerRecord) {
    val p = LocalPalette.current
    val item = r.item
    QuizCard(borderColor = p.wrong.copy(alpha = 0.6f)) {
        Tag("#${item.question.id} · ${item.question.module}", p.accent)
        Spacer(Modifier.height(8.dp))
        Text(item.question.text, color = p.text, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(8.dp))
        Text("✕ Tu respuesta: ${letter(r.chosenIndex)}) ${item.options[r.chosenIndex]}",
            color = p.wrong, style = MaterialTheme.typography.bodyMedium)
        Spacer(Modifier.height(4.dp))
        Text("✓ Correcta: ${letter(item.correctIndex)}) ${item.options[item.correctIndex]}",
            color = p.correct, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
        Spacer(Modifier.height(8.dp))
        Text(item.question.explanation, color = p.textSoft, style = MaterialTheme.typography.bodySmall, lineHeight = 18.sp)
    }
}

private fun message(pct: Float): String = when {
    pct >= 100f -> "¡Perfecto! Dominas el tema 🏆"
    pct >= 80f -> "¡Excelente trabajo! 🚀"
    pct >= 60f -> "¡Bien! Vas por buen camino 💪"
    pct >= 40f -> "Puedes mejorar, repasa tus errores 📚"
    else -> "A estudiar un poco más, ¡tú puedes! 🔁"
}
