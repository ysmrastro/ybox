document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentQuestions = [];
    let currentIndex = 0;
    let score = 0;
    let isProcessing = false;

    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');

    const startBtn = document.getElementById('start-btn');
    const retryBtn = document.getElementById('retry-btn');

    const japaneseWord = document.getElementById('japanese-word');
    const optionsGrid = document.getElementById('options-grid');
    const questionNumber = document.getElementById('question-number');
    const scoreDisplay = document.getElementById('score-display');
    const progressBar = document.getElementById('progress-bar');

    const finalScoreVal = document.getElementById('final-score-val');
    const resultMessage = document.getElementById('result-message');

    // Init
    startBtn.addEventListener('click', startQuiz);
    retryBtn.addEventListener('click', startQuiz);

    function startQuiz() {
        // Reset state
        currentIndex = 0;
        score = 0;
        isProcessing = false;

        // Pick 10 random questions
        currentQuestions = [...window.quizData]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

        updateScore();
        showScreen(quizScreen);
        renderQuestion();
    }

    function renderQuestion() {
        const question = currentQuestions[currentIndex];
        isProcessing = false;

        // Update UI
        questionNumber.textContent = `第 ${currentIndex + 1} 問`;
        japaneseWord.textContent = question.question;
        progressBar.style.width = `${(currentIndex / 10) * 100}%`;

        // Render options
        optionsGrid.innerHTML = '';
        // Shuffle options
        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => handleAnswer(opt, btn));
            optionsGrid.appendChild(btn);
        });
    }

    function handleAnswer(selected, selectedBtn) {
        if (isProcessing) return;
        isProcessing = true;

        const question = currentQuestions[currentIndex];
        const isCorrect = selected === question.answer;

        // Disable all buttons
        const allBtns = optionsGrid.querySelectorAll('.option-btn');
        allBtns.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            score++;
            updateScore();
            selectedBtn.classList.add('correct');
            // Play success effect
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#ec4899', '#10b981']
            });
        } else {
            selectedBtn.classList.add('wrong');
            // Show correct answer
            allBtns.forEach(btn => {
                if (btn.textContent === question.answer) {
                    btn.classList.add('correct');
                }
            });
        }

        // Wait and move to next
        setTimeout(() => {
            currentIndex++;
            if (currentIndex < 10) {
                renderQuestion();
            } else {
                showResults();
            }
        }, 1500);
    }

    function updateScore() {
        scoreDisplay.textContent = `スコア: ${score}`;
    }

    function showResults() {
        progressBar.style.width = '100%';
        finalScoreVal.textContent = score;

        if (score === 10) {
            resultMessage.textContent = "完璧です！韓国語マスターですね！";
            confetti({
                particleCount: 150,
                spread: 180,
                origin: { y: 0.3 }
            });
        } else if (score >= 7) {
            resultMessage.textContent = "素晴らしい！その調子です！";
        } else {
            resultMessage.textContent = "お疲れ様でした！繰り返し練習しましょう。";
        }

        showScreen(resultScreen);
    }

    function showScreen(screen) {
        [startScreen, quizScreen, resultScreen].forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }
});
