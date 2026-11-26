package cl.utem.quiz

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import cl.utem.quiz.data.AnswerRecord
import cl.utem.quiz.data.QuestionBank
import cl.utem.quiz.data.QuizItem

/**
 * Estado complejo del quiz en un único objeto inmutable.
 * Equivale al `useState` de React: cada cambio crea una copia nueva (copy)
 * y Compose vuelve a dibujar solo lo que cambió.
 */
@Immutable
data class QuizState(
    val items: List<QuizItem> = emptyList(),
    val index: Int = 0,
    /** Alternativa elegida en la pregunta actual (null = aún sin responder). */
    val selected: Int? = null,
    val answers: List<AnswerRecord> = emptyList(),
    /** true cuando se están repitiendo solo las preguntas falladas. */
    val isRetryRound: Boolean = false,
    val round: Int = 1,
    val streak: Int = 0,
    val bestStreak: Int = 0,
) {
    val current: QuizItem? get() = items.getOrNull(index)
    val total: Int get() = items.size
    val isAnswered: Boolean get() = selected != null
    val isLast: Boolean get() = index == items.lastIndex
    val correctCount: Int get() = answers.count { it.isCorrect }
    val wrongAnswers: List<AnswerRecord> get() = answers.filterNot { it.isCorrect }
    val progress: Float
        get() = if (total == 0) 0f else (index + if (isAnswered) 1 else 0) / total.toFloat()
}

class QuizViewModel : ViewModel() {

    var state by mutableStateOf(QuizState())
        private set

    /** Inicia un quiz nuevo con [count] preguntas al azar del banco. */
    fun start(count: Int) {
        val n = count.coerceIn(1, QuestionBank.all.size)
        state = QuizState(items = QuestionBank.all.shuffled().take(n).map(QuizItem::from))
    }

    /** Inicia una ronda solo con las preguntas falladas (barajadas otra vez). */
    fun retryWrong() {
        val wrong = state.wrongAnswers.map { it.item.question }
        if (wrong.isEmpty()) return
        state = QuizState(
            items = wrong.shuffled().map(QuizItem::from),
            isRetryRound = true,
            round = state.round + 1,
        )
    }

    /** Registra la respuesta; ignora toques extra una vez respondida. */
    fun select(option: Int) {
        val s = state
        val item = s.current ?: return
        if (s.isAnswered) return
        val record = AnswerRecord(item, option)
        val streak = if (record.isCorrect) s.streak + 1 else 0
        state = s.copy(
            selected = option,
            answers = s.answers + record,
            streak = streak,
            bestStreak = maxOf(s.bestStreak, streak),
        )
    }

    /** Avanza a la siguiente pregunta. Devuelve true si el quiz terminó. */
    fun next(): Boolean {
        val s = state
        if (!s.isAnswered) return false
        if (s.isLast) return true
        state = s.copy(index = s.index + 1, selected = null)
        return false
    }
}
