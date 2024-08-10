const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submit');
const newQuizButton = document.getElementById('new-quiz');
const resultContainer = document.getElementById('result');
const preloader = document.getElementById('preloader');
const apiUrl = 'https://opentdb.com/api.php?amount=10&category=18&type=multiple'; // Programming category

let questions = [];

async function fetchQuestions() {
     try {
          preloader.classList.remove('hidden'); // Show preloader
          const response = await fetch(apiUrl);
          const data = await response.json();
          return data.results.map((question, index) => ({
               question: question.question,
               options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
               answer: question.correct_answer,
               serial: index + 1
          }));
     } catch (error) {
          console.error('Error fetching questions:', error);
          return [];
     } finally {
          preloader.classList.add('hidden'); // Hide preloader
     }
}

function buildQuiz() {
     const output = [];

     questions.forEach((question, questionIndex) => {
          const options = [];
          for (let option of question.options) {
               options.push(
                    `<label>
                    <input type="radio" name="question${questionIndex}" value="${option}">
                    ${option}
               </label>`
               );
          }

          output.push(
               `<div class="question">${question.serial}. ${question.question}</div>
          <div class="options">${options.join('')}</div>`
          );
     });

     quizContainer.innerHTML = output.join('');
     quizContainer.classList.remove('hidden');
     submitButton.classList.remove('hidden');
     newQuizButton.classList.remove('hidden');
}

function showResults() {
     const answerContainers = quizContainer.querySelectorAll('.options');
     let score = 0;
     let resultsHtml = '';

     questions.forEach((question, questionIndex) => {
          const answerContainer = answerContainers[questionIndex];
          const selector = `input[name=question${questionIndex}]:checked`;
          const userAnswer = (answerContainer.querySelector(selector) || {}).value;

          if (userAnswer === question.answer) {
               score++;
          } else {
               resultsHtml += `<div class="question">${question.serial}. ${question.question}</div>
                         <div class="options">
                              <div class="incorrect-answer">Your answer: ${userAnswer || 'None'}</div>
                              <div class="correct-answer">Correct answer: ${question.answer}</div>
                         </div>`;
          }
     });

     resultContainer.innerHTML = `You scored ${score} out of ${questions.length}.<br>${resultsHtml}`;
}

async function startQuiz() {
     questions = await fetchQuestions();
     if (questions.length > 0) {
          buildQuiz();
          resultContainer.innerHTML = '';
     } else {
          resultContainer.innerHTML = 'Failed to load quiz questions.';
     }
}

submitButton.addEventListener('click', showResults);
newQuizButton.addEventListener('click', startQuiz);

// Start the quiz on page load
startQuiz();
