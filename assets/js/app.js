'use strict';

import * as utils from './utils.js';
import words from './words.js';
import Score from './Score.js';

const startGame = utils.select('.start-game');
const restartGame = utils.select('.restart-game');
const numberOfHits = utils.select('.hits-number p');
const timer = utils.select('.timer p');
const randomWords = utils.select('.random-words h2');
const alert = utils.select('.press');
const typedWord = utils.select('.user-input');
const bgMusic = new Audio('./assets/media/background.wav');
bgMusic.type = 'audio/wav';
bgMusic.loop = true;
const gameOverSound = new Audio('./assets/media/game over.mp3');
gameOverSound.type = 'audio/mp3';
const correct = new Audio('./assets/media/correct.mp3');
correct.type = 'audio/mp3';
// const testScore = new Score();

let timeCount = 99;
let count = 0;
let gameStarted = false;
let timeInterval;
let wordList = [...words.sort(() => Math.random() - 0.5)];

typedWord.disabled = true;
typedWord.style.cursor = 'not-allowed';

function setTime() {
    clearInterval(timeInterval);
    timeInterval = setInterval (() => {
        let secondsTimer = timeCount.toString().padStart(2, '0');
        timer.textContent = `${secondsTimer}`;
        timeCount--;

        if (timeCount === 5) {
            let blinkCount = 0;
            let blinkInterval = setInterval(() => {
                timer.style.visibility = timer.style.visibility === 'hidden' ? 'visible' : 'hidden';
                blinkCount++;
                if (blinkCount >= 10) {
                    clearInterval(blinkInterval);
                    timer.style.visibility = 'visible';
                }
            }, 500);
        }

        if(timeCount < 0) {
            clearInterval(timeInterval);
            bgMusic.pause();
            gameOver();
        }
    }, 1000);
}

function gameOver() {
    typedWord.disabled = true;
    typedWord.style.cursor = 'not-allowed';
    typedWord.value = '';
    randomWords.textContent = "Game Over!";
    randomWords.style.color = '#8D0E3D';
    gameOverSound.play();
    const accuracyPercentage = (count / wordList.length) * 100;
    const score = new Score(count, accuracyPercentage, new Date().toLocaleString());
    saveScore(score);
    updateScoreboardDisplay();
}

function getNextWord() {
    const newWord = wordList.pop();
    return `${newWord}`
}

function validateHits() {
    let displayedWord = randomWords.textContent.trim();
    let userInput = typedWord.value.trim();

    if ((displayedWord.length === userInput.length) && (displayedWord === userInput)) {
        correct.currentTime = 0;
        correct.play();
        randomWords.textContent = getNextWord();
        clearInput();
        count++;
        numberOfHits.textContent = `Hits: ${count}`;
    }
}

function clearInput() {
    typedWord.value = '';
}

const rawScores = JSON.parse(localStorage.getItem('scoreHistory')) || [];
const validScores = rawScores.filter(score => score && score.hits !== undefined && score.percentage !== undefined);
localStorage.setItem('scoreHistory', JSON.stringify(validScores));

function saveScore(score) {
    let scores = JSON.parse(localStorage.getItem('scoreHistory')) || [];

    // I converted the Score object to a plain object (as localStorage cannot store class instances directly)
    const plainScore = {
        hits: score.hits,
        percentage: score.percentage,
        date: score.date
    };

    scores.push(plainScore);
    scores.sort((a, b) => b.hits - a.hits);
    scores = scores.slice(0, 9);
    // I stringified the scores array and stored it in localStorage (localStorage only accepts string values).
    localStorage.setItem('scoreHistory', JSON.stringify(scores));
}

function updateScoreboardDisplay() {
    const scoreboardBody = utils.select('.scoreboard-body');
    const scoreHistory = JSON.parse(localStorage.getItem('scoreHistory')) || [];
    scoreboardBody.innerHTML = '';

    scoreHistory.forEach((score, index) => {
        const row = utils.create('tr');

        const rankCell = utils.create('td');
        rankCell.textContent = index + 1;

        const hitsCell = utils.create('td');
        hitsCell.textContent = score.hits ?? '0';

        const percentageCell = utils.create('td');
        const safePercentage = typeof score.percentage === 'number' ? score.percentage.toFixed(0) : '0.00';
        percentageCell.textContent = `${safePercentage}%`;

        const dateCell = utils.create('td');
        dateCell.textContent = score.date ?? 'N/A';

        row.append(rankCell);
        row.append(hitsCell);
        row.append(percentageCell);
        row.append(dateCell);

        scoreboardBody.append(row);
    });
}

utils.listen('input', typedWord, () => {
    validateHits();
});

const text = "Typeformers";
const typingElement = utils.select('.typing-text');

let index = 0;
function typeText() {
    if (index < text.length) {
        typingElement.textContent += text.charAt(index);
        index++;
        setTimeout(typeText, 150); 
    }
}

window.onload = () => {
    typeText();
    updateScoreboardDisplay();
}

utils.listen('click', startGame, () => {
    typedWord.disabled = false;
    typedWord.style.cursor = 'text';
    typedWord.focus();
    randomWords.textContent = "Loading...";
    validateHits();
    startGame.style.display = 'none';
    restartGame.style.visibility = 'visible';
    alert.textContent = 'Press restart to start again';
    setTimeout(() => {
        randomWords.textContent = getNextWord();
        validateHits();
    }, 1000); 
    setTime();
    bgMusic.play();
});

utils.listen('click',restartGame, () => {
    timeCount = 99;
    count = 0;
    bgMusic.currentTime = 0;
    bgMusic.play();
    timer.textContent = '...';
    numberOfHits.textContent = `Hits: ${count}`;
    randomWords.style.color = '#000';
    randomWords.textContent = "Loading...";
    typedWord.disabled = false;
    typedWord.style.cursor = 'text';
    typedWord.focus();
    typedWord.value ='';
    startGame.style.display = 'none';
    restartGame.style.visibility = 'visible';
    alert.textContent = 'Press restart to start again';
    setTimeout(() => {
        randomWords.textContent = getNextWord();
        validateHits();
    }, 1000); 
    setTime();
});