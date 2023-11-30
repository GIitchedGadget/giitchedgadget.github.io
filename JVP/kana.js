import {あ} from "./Kana/kanaList.js";
import {か} from "./Kana/kanaList.js";
import {さ} from "./Kana/kanaList.js";
import {た} from "./Kana/kanaList.js";
import {な} from "./Kana/kanaList.js";
import {は} from "./Kana/kanaList.js";
import {ま} from "./Kana/kanaList.js";
import {ら} from "./Kana/kanaList.js";
import {や} from "./Kana/kanaList.js";
import {ん} from "./Kana/kanaList.js";
import {ゐ} from "./Kana/kanaList.js";

let wordPool = [あ, か, さ, た, な, は, ま, ら, や, ん, ゐ];
let wrongWords = [];
let doneWords = [];
let maxLength;

const hiraCheck = document.getElementById("hiragana");
const kataCheck = document.getElementById("katakana");
const dakuCheck = document.getElementById("dakuten");
const handakuCheck = document.getElementById("handakuten");

if (window.screen.width >= 2000) {
  maxLength = 200;
}
else if (window.screen.width >= 1000) {
  maxLength = 100;
}
else {
  maxLength = 50;
}

const answerBox = document.getElementById('answerBox');
const bottom = document.getElementById('bottom');
const optionsGUI = document.getElementById('optionsGUI');
const textbox = document.getElementById('textbox');

answerBox.style.display = 'none';
bottom.style.display = 'none';
optionsGUI.style.display = 'none';
document.addEventListener("DOMContentLoaded", () => {
question();
});

function question() {
  textbox.disabled = false;
  textbox.focus();

  let answer;
  
  //pick word
  const randomWord = getRandomWord(wordPool);

  if (hiraCheck.checked && kataCheck.checked) {
    if (RNG(3)) {
      document.getElementById("word").innerHTML = randomWord.katakana;
    }
    else {
      document.getElementById("word").innerHTML = randomWord.hiragana;
    }
  }
  else if (hiraCheck.checked) {
    document.getElementById("word").innerHTML = randomWord.hiragana;
  }
  else if (kataCheck.checked) {
    document.getElementById("word").innerHTML = randomWord.katakana;
  }

  document.getElementById("definition").innerHTML = "Type the reading!";

  if (randomWord.eng.includes(",")) {
    answer = splitAnswers(randomWord.eng);
  }
  else {
    answer = randomWord.eng;
  }
  function answerCheck(event) { //defines function
    if (event.key === 'Enter') { //checks if right key was pressed
      let userInputValue = textbox.value; 
      if (lowerCase(userInputValue) == answer || (Array.isArray(answer) && answer.includes(lowerCase(userInputValue)))) { //correct answer
        textbox.value = "";
        textbox.disabled = true;
        answerBox.style.display = '';
        bottom.style.display = '';
        document.getElementById("definition").innerHTML = "";
        answerBox.style.backgroundColor = '#62e776';
        document.getElementById("result").innerHTML = "Correct";
        document.getElementById("correctAnswer").innerHTML = lowerCase(userInputValue) + " ○";

        if (!(wrongWords.includes(randomWord))) { //add word to list of words that wont come up again
          doneWords.push(randomWord);
          
          let wordCompare = wordPool.flat();
          if (doneWords.length >= wordCompare.length) {
            doneWords.length = 0;
          }
        }
       

        document.addEventListener('keyup', reset);
        userInputValue = null;
      }
      else { //wrong answer
        textbox.value = "";
        textbox.disabled = true;
        answerBox.style.display = '';
        bottom.style.display = '';
        document.getElementById("definition").innerHTML = "";
        answerBox.style.backgroundColor = '#de5842';
        if (userInputValue == "") {
          document.getElementById("result").innerHTML = userInputValue + "No answer ×";
        }
        else {
          document.getElementById("result").innerHTML = lowerCase(userInputValue) + " ×";
        }
        document.getElementById("correctAnswer").innerHTML = answer + " ○";

        wrongWords.push(randomWord); //add word to list of words incorrect
        randomWord["stage"] = "5";

        document.addEventListener('keyup', reset);
        userInputValue = null;
      }
      document.removeEventListener('keyup', answerCheck);
    }
  } 
  document.addEventListener('keyup', answerCheck); //calls function
}

