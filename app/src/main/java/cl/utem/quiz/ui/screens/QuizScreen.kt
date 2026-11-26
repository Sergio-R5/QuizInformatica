package cl.utem.quiz.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import cl.utem.quiz.QuizState
import cl.utem.quiz.data.QuizItem
import cl.utem.quiz.data.letter
import cl.utem.quiz.ui.theme.LocalPalette

@Composable
fun QuizScreen(
    state: QuizState,
    onSelect: (Int) -> Unit,
    onNext: () -> Unit,
    onExit: () -> Unit,
) {
    val p = LocalPalette.current
    var confirmExit by rememberSaveable { mutableStateOf(false) }

    // Si el sistema destruyó la app y no hay quiz cargado, volvemos al inicio.
    if (state.items.isEmpty()) {
        LaunchedEffect(Unit) { onExit() }
        return
    }

    // Botón atrás controlado: no se sale del quiz sin confirmar.
    BackHandler { confirmExit = true }

    if (confirmExit) {
        AlertDialog(
            onDismissRequest = { confirmExit = false },
            containerColor = p.card,
            titleContentColor = p.text,
            textContentColor = p.textSoft,
            title = { Text("¿Abandonar el quiz?") },
            text = { Text("Perderás el progreso de esta ronda (${state.answers.size} de ${state.total} respondidas).") },
            confirmButton = {
                TextButton(onClick = { confirmExit = false; onExit() }) {
                    Text("Salir", color = p.wrong, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { confirmExit = false }) { Text("Seguir jugando", color = p.primary) }
            },
        )
    }

    val progress by animateFloatAsState(state.progress, tween(400), label = "progress")

    Column(
        Modifier
            .fillMaxSize()
            .systemBarsPadding()
            .padding(horizontal = 18.dp, vertical = 12.dp),
    ) {
        // ---------- Encabezado ----------
        Row(verticalAlignment = Alignment.CenterVertically) {
            Surface(
                onClick = { confirmExit = true },
                shape = CircleShape,
                color = p.card,
                border = BorderStroke(1.dp, p.cardBorder),
                modifier = Modifier.size(40.dp),
            ) { Box(contentAlignment = Alignment.Center) { Text("✕", color = p.text, fontSize = 16.sp) } }
            Spacer(Modifier.width(12.dp))
            Column(Modifier.weight(1f)) {
                Text(
                    if (state.isRetryRound) "Repaso de errores · ronda ${state.round}" else "Pregunta ${state.index + 1} de ${state.total}",
                    color = p.text, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold,
                )
                if (state.isRetryRound) {
                    Text("Pregunta ${state.index + 1} de ${state.total}", color = p.textSoft,
                        style = MaterialTheme.typography.labelMedium)
                }
            }
            Tag("✔ ${state.correctCount}", p.correct)
            if (state.streak >= 2) {
                Spacer(Modifier.width(6.dp))
                Tag("🔥 ${state.streak}", p.accent)
            }
        }
        Spacer(Modifier.height(12.dp))
        LinearProgressIndicator(
            progress = { progress },
            modifier = Modifier.fillMaxWidth().height(10.dp).clip(RoundedCornerShape(50)),
            color = p.primary,
            trackColor = p.cardBorder,
            drawStopIndicator = {},
            gapSize = 0.dp,
        )
        Spacer(Modifier.height(14.dp))

        // ---------- Pregunta (animada al cambiar) ----------
        AnimatedContent(
            targetState = state.index,
            transitionSpec = {
                (slideInHorizontally(tween(300)) { it } + fadeIn(tween(300)))
                    .togetherWith(slideOutHorizontally(tween(300)) { -it } + fadeOut(tween(200)))
            },
            modifier = Modifier.weight(1f),
            label = "question",
        ) { idx ->
            val item = state.items[idx]
            // Solo la pregunta visible usa la selección actual; la saliente se muestra respondida.
            val selected = if (idx == state.index) state.selected else state.answers.getOrNull(idx)?.chosenIndex
            QuestionPage(item = item, selected = selected, onSelect = onSelect)
        }

        Spacer(Modifier.height(10.dp))
        PrimaryButton(
            text = if (state.isLast) "Ver resultados  🏁" else "Siguiente  ➜",
            enabled = state.isAnswered,
            onClick = onNext,
        )
    }
}

@Composable
private fun QuestionPage(item: QuizItem, selected: Int?, onSelect: (Int) -> Unit) {
    val p = LocalPalette.current
    val haptics = LocalHapticFeedback.current
    val scroll = rememberScrollState()
    // Al responder, baja suavemente hasta el mensaje de retroalimentación.
    LaunchedEffect(selected != null) {
        if (selected != null) {
            delay(330) // espera a que termine la animación de aparición
            scroll.animateScrollTo(scroll.maxValue, tween(450))
        }
    }
    Column(Modifier.fillMaxSize().verticalScroll(scroll)) {
        Tag(item.question.module, p.accent)
        Spacer(Modifier.height(10.dp))
        Text(
            item.question.text,
            color = p.text,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            lineHeight = 28.sp,
        )
        Spacer(Modifier.height(16.dp))

        item.options.forEachIndexed { i, option ->
            OptionRow(
                index = i,
                text = option,
                answered = selected != null,
                isCorrect = i == item.correctIndex,
                isChosen = i == selected,
                onClick = {
                    haptics.performHapticFeedback(
                        if (i == item.correctIndex) HapticFeedbackType.TextHandleMove else HapticFeedbackType.LongPress
                    )
                    onSelect(i)
                },
            )
            Spacer(Modifier.height(10.dp))
        }

        // ---------- Retroalimentación inmediata (render condicional) ----------
        AnimatedVisibility(
            visible = selected != null,
            enter = fadeIn(tween(250)) + expandVertically(tween(300)),
        ) {
            if (selected != null) Feedback(item, selected)
        }
        Spacer(Modifier.height(8.dp))
    }
}

@Composable
private fun OptionRow(
    index: Int,
    text: String,
    answered: Boolean,
    isCorrect: Boolean,
    isChosen: Boolean,
    onClick: () -> Unit,
) {
    val p = LocalPalette.current
    val target: Color = when {
        !answered -> p.cardBorder
        isCorrect -> p.correct
        isChosen -> p.wrong
        else -> p.cardBorder.copy(alpha = 0.4f)
    }
    val border by animateColorAsState(target, tween(250), label = "border")
    val bg by animateColorAsState(
        when {
            answered && isCorrect -> p.correct.copy(alpha = 0.16f)
            answered && isChosen -> p.wrong.copy(alpha = 0.16f)
            else -> p.card
        }, tween(250), label = "bg",
    )
    val scale by animateFloatAsState(
        if (answered && (isChosen || isCorrect)) 1.02f else 1f,
        spring(dampingRatio = 0.45f, stiffness = 600f), label = "scale",
    )
    val dim = answered && !isCorrect && !isChosen

    Surface(
        onClick = onClick,
        enabled = !answered,
        modifier = Modifier.fillMaxWidth().scale(scale),
        shape = RoundedCornerShape(16.dp),
        color = bg,
        border = BorderStroke(if (answered && (isChosen || isCorrect)) 2.dp else 1.dp, border),
    ) {
        Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            val badgeColor = when {
                answered && isCorrect -> p.correct
                answered && isChosen -> p.wrong
                else -> p.primary
            }
            Box(
                Modifier.size(34.dp).clip(CircleShape).background(badgeColor.copy(alpha = if (dim) 0.25f else 1f)),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    when {
                        answered && isCorrect -> "✓"
                        answered && isChosen -> "✕"
                        else -> letter(index).toString()
                    },
                    color = Color.White, fontWeight = FontWeight.Black,
                )
            }
            Spacer(Modifier.width(12.dp))
            Text(
                text,
                color = p.text.copy(alpha = if (dim) 0.45f else 1f),
                style = MaterialTheme.typography.bodyLarge,
            )
        }
    }
}

