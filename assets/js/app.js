'use strict';

const startGame = document.querySelector('.start-game');
const restartGame = document.querySelector('.restart-game');
const numberOfHits = document.querySelector('.hits-number p');
const timer = document.querySelector('.timer p');
const randomWords = document.querySelector('.random-words h2');
const alert = document.querySelector('.press');
const typedWord = document.querySelector('.user-input');
const bgMusic = new Audio('./assets/media/background.wav');
bgMusic.type = 'audio/wav';
bgMusic.loop = true;
const gameOverSound = new Audio('./assets/media/game over.mp3');
gameOverSound.type = 'audio/mp3';
const correct = new Audio('./assets/media/correct.mp3');
correct.type = 'audio/mp3';
const words = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'weather',
    'bottle', 'history', 'dream', 'character', 'money', 'absolute', 'machine',
    'accurate', 'rainbow', 'bicycle', 'eclipse', 'trouble', 'developer',
    'database', 'periodic', 'fortune', 'phone', 'future', 'pasta', 'microwave',
    'jungle', 'wallet', 'canada', 'velvet', 'potion', 'treasure', 'beacon',
    'whisper', 'breeze', 'coffee', 'beauty', 'agency', 'chocolate', 'eleven',
    'alphabet', 'magician', 'triangle', 'baseball', 'beyond', 'banana', 'perfume',
    'computer', 'butterfly', 'music', 'eagle', 'crown', 'chess', 'laptop',
    'bedroom', 'enemy', 'button', 'door', 'bird', 'superman', 'library',
    'bookstore', 'language', 'homework', 'beach', 'economy', 'awesome',
    'science', 'mystery', 'famous', 'league', 'memory', 'leather', 'planet',
    'software', 'update', 'yellow', 'keyboard', 'window', 'beans', 'truck',
    'sheep', 'blossom', 'secret', 'wonder', 'destiny', 'quest', 'download',
    'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'audio', 'school',
    'detective', 'hero', 'progress', 'winter', 'passion', 'rebel', 'amber',
    'jacket', 'article', 'paradox', 'social', 'resort', 'mask', 'escape',
    'promise', 'band', 'level', 'hope', 'moonlight', 'media', 'orchestra',
    'volcano', 'guitar', 'raindrop', 'diamond', 'illusion', 'firefly', 'ocean',
    'cascade', 'journey', 'laughter', 'horizon', 'marvel', 'compiler', 'twilight',
    'harmony', 'symphony', 'solitude', 'essence', 'forest', 'melody',
    'vision', 'silence', 'eternity', 'embrace', 'poet', 'ricochet', 'mountain',
    'dance', 'sunrise', 'dragon', 'adventure', 'galaxy', 'echo', 'fantasy',
    'radiant', 'mermaid', 'legend', 'monitor', 'plastic', 'pressure', 'bread',
    'cake', 'caramel', 'juice', 'mouse', 'charger', 'pillow', 'candle', 'sunset',
    'farmer', 'garden', 'whistle', 'blanket', 'picnic', 'sweater', 'lantern',
    'theater', 'traffic', 'website', 'courage', 'shelter', 'painter', 'twinkle',
    'squeeze', 'forever', 'stadium', 'gourmet', 'flower', 'bravery', 'playful',
    'captain', 'vibrant', 'damage', 'outlet', 'general', 'batman', 'enigma',
    'storm', 'universe', 'engine', 'mistake', 'hurricane'
]   

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

function clearInput() {
    typedWord.value = '';
}

typedWord.addEventListener('input', () => {
    validateHits();
});

class Score {
    #date;
    #hits;
    #percentage;

    constructor (hits, percentage) {
        this.#date = Date.now();
        this.#hits = hits;
        this.#percentage = percentage; 
    }

    get date() {
        const options = {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }
    
        return new Date(this.#date).toLocaleDateString('en-ca', options);
    }

    get hits() {
        return this.#hits;
    }

    get percentage() {
        return this.#percentage;
    }
}

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