function review() {
  textbox.disabled = false;
  textbox.focus();

  let answer;
  
  //pick word
  const randomWord = getRandomWord2(wrongWords);
  const hiraCheck = document.getElementById("hiragana");
  const kataCheck = document.getElementById("katakana");

  if (hiraCheck.checked && kataCheck.checked) {
    if (RNG(3)) {
      document.getElementById("word").innerHTML = randomWord.katakana;
    }
    else {
      document.getElementById("word").innerHTML = randomWord.hiragana;
    }
  }
  else if (hiraCheck.checked) {
    document.getElementById("word").innerHTML = randomWord.hiragana;
  }
  else if (kataCheck.checked) {
    document.getElementById("word").innerHTML = randomWord.katakana;
  }

  document.getElementById("definition").innerHTML = "Type the reading!";

  if (randomWord.eng.includes(",")) {
    answer = splitAnswers(randomWord.eng);
  }
  else {
    answer = randomWord.eng;
  }
  function answerCheck(event) { //defines function
    if (event.key === 'Enter') { //checks if right key was pressed
      let userInputValue = textbox.value; 
      if (userInputValue == answer || (Array.isArray(answer) && answer.includes(userInputValue))) { //correct answer
        textbox.value = "";
        textbox.disabled = true;
        answerBox.style.display = '';
        bottom.style.display = '';
        document.getElementById("definition").innerHTML = "";

        answerBox.style.backgroundColor = '#62e776';
        document.getElementById("result").innerHTML = "Correct";
        document.getElementById("correctAnswer").innerHTML = userInputValue + " ○";

        if (randomWord.stage == 1) {
          remove(randomWord.kanji, wrongWords);
        }
        else {
          randomWord.stage--;
        }
        
        document.addEventListener('keyup', reset);
        userInputValue = null;
      }
      else { //wrong answer
        textbox.value = "";
        textbox.disabled = true;
        answerBox.style.display = '';
        bottom.style.display = '';
        document.getElementById("definition").innerHTML = "";

        answerBox.style.backgroundColor = '#de5842';
        if (userInputValue == "") {
          document.getElementById("result").innerHTML = userInputValue + "No answer ×";
        }
        else {
          document.getElementById("result").innerHTML = userInputValue + " ×";
        }
        document.getElementById("correctAnswer").innerHTML = answer + " ○";

        wrongWords.push(randomWord); //add word to list of words incorrect
        randomWord["stage"] = "5";

        if (randomWord.stage != 5) {
          randomWord.stage++;
        }

        document.addEventListener('keyup', reset);
        userInputValue = null;
      }
      document.removeEventListener('keyup', answerCheck);
    }
  } 
  document.addEventListener('keyup', answerCheck); //calls function
}

function reset(event) {
  textbox.value = '';
  answerBox.style.display = 'none';
  bottom.style.display = 'none';

  if (wrongWords.length >= 10) {
    if (RNG(3)) {
      review();
    }
    else {
      question();
    }
  }
  else if (wrongWords.length >= 5) {
    if (RNG(4)) {
      review();
    }
    else {
      question();
    }
  }
  else if (wrongWords.length >= 1) {
    if (RNG(5)) {
      review();
    }
    else {
      question();
    }
  }
  else {
    question();
  }

  document.removeEventListener('keyup', reset);
}

function getRandomWord(wordPool) {
  let fullWordPool = wordPool.flat();
  fullWordPool = fullWordPool.filter(item => !doneWords.includes(item));
  if (!dakuCheck.checked) {
    fullWordPool = fullWordPool.filter((item) => !item || !item.handakuten);
  }
  if (!handakuCheck.checked) {
    fullWordPool = fullWordPool.filter((item) => !item || !item.handakuten);
  }

  const randomObject = fullWordPool[Math.floor(Math.random() * fullWordPool.length)];
  
  return randomObject;
}

function getRandomWord2(wrongWords) {
  let highestValue = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < wrongWords.length; i++) {
    if (wrongWords[i].stage > highestValue) { 
      highestValue = wrongWords[i].stage;
    }
  }
  const filtered = wrongWords.filter(item => item.stage === highestValue);

  const randomObject = filtered[Math.floor(Math.random() * filtered.length)];

  return randomObject;
}

function remove(word, array) {
  const index = array.findIndex(obj => obj.kanji === word);
    array.splice(index, 1);
}

function splitAnswers(str) {
  return str.split(',').map(item => item.trim());
}

function lowerCase(string) {
  return string.toLowerCase();
}

function RNG(num) {
  const randomNumber = Math.floor(Math.random() * num) + 1;
  return num == randomNumber;
}

document.getElementById("あ").checked = true;
document.getElementById("か").checked = true;
document.getElementById("さ").checked = true;
document.getElementById("た").checked = true;
document.getElementById("な").checked = true;
document.getElementById("は").checked = true;
document.getElementById("ま").checked = true;
document.getElementById("ら").checked = true;
document.getElementById("や").checked = true;
document.getElementById("ん").checked = true;
document.getElementById("ゐ").checked = true;
hiraCheck.checked = true;
kataCheck.checked = true;

const idToVariableMapping = {
  "あ": あ,
  "か": か,
  "さ": さ,
  "た": た,
  "な": な,
  "は": は,
  "ま": ま,
  "ら": ら,
  "や": や,
  "ん": ん,
  "ゐ": ゐ
};

const checkboxes = document.querySelectorAll('input[type="checkbox"]')
checkboxes.forEach(checkbox => {

  checkbox.addEventListener('change', function(event) {
      const variableValue = idToVariableMapping[event.target.id];
      if (Array.isArray(variableValue)) {
        if (event.target.checked) {
          wordPool.push(variableValue);
        } else {
          const index = wordPool.indexOf(variableValue);
          wordPool.splice(index, 1);
        }
        checkboxCheck();
      }
      else {
        checkboxCheck();
      }
  });
});

function checkboxCheck() {
  const optionsButton = document.getElementById("optionsButton");
  optionsButton.disabled = wordPool.length === 0 || (!kataCheck.checked && !hiraCheck.checked);
}