@Composable
private fun Feedback(item: QuizItem, selected: Int) {
    val p = LocalPalette.current
    val ok = selected == item.correctIndex
    val color = if (ok) p.correct else p.wrong
    QuizCard(borderColor = color) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(if (ok) "🎉" else "❌", fontSize = 24.sp)
            Text(
                if (ok) "¡Correcto!" else "Incorrecto",
                color = color, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Black,
            )
        }
        Spacer(Modifier.height(8.dp))
        if (!ok) {
            Text(
                "Elegiste ${letter(selected)}) ${item.options[selected]}",
                color = p.wrong, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold,
            )
            Spacer(Modifier.height(4.dp))
            Text(
                "La respuesta correcta es ${letter(item.correctIndex)}) ${item.options[item.correctIndex]}",
                color = p.correct, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold,
            )
            Spacer(Modifier.height(10.dp))
            Text("¿Por qué?", color = p.text, style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold)
        } else {
            Text("¿Por qué es correcto?", color = p.text, style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(2.dp))
        Text(
            // Si acertaste: mensaje breve (primera oración). Si fallaste: explicación completa.
            if (ok) firstSentence(item.question.explanation) else item.question.explanation,
            color = p.textSoft, style = MaterialTheme.typography.bodyMedium, lineHeight = 20.sp,
        )
    }
}

private fun firstSentence(text: String): String {
    val cut = Regex("""\.\s""").find(text)?.range?.first ?: return text
    return text.substring(0, cut + 1)
}
