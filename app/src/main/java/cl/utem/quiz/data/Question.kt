package cl.utem.quiz.data

import androidx.compose.runtime.Immutable

/** Pregunta tal como viene del banco (opciones en su orden original). */
@Immutable
data class Question(
    val id: Int,
    val module: String,
    val text: String,
    val options: List<String>,
    val correctIndex: Int,
    val explanation: String,
)

/**
 * Pregunta lista para mostrarse: las alternativas se barajan en cada intento,
 * así la respuesta correcta no queda siempre en la misma letra.
 */
@Immutable
data class QuizItem(
    val question: Question,
    val options: List<String>,
    val correctIndex: Int,
) {
    companion object {
        fun from(q: Question): QuizItem {
            val order = q.options.indices.shuffled()
            return QuizItem(
                question = q,
                options = order.map { q.options[it] },
                correctIndex = order.indexOf(q.correctIndex),
            )
        }
    }
}

/** Respuesta dada por el usuario a una pregunta. */
@Immutable
data class AnswerRecord(
    val item: QuizItem,
    val chosenIndex: Int,
) {
    val isCorrect: Boolean get() = chosenIndex == item.correctIndex
}

fun letter(i: Int): Char = 'A' + i
