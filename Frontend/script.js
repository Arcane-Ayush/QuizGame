fetch('quizzes.json')
.then((res) => {
    return res.json()
})
.then((data)=>{
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

const quizQuestions = data; 
quizQuestions.forEach((quizSelect , index) => {
    console.log(selectQuiz);
    const selectQuizOption = document.createElement('option');
    selectQuizOption.value = quizSelect.quizID;
    selectQuizOption.textContent = quizSelect.title;
    selectQuizOption.className = 'quiz-select'
    selectQuizOption.dataset.value = index;
    selectQuiz.appendChild(selectQuizOption);
    if ( index === quizQuestions.length - 1) {
        //was going to run a loop here and then assign value or attach the index value to each option somehow...
        //NOTE: got it how- lol declaring a class then operating on it outside 
        console.log('scrapped');
    }
    console.log(selectQuizOption);
})

//QUIZ VAR
let quizIndex = -1;
selectQuiz.addEventListener('change' , (e) => {
    const selectedIndex = e.target.selectedIndex;
    quizIndex = selectedIndex - 1;
    console.log(quizIndex);
})

//QUIZ VAR
let questionIndex = 0;
let score = 0;

//otherwise negative index
if(quizIndex >= 0){
    totalQuestions.forEach(totalNo => {
        totalNo.textContent = quizQuestions[quizIndex].questions.length
        console.log(totalNo.textContent);
    })
}

//Functions

function visibleDisplay(prevScreen , toBeScreen){
    prevScreen.style.display = 'none'; // first add a CSS property or remove
    toBeScreen.style.display = 'block';
}

function congratulatoryMessage(){
    let fractionCorrect = score/quizQuestions[quizIndex].questions.length;
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
    currentQuestion.textContent = quizQuestions[quizIndex].questions[questionIndex].Question; //showing the question
    currentQuestionNo.textContent = questionIndex + 1;
    //setting options
    quizQuestions[quizIndex].questions[questionIndex].answers.forEach((option , index) => {
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

function removeAnswerButton(){
    answerBtn.forEach(btn => {
        btn.classList.remove("disabled" , "correct" , "incorrect");
        btn.style.pointerEvents = 'auto';
    })
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
    const quizDone = (questionIndex/quizQuestions[quizIndex].questions.length)*100;
    progressDone.style.width = `${quizDone}%`;

    setTimeout(()=>{
        if(questionIndex < quizQuestions[quizIndex].questions.length){
            removeAnswerButton();
            showQuestion();
        }
        else {
            visibleDisplay(quizScreen , resultScreen);
            // score = 0;
            removeAnswerButton();
            congratulatoryMessage();
        }
    } , 500);
}

function startQuiz(){
    if(quizIndex < 0 ) {
        alert("please choose a Quiz");
        return;
    }

    totalQuestions.forEach(totalNo => {
        totalNo.textContent = quizQuestions[quizIndex].questions.length
        console.log(totalNo.textContent);
    })

    questionIndex = 0;
    visibleDisplay(startScreen , quizScreen)
    //NOTE: can make this a closure ig. i.e return showQuestion. and then use it above..
    showQuestion();
}

function restartQuiz(){
    score = 0; //was going to add in startQuiz    //man should I just make them separate classes no issue of array
    quizIndex = -1;
    scoreGained.forEach(result => {
        result.textContent = score;
    });
    progressDone.style.width = `0%`;
    selectQuiz.selectedIndex = 0;
    visibleDisplay(resultScreen , startScreen);
}
})
