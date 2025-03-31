'use strict';

import * as utils from './utils.js';
import wordList from './words.js';
import {Score} from './Score.js';

const startGame = select('.start-game');
const restartGame = utils.select('.restart-game');
const numberOfHits = select('.hits-number p');
const timer = select('.timer p');
const randomWords = select('.random-words h2');
const alert = select('.press');
const typedWord = select('.user-input');
const bgMusic = new Audio('./assets/media/background.wav');
bgMusic.type = 'audio/wav';
bgMusic.loop = true;
const gameOverSound = new Audio('./assets/media/game over.mp3');
gameOverSound.type = 'audio/mp3';
const correct = new Audio('./assets/media/correct.mp3');
correct.type = 'audio/mp3';
const testScore = new Score();

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

const newScore = {Score}

function clearInput() {
    typedWord.value = '';
}

typedWord.addEventListener('input', () => {
    validateHits();
});


const text = "Typeformers";
const typingElement = document.querySelector('.typing-text');

let index = 0;
function typeText() {
    if (index < text.length) {
        typingElement.textContent += text.charAt(index);
        index++;
        setTimeout(typeText, 150); 
    }
}

window.onload = typeText();

startGame.addEventListener('click', () => {
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

restartGame.addEventListener('click',() => {
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

