// bucket URL (e.g., 'https://storage.googleapis.com/YOUR_BUCKET_NAME')
//empty for the local host as no need to fetch anywhere else.
const QUIZ_BASE_URL = '';

fetch(`${QUIZ_BASE_URL}/JSONs/quiz-manifest.json`)
    .then((res) => {
        return res.json()
    })
    .then((manifest) => {
        const mainElement = document.querySelector("main");
        const startScreen = document.querySelector('.quiz-intro');
        const quizScreen = document.querySelector('.quiz-question');
        const resultScreen = document.querySelector('.result-section');

        const selectQuiz = document.querySelector('#quiz')

        const currentQuestion = document.querySelector('.question')
        const currentQuestionNo = document.querySelector('#current-question');
        const totalQuestions = document.querySelectorAll('.total-question');
        const totalQuestionResult = document.querySelector('#total-question')
        const scoreGained = document.querySelectorAll('.score'); // I think it's subject to change if I add negative marking
        const answerContainer = document.querySelector('.answers');
        const answerBtn = document.querySelectorAll('.answer-btn');
        const progressBar = document.querySelector('.progress-bar');
        const progressDone = document.querySelector('.progress');

        const resultMessage = document.querySelector('.congratulatory')

        const startBtn = document.querySelector('#start-btn')
        const restartBtn = document.querySelector('#restart-btn')

        //chatgpt for audio
        function loadAudioSafe(path) {
            const audio = new Audio(path);
            audio.preload = 'auto';

            audio.onerror = () => {
                console.warn(`Audio failed to load properly: ${path}`)
            };
            return audio;
        }
        const correctAuido = loadAudioSafe("success.mp3");
        correctAuido.volume = 0.1;
        const wrongAudio = loadAudioSafe("wrong.mp3");
        wrongAudio.volume = 1;

        /**@type {HTMLElement} */
        //SCREEN CODE --- no animatiosn rn , but well I can add it ig
        startScreen.style.display = 'block';

        //buttons
        startBtn.addEventListener("click", startQuiz) //no need to call here because it already expects a function(idk why)
        restartBtn.addEventListener("click", restartQuiz)

        // MAIN CODE

        // Populate dropdown from manifest
        manifest.forEach((quizItem, index) => {
            const selectQuizOption = document.createElement('option');
            selectQuizOption.value = quizItem.path; // Store path in value
            selectQuizOption.textContent = quizItem.title;
            selectQuizOption.className = 'quiz-select'
            selectQuizOption.dataset.value = index;
            selectQuiz.appendChild(selectQuizOption);
        });

        //QUIZ VAR
        let currentQuizData = null; // Will hold the data of the selected quiz

        //QUIZ VAR
        let questionIndex = 0;
        let score = 0;

        //Functions

        function visibleDisplay(prevScreen, toBeScreen) {
            prevScreen.style.display = 'none'; // first add a CSS property or remove
            toBeScreen.style.display = 'block';
        }

        function congratulatoryMessage() {
            let fractionCorrect = score / currentQuizData.questions.length;
            console.log(fractionCorrect)

            if (fractionCorrect == 1) {
                resultMessage.textContent = "Congratulations Genius!! You got all right.";
            }
            else if (fractionCorrect >= 0.8) {
                resultMessage.textContent = "Well Done Great job.";
            }
            else if (fractionCorrect >= 0.5) {
                resultMessage.textContent = "Good Try. Better luck next time.";
            }
            else if (fractionCorrect >= 0.2) {
                resultMessage.textContent = "Ooops , You could have done better.";
            }
            else {
                resultMessage.textContent = "Gotta Try Again."
            }
        }

        let showQuestion = () => {
            currentQuestion.textContent = currentQuizData.questions[questionIndex].Question; //showing the question
            currentQuestionNo.textContent = questionIndex + 1;
            //setting options
            currentQuizData.questions[questionIndex].answers.forEach((option, index) => {
                //NodeList is not an array , so Array.from()
                const btn = answerBtn[index];
                btn.textContent = option.text;
                btn.dataset.value = option.correct; //NOTE: dataset let's us add custom data
                btn.addEventListener("click", answerCheck)
            })

            questionIndex++;
        }

        function removeAnswerButton() {
            answerBtn.forEach(btn => {
                btn.classList.remove("disabled", "correct", "incorrect");
                btn.style.pointerEvents = 'auto';
            })
        }

        function answerCheck(event) {
            const selectedBtn = event.currentTarget;
            const isCorrect = selectedBtn.dataset.value === 'true';
            if (isCorrect) {
                selectedBtn.classList.add("correct");
                correctAuido.currentTime = 0;
                correctAuido.play();
                score++;
            }
            else {
                selectedBtn.classList.add("incorrect");
                wrongAudio.currentTime = 0;
                wrongAudio.play();
            }

            //forEach will give me 1 list element at a time
            answerBtn.forEach(btn => {
                btn.classList.add("disabled");
                btn.style.pointerEvents = 'none';
            });

            scoreGained.forEach(result => {
                result.textContent = score;
            });

            const quizDone = (questionIndex / currentQuizData.questions.length) * 100;
            progressDone.style.width = `${quizDone}%`;

            setTimeout(() => {
                if (questionIndex < currentQuizData.questions.length) {
                    removeAnswerButton();
                    showQuestion();
                }
                else {
                    visibleDisplay(quizScreen, resultScreen);
                    // score = 0;
                    removeAnswerButton();
                    congratulatoryMessage();
                }
            }, 500);
        }

        function startQuiz() {
            const selectedPath = selectQuiz.value;
            if (selectedPath === "choose") { // Assuming default value is "choose" or similar, but checking index is safer if "choose" is first
                if (selectQuiz.selectedIndex === 0) {
                    alert("please choose a Quiz");
                    return;
                }
            }

            // Fetch the selected quiz data
            fetch(`${QUIZ_BASE_URL}/${selectedPath}`) // Assuming path in manifest is relative to root, e.g. "JSONs/file.json"
                .then(res => res.json())
                .then(data => {
                    currentQuizData = data;

                    totalQuestions.forEach(totalNo => {
                        totalNo.textContent = currentQuizData.questions.length
                        console.log(totalNo.textContent);
                    })

                    questionIndex = 0;
                    visibleDisplay(startScreen, quizScreen)
                    showQuestion();
                })
                .catch(err => {
                    console.error("Failed to load quiz data", err);
                    alert("Failed to load quiz. Please try again.");
                });
        }

        function restartQuiz() {
            score = 0;
            currentQuizData = null;
            scoreGained.forEach(result => {
                result.textContent = score;
            });
            progressDone.style.width = `0%`;
            selectQuiz.selectedIndex = 0;
            visibleDisplay(resultScreen, startScreen);
        }
    })
