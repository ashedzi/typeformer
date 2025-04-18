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

    // Create a new Score object
    const score = new Score(count, accuracyPercentage, new Date().toLocaleString());

    // Save the score
    saveScore(score);

    // Update the scoreboard
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

    // Convert the Score object to a plain object (as localStorage cannot store class instances directly)
    const plainScore = {
        hits: score.hits,
        percentage: score.percentage,
        date: score.date
    };

    // Add new score to the list
    scores.push(plainScore);

    // Sort scores by hits (descending)
    scores.sort((a, b) => b.hits - a.hits);

    // Keep only the top 9 scores
    scores = scores.slice(0, 9);

    // Save back to localStorage
    localStorage.setItem('scoreHistory', JSON.stringify(scores));
}

function updateScoreboardDisplay() {
    const scoreboardBody = utils.select('.scoreboard-body');
    const scoreHistory = JSON.parse(localStorage.getItem('scoreHistory')) || [];

    scoreboardBody.innerHTML = '';

    scoreHistory.forEach((score, index) => {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;

        const hitsCell = document.createElement('td');
        hitsCell.textContent = score.hits ?? '0';

        const percentageCell = document.createElement('td');
        // Check if percentage exists and is a number
        const safePercentage = typeof score.percentage === 'number' ? score.percentage.toFixed(2) : '0.00';
        percentageCell.textContent = safePercentage;

        const dateCell = document.createElement('td');
        dateCell.textContent = score.date ?? 'N/A';

        row.appendChild(rankCell);
        row.appendChild(hitsCell);
        row.appendChild(percentageCell);
        row.appendChild(dateCell);

        scoreboardBody.appendChild(row);
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
    // gameStarted = true;
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

// export function create(element) {
//     return document.createElement(element);
// }



// // 1. Load previous scores from localStorage or initialize an empty array
// let scoreHistory = JSON.parse(localStorage.getItem('scoreHistory')) || [];

// // 2. Create a new score object using your Score class
// const finalScore = new Score(hits, accuracyPercentage);

// // 3. Add the new score to the array
// scoreHistory.push(finalScore);

// // 4. Sort the array by hits in descending order
// scoreHistory.sort((a, b) => b.hits - a.hits);

// // 5. Keep only the top 9 scores
// scoreHistory = scoreHistory.slice(0, 9);

// // 6. Save updated scores to localStorage
// localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));

// // 7. Update the scoreboard on screen
// function updateScoreboardDisplay() {
//   const scoreboard = document.querySelector('.scoreboard-body');
//   scoreboard.innerHTML = '';

//   scoreHistory.forEach(score => {
//     const row = document.createElement('tr');
//     row.innerHTML = `
//       <td>${typeof score.date === 'function' ? score.date() : new Date(score.#date).toLocaleDateString('en-ca')}</td>
//       <td>${score.hits}</td>
//       <td>${score.percentage}%</td>
//     `;
//     scoreboard.appendChild(row);
//   });
// }

// updateScoreboardDisplay(); // Call it after setting localStorage



// function createElements(tags, attributes = {}, textContent = '') {
//     const element = utils.create(tags);

//     for (const key in attributes) {
//         if (Array.isArray(attributes[key])) {
//             element.setAttribute(key, attributes[key].join(' '));
//         } else {
//             element.setAttribute(key, attributes[key]);
//         }
//     }

//     if (textContent) element.textContent = textContent;

//     return element;
// }


// const scoreHistory = [];

// const finalScore = new Score(hits, accuracyPercentage);
// scoreHistory.push(finalScore);
// localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));

// function updateScoreboardDisplay() {
//     const scoreboard = document.querySelector('.scoreboard-body');
//     scoreboard.innerHTML = ''; // clear previous content

//     scoreHistory.forEach(score => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${score.date}</td>
//             <td>${score.hits}</td>
//             <td>${score.percentage}%</td>
//         `;
//         scoreboard.appendChild(row);
//     });
// }

// localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));

// // Load
// const storedScores = JSON.parse(localStorage.getItem('scoreHistory')) || [];
// scoreHistory.sort((a, b) => b.hits - a.hits);
// const topScores = scoreHistory.slice(0, 9);
// topScores.forEach(score => {
//   // Display in scoreboard
// });

// scoreHistory.sort((a, b) => b.hits - a.hits);
// const trimmed = scoreHistory.slice(0, 9);
// localStorage.setItem('scoreHistory', JSON.stringify(trimmed));






// const storedScores = JSON.parse(localStorage.getItem('scoreHistory')) || [];
// const scoreHistory = storedScores.map(s => new Score(s.hits, s.percentage));
// updateScoreboardDisplay();

// function createScore() {
//     const scoreBoard = utils.create('section', {class: 'score-board'});
//     const table = utils.create('table', {class: ''});
//     const tableHead = utils.create('thead', {class: ''});
//     const tableRowHead = utils.create('tr', {class: ''});
//     const rank = utils.create('th', {class: ''});
//     const hits = utils.create('th', {class: ''});
//     const percentage = utils.create('th', {class: ''});
//     const date = utils.create('th', {class: ''});
//     const tableBody = utils.create('tbody', {class: ''});
//     const tableRowBody = utils.create('tr', {class: ''});
//     const tdRank = utils.create('td', {class: 'rank'});
//     const tdHits = utils.create('td', {class: 'hits'});
//     const tdPercentage = utils.create('td', {class: 'percentage'});
//     const tdDate = utils.create('td', {class: 'date'});

//     scoreBoard.append(table);
//     table.append(tableHead, tableBody);
//     tableHead.append(tableRowHead);
//     tableRowHead.append(rank, hits, percentage, date);
//     tableBody.append(tableRowBody);
//     tableRowBody.append(tdRank, tdHits, tdPercentage, tdDate);
//     return table;
// }


// function clearPost() {
//     textDraft.value = '';
//     fileInput.value = '';
//     fileName.textContent = '';
// }

// // Local storage 

// // saving/setting values into the localStorage 
// localStorage.setItem('user', 'Ashedzi');
// localStorage.setItem('email', 'solomonashe84@gmail.com');

// // Reading the values from the local storage 
// // localStorage.getItem('user');
// // localStorage.getItem('email');

// console.log(`Username: ${localStorage.getItem('user')}`);
// console.log(`Email: ${localStorage.getItem('email')}`);

// console.log(localStorage);
