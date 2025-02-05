const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");

// Quiz state variables
const QUIZ_TIME_LIMIT = 20;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let currentQuestion = null;
let numberOfQuestions = 5;
let quizCategory = "programming";
const questionIndexHistory = [];
let correctAnswerCount = 0;

// Display the quiz result and hide the quiz container
const showQuizResult = () =>{
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";


const resultText = `You answered <b>${correctAnswerCount}</b> out of <b>${numberOfQuestions}</b> questions correctly. Great efforts!`;
document.querySelector(".result-message").innerHTML = resultText;
}
  

// Clear and reset timer
const resetTimer = () =>{
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timerDisplay.textContent = `${currentTime}s`;
}

// Initialize start and the timerfor the current questions
const startTimer = () =>{
  timer = setInterval(() =>{
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`;

    if(currentTime <= 0){
      clearInterval(timer);
      highlightCorrectnswer();
      nextQuestionBtn.style.visibility = "visible";
      quizContainer.querySelector(".quiz-timer").style.background = "#c31402";

       // Disabled all answer option after one option is selected
  answerOptions.querySelectorAll(".answer-option").forEach((option) => (option.style.pointerEvents = "none"));
    }
  } , 1000)
}

// Fetch a random question based  on the selected questions
const getRandomQuestion = () => {
  const categoryQuestions =
    questions.find(
      (cat) => cat.category.toLowerCase() === quizCategory.toLowerCase()
    ).questions || [];


// Show the result of all question have been used

    if(questionIndexHistory.length >= Math.min(categoryQuestions.length, numberOfQuestions)){
return showQuizResult();
    }
// Filter out already asked questions and choose a random one
    const availabelQuestion = categoryQuestions.filter(
      (_, index) => !questionIndexHistory.includes(index)
    );
  const randomQuestion =
    availabelQuestion[Math.floor(Math.random() * availabelQuestion.length)];
  questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
  return randomQuestion;
};

// Highlight the correct answer option and icon
const highlightCorrectnswer = () => {
  const correctOptions =
    answerOptions.querySelectorAll(".answer-option")[
      currentQuestion.correctAnswer
    ];
  correctOptions.classList.add("correct");
  const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;
  correctOptions.insertAdjacentHTML("beforeend", iconHTML);
};

// Handle the user's option selections
const handleAnswer = (options, answerIdx) => {
  clearInterval(timer);

  const isCorrect = currentQuestion.correctAnswer === answerIdx;
  options.classList.add(isCorrect ? "correct" : "incorrect");
  !isCorrect ? highlightCorrectnswer() : correctAnswerCount++;

  // Insert icon based on correctness
  const iconHTML = `<span class="material-symbols-rounded">${
    isCorrect ? "check_circle" : "cancel"
  }</span>`;
  options.insertAdjacentHTML("beforeend", iconHTML);

  // Disabled all answer option after one option is selected
  answerOptions.querySelectorAll(".answer-option").forEach((option) => (option.style.pointerEvents = "none"));
  nextQuestionBtn.style.visibility = "visible";
};

// Render the Current questions and its options in the quiz
const renderQuestion = () => {
  currentQuestion = getRandomQuestion();
  if (!currentQuestion) return;
resetTimer();
  startTimer();

  // Update UI
  answerOptions.innerHTML = "";
  document.querySelector(".question-text").textContent =currentQuestion.question;
  quizContainer.querySelector(".quiz-timer").style.background = "#32313c";
  nextQuestionBtn.style.visibility = "hidden";
  questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;
  // Create a option </li>  elements, append them, and click add Event Listner
  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerOptions.appendChild(li);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
};




// Start the quiz and render the random questions
const startQuiz = () =>{
  configContainer.style.display = "none";
  quizContainer.style.display = "block";

// Update the quiz Category and no of questions
   quizCategory = configContainer.querySelector(".category-option.active").textContent;
   numberOfQuestions = parseInt(configContainer.querySelector(".question-option.active").textContent);


  renderQuestion();  

}
// Highlight the selected options on click- category or no. of questions
document.querySelectorAll(".category-option, .question-option").forEach(option => {
  option.addEventListener("click", () =>{
option.parentNode.querySelector(".active").classList.remove("active");
option.classList.add("active");
  });
});

// Reset the quiz and return to the configuration container
const resultQuiz = () =>{
  resetTimer();
  correctAnswerCount = 0;
  questionIndexHistory.lenght = 0;
  configContainer.style.display = "block";
  resultContainer.style.display = "none";
}


nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click", resultQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);
