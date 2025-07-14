//NOTE: for Questions --- options and correct answer should I make a JSON file or an OBJECT ? 

const mainElement = document.querySelector("main");
const startScreen = document.querySelector('.quiz-intro');
const quizScreen = document.querySelector('.quiz-question');
const resultScreen = document.querySelector('.result-section');

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
function loadAudioSafe(path){
    const audio = new Audio(path);
    audio.preload = 'auto';

    audio.onerror = () =>{
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
startBtn.addEventListener("click" , startQuiz) //no need to call here because it already expects a function(idk why)
restartBtn.addEventListener("click" , restartQuiz)

// MAIN CODE

const quizQuestions = [
    {
        "Question": "How many states of matter are commonly recognized?",
        "answers" : [
            {"text": "One" , "correct": false},
            {"text": "Two" , "correct": false},
            {"text": "Three" , "correct": false},
            {"text": "Four" , "correct": true}
        ]
    },
    {
        "Question": "What is the SI unit of Charge",
        "answers" : [
            {"text": "Ampere" , "correct": false},
            {"text": "Coulomb" , "correct": true},
            {"text": "Faraday" , "correct": false},
            {"text": "Ohm" , "correct": false}
        ]
    },
    {
        "Question": "Who discovered and studied the cell for the first time",
        "answers" : [
            {"text": "Issac Newton" , "correct": false},
            {"text": "Blaise Pascal" , "correct": false},
            {"text": "Robert Strain" , "correct": false},
            {"text": "Rober Hooke" , "correct": true}
        ]
    },
    {
        "Question": "Who invented the Radio",
        "answers" : [
            {"text": "Guglielmo Marconi" , "correct": true},
            {"text": "Nikola Tesla" , "correct": false},
            {"text": "Albert Einstein" , "correct": false},
            {"text": "James Clerk Maxwell" , "correct": false}
        ]
    },
    {
        "Question": "What is the chemical symbol for Silicon?",
        "answers" : [
            {"text": "S" , "correct": false},
            {"text": "Sl" , "correct": false},
            {"text": "Si" , "correct": true},
            {"text": "Sc" , "correct": false}
        ]
    },
    {
        "Question": "What is the capital of France?",
        "answers" : [
            {"text": "London" , "correct": false},
            {"text": "Berlin" , "correct": false},
            {"text": "Paris" , "correct": true},
            {"text": "Madrid" , "correct": false}
        ]
    },
    {
        "Question": "Which planet is known as the Red Planet?",
        "answers" : [
            {"text": "Venus" , "correct": false},
            {"text": "Mars" , "correct": true},
            {"text": "Jupiter" , "correct": false},
            {"text": "Saturn" , "correct": false}
        ]
    },
    {
        "Question": "Which is the second largest ocean on the Earth?",
        "answers" : [
            {"text": "Indian Ocean" , "correct": false},
            {"text": "Artic Ocean" , "correct": false},
            {"text": "Atlantic Ocean" , "correct": true},
            {"text": "Pacific Ocean" , "correct": false}
        ]
    },
    {
        "Question": "Which of the following is not a programming language?",
        "answers" : [
            {"text": "Java" , "correct": false},
            {"text": "Pearl" , "correct": true},
            {"text": "Rust" , "correct": false},
            {"text": "Ruby" , "correct": false}
        ]
    },
    {
        "Question": "What is the chemical symbol for Gold?",
        "answers" : [
            {"text": "Go" , "correct": false},
            {"text": "Ag" , "correct": false},
            {"text": "Gl" , "correct": false},
            {"text": "Au" , "correct": true}
        ]
    }
];

//QUIZ VAR

let questionIndex = 0;
let score = 0;
// totalQuestions.textContent = quizQuestions.length;
totalQuestions.forEach(totalNo => {
    totalNo.textContent = quizQuestions.length
})

//Functions

function visibleDisplay(prevScreen , toBeScreen){
    prevScreen.style.display = 'none'; // first add a CSS property or remove
    toBeScreen.style.display = 'block';
}

function congratulatoryMessage(){
    let fractionCorrect = score/quizQuestions.length;
    console.log(fractionCorrect)

    if(fractionCorrect == 1){
        resultMessage.textContent = "Congratulations Genius!! You got all right.";
    }
    else if(fractionCorrect >= 0.8) {
        resultMessage.textContent = "Well Done Great job.";
    }
    else if(fractionCorrect >= 0.5) {
        resultMessage.textContent = "Good Try. Better luck next time.";
    }
    else if(fractionCorrect >= 0.2) {
        resultMessage.textContent = "Ooops , You could have done better.";
    }
    else{
        resultMessage.textContent = "Gotta Try Again."
    }
}

let showQuestion = () => {
    currentQuestion.textContent = quizQuestions[questionIndex].Question; //showing the question
    currentQuestionNo.textContent = questionIndex + 1;
    //setting options
    quizQuestions[questionIndex].answers.forEach((option , index) => {
        //NOTE: if you wish to use this piece code first comment out answerBtn declaration at top and comment out li nodes as well from the HTML file

        /*
        const answerBtn = document.createElement('li');
        answerBtn.className = 'answer-btn';
        answerBtn.textContent = option.text;
        answerContainer.appendChild(answerBtn);
        */

        //NodeList is not an array , so Array.from()
        const btn = answerBtn[index];
        btn.textContent = option.text;
        btn.dataset.value = option.correct; //NOTE: dataset let's us add custom data
        btn.addEventListener("click" , answerCheck)
    })

    questionIndex++;
}

function answerCheck(event){
    const selectedBtn = event.currentTarget;
    const isCorrect = selectedBtn.dataset.value === 'true';
    if(isCorrect){
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

    //do I add it in showQuestion ? I mean would need to add another if so that at last question it can first show then change screen
    const quizDone = (questionIndex/quizQuestions.length)*100;
    progressDone.style.width = `${quizDone}%`;

    setTimeout(()=>{
        if(questionIndex < quizQuestions.length){
            answerBtn.forEach(btn => {
                btn.classList.remove("disabled" , "correct" , "incorrect");
                btn.style.pointerEvents = 'auto';
            })
            showQuestion();
        }
        else {
            visibleDisplay(quizScreen , resultScreen);

            // score = 0;
            answerBtn.forEach(btn => {
                btn.classList.remove("disabled" , "correct" , "incorrect");
                btn.style.pointerEvents = 'auto';
            })
            congratulatoryMessage();
        }
    } , 500);
}

function startQuiz(){
    questionIndex = 0;
    visibleDisplay(startScreen , quizScreen)
    //NOTE: can make this a closure ig. i.e return showQuestion. and then use it above..
    showQuestion();
}

function restartQuiz(){
    score = 0; //was going to add in startQuiz    //man should I just make them separate classes no issue of array
    scoreGained.forEach(result => {
        result.textContent = score;
    });
    progressDone.style.width = `0%`;
    visibleDisplay(resultScreen , startScreen);
}