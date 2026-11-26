package cl.utem.quiz.ui.screens

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import cl.utem.quiz.data.QuestionBank
import cl.utem.quiz.ui.theme.QuizPalette
import cl.utem.quiz.ui.theme.Themes
import kotlin.math.roundToInt

@Composable
fun HomeScreen(
    palette: QuizPalette,
    onPaletteChange: (QuizPalette) -> Unit,
    onStart: (Int) -> Unit,
) {
    val p = palette
    val max = QuestionBank.all.size
    // Estado local de la pantalla (equivalente a useState); sobrevive a rotaciones.
    var count by rememberSaveable { mutableIntStateOf(10) }

    Column(
        Modifier
            .fillMaxSize()
            .systemBarsPadding()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp, vertical = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Spacer(Modifier.height(12.dp))
        Box(
            Modifier
                .size(88.dp)
                .clip(CircleShape)
                .background(Brush.linearGradient(listOf(p.primary, p.accent))),
            contentAlignment = Alignment.Center,
        ) { Text("🧠", fontSize = 44.sp) }

        Spacer(Modifier.height(16.dp))
        Text(
            "Quiz Informática",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.ExtraBold,
            color = p.text,
        )
        Text(
            "$max preguntas · 6 módulos · corrección al instante",
            style = MaterialTheme.typography.bodyMedium,
            color = p.textSoft,
            textAlign = TextAlign.Center,
        )

        Spacer(Modifier.height(24.dp))

        // ---------- Cantidad de preguntas ----------
        QuizCard {
            Text("¿Cuántas preguntas quieres responder?", color = p.text,
                style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(10.dp))
            Row(verticalAlignment = Alignment.Bottom) {
                Text("$count", color = p.primary, fontSize = 48.sp, fontWeight = FontWeight.Black)
                Text("  de $max", color = p.textSoft, style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.padding(bottom = 10.dp))
            }
            Slider(
                value = count.toFloat(),
                onValueChange = { count = it.roundToInt() },
                valueRange = 1f..max.toFloat(),
                steps = max - 2,
                colors = SliderDefaults.colors(
                    thumbColor = p.primary, activeTrackColor = p.primary,
                    inactiveTrackColor = p.cardBorder,
                    activeTickColor = p.primary.copy(alpha = 0f), inactiveTickColor = p.cardBorder.copy(alpha = 0f),
                ),
            )
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(5, 10, 15, 20, max).forEach { n ->
                    val sel = n == count
                    val bg by animateColorAsState(if (sel) p.primary else p.primary.copy(alpha = 0.10f), label = "chip")
                    Surface(
                        modifier = Modifier.weight(1f).clip(RoundedCornerShape(12.dp)).clickable { count = n },
                        color = bg,
                        shape = RoundedCornerShape(12.dp),
                    ) {
                        Text(
                            if (n == max) "Todas" else "$n",
                            modifier = Modifier.padding(vertical = 10.dp),
                            textAlign = TextAlign.Center,
                            color = if (sel) p.onPrimary else p.primary,
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.labelLarge,
                        )
                    }
                }
            }
            Spacer(Modifier.height(6.dp))
            Text("🔀 Las preguntas y sus alternativas salen en orden aleatorio cada vez.",
                color = p.textSoft, style = MaterialTheme.typography.bodySmall)
        }

        Spacer(Modifier.height(16.dp))

        // ---------- Selector de tema ----------
        QuizCard {
            Text("Tema de colores", color = p.text,
                style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(12.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                items(Themes.all, key = { it.name }) { t ->
                    ThemeChip(t, selected = t.name == p.name, accentBorder = p.primary) { onPaletteChange(t) }
                }
            }
        }

        Spacer(Modifier.height(24.dp))
        PrimaryButton("Comenzar  ▶") { onStart(count) }
        Spacer(Modifier.height(12.dp))
    }
}

@Composable
private fun ThemeChip(t: QuizPalette, selected: Boolean, accentBorder: androidx.compose.ui.graphics.Color, onClick: () -> Unit) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.width(66.dp)) {
        Surface(
            modifier = Modifier.size(58.dp).clip(RoundedCornerShape(16.dp)).clickable(onClick = onClick),
            shape = RoundedCornerShape(16.dp),
            border = BorderStroke(if (selected) 3.dp else 1.dp, if (selected) accentBorder else t.cardBorder),
        ) {
            Box(
                Modifier.fillMaxSize().background(Brush.linearGradient(listOf(t.bgTop, t.primary, t.accent))),
                contentAlignment = Alignment.Center,
            ) { Text(t.emoji, fontSize = 24.sp) }
        }
        Spacer(Modifier.height(4.dp))
        Text(
            t.name,
            style = MaterialTheme.typography.labelSmall,
            color = if (selected) accentBorder else cl.utem.quiz.ui.theme.LocalPalette.current.textSoft,
            fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal,
        )
    }
}
