import {
  state,
  generateQuestions,
  generateCurrentQuestion,
  setCurrentPoint,
  setCurrentQuestionNumber,
  resetGameplayData,
} from "./model.js";

////////////////////////////////////////////////////////////////////////
// HOME SCREEN
////////////////////////////////////////////////////////////////////////

const handlerStartGame = function () {
  const homeBtn = document.querySelector(".btn--home");
  homeBtn.addEventListener("click", function () {
    initGameplay();
  });
};

////////////////////////////////////////////////////////////////////////
// GAMEPLAY SCREEN
////////////////////////////////////////////////////////////////////////

const renderGameplay = function () {
  const homeScreen = document.querySelector(".home");
  homeScreen.classList.add("home--hidden");
  const resultScreen = document.querySelector(".result");
  resultScreen.classList.add("result--hidden");

  const parentElement = document.querySelector(".gameplay");
  if (parentElement.classList.contains("gameplay--hidden"))
    parentElement.classList.remove("gameplay--hidden");
  const markup = `
    <div class="gameplay__container">
      <div class="gameplay__header">
        <div class="gameplay__question-number-container">
          <img
            class="gameplay__question-number-icon"
            src="assets/question.svg"
            alt="Question"
          />
          <p class="gameplay__question-number">${
            state.currentQuestionNumber + 1
          }/10</p>
        </div>
        <div class="gameplay__points-container">
          <img
            class="gameplay__points-icon"
            src="assets/gift.svg"
            alt="Points"
          />
          <p class="gameplay__points">${state.currentPoints}</p>
        </div>
      </div>
      <div class="gameplay__timer-container">
        <div class="gameplay__timer">30</div>
        <svg
          class="gameplay__timer-circle"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 128 128"
        >
          <path
            d="M64,10A54,54,0,1,1,10,64,54.06,54.06,0,0,1,64,10"
            fill="transparent"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="10"
            class="gameplay__timer-path"
          />
        </svg>
      </div>
      <div class="gameplay__question-container">
        <p class="gameplay__question" data-question-number="${
          state.currentQuestionNumber
        }">
          ${state.currentQuestion.question}
        </p>
      </div>
      <div class="gameplay__choices">
      ${state.currentQuestion.choices
        .map((c, i) => {
          return `
          <div data-choice="${i}" class="gameplay__choice">${c}</div>
        `;
        })
        .join("")}
      </div>
    </div>
    <div class="gameplay__container--1"></div>
    <div class="gameplay__container--2"></div>
  `;
  parentElement.innerHTML = "";
  parentElement.insertAdjacentHTML("afterbegin", markup);

  startTimer();
  handlerChooseAnswer();
};

const handlerChooseAnswer = function () {
  const choicesContainer = document.querySelector(".gameplay__choices");
  choicesContainer.addEventListener("click", function (e) {
    const choiceBtn = e.target.closest(".gameplay__choice");
    if (!choiceBtn) return;
    const playerChoice = +choiceBtn.dataset.choice;
    // Correct choice
    if (playerChoice === state.currentQuestion.correctAnswer) {
      setCurrentPoint(150);
      renderResult();
      setCurrentQuestionNumber();
    }
    // Incorrect choice
    else {
      renderResult(false);
    }
  });
};

// RENDER RESULT SCREEN
const renderResult = function (correct = true) {
  const gameplayScreen = document.querySelector(".gameplay");
  gameplayScreen.classList.add("gameplay--hidden");

  const parentElement = document.querySelector(".result");
  if (parentElement.classList.contains("result--hidden"))
    parentElement.classList.remove("result--hidden");
  let markup = "";
  // Final question
  if (state.currentQuestionNumber === state.questions.length - 1) {
    markup = `
      <div class="final-result__container">
        <img class="final-result__icon" src="assets/winner.svg" alt="Winner">
        <p class="final-result__message">Congratulations!</p>
        <h2 class="final-result__points">
          You won <span class="final-result__points--bold">$${state.currentPoints}!!</span> 
        </h2>
      </div>
      <button class="btn btn--result btn--replay">New game</button>
    `;
  } else {
    markup = `
      <div class="result__container">
        <p class="result__message">${
          correct ? "Congratulations!" : "Game over!"
        }</p>
        <h2 class="result__points">
          You won <span class="result__points--bold">$${
            state.currentPoints
          }!!</span> 
        </h2>
        <div class="result__answer">
          <p class="result__question">Question ${
            state.currentQuestionNumber + 1
          }: 
            ${state.currentQuestion.question}
          </p>
          <p class="result__correct">&rarr; 
          ${state.currentQuestion.choices[state.currentQuestion.correctAnswer]}
          </p>
        </div>
      </div>
      <button class="btn btn--result ${
        correct ? "btn--continue" : "btn--replay"
      }">
        ${correct ? "Continue playing" : "Play again"}  
      </button>
    `;
  }
  parentElement.innerHTML = "";
  parentElement.insertAdjacentHTML("afterbegin", markup);

  stopTimer();
  handlerButtons();
};

const handlerButtons = function () {
  const parentElement = document.querySelector(".result");
  parentElement.addEventListener("click", function (e) {
    const btnContinue = e.target.closest(".btn--continue");
    const btnReplay = e.target.closest(".btn--replay");
    if (btnContinue) {
      generateCurrentQuestion();
      renderGameplay();
    } else if (btnReplay) {
      resetGameplay();
    }
  });
};

// RESET GAMEPLAY
const resetGameplay = function () {
  resetGameplayData();
  initGameplay();
};

// INIT GAMEPLAY
const initGameplay = function () {
  generateQuestions();
  generateCurrentQuestion();
  renderGameplay();
};

////////////////////////////////////////////////////////////////////////
// TIMER
////////////////////////////////////////////////////////////////////////

const renderTimer = function (time) {
  const gameplayTimer = document.querySelector(".gameplay__timer");
  gameplayTimer.textContent = time;
};

const setTime = function (second) {
  const tick = function () {
    renderTimer(time);
    if (time === 0) {
      renderResult(false);
      stopTimer();
    } else time--;
  };
  let time = second;
  tick();
  state.timer = setInterval(tick, 1000);
  return state.timer;
};

const startTimer = function () {
  if (state.timer) clearInterval(state.timer);
  state.timer = setTime(30);
};

const stopTimer = function () {
  if (state.timer) clearInterval(state.timer);
};

////////////////////////////////////////////////////////////////////////
// APPLICATION INIT
////////////////////////////////////////////////////////////////////////

const init = function () {
  handlerStartGame();
};

init();
