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

  if (document.getElementById("hiragana").checked && document.getElementById("katakana").checked) {
    if (RNG(3)) {
      document.getElementById("word").innerHTML = randomWord.katakana;
    }
    else {
      document.getElementById("word").innerHTML = randomWord.hiragana;
    }
  }
  else if (document.getElementById("hiragana").checked) {
    document.getElementById("word").innerHTML = randomWord.hiragana;
  }
  else if (document.getElementById("katakana").checked) {
    document.getElementById("word").innerHTML = randomWord.katakana;
  }

  
  document.getElementById("definition").innerHTML = "Type the reading!";

  const definition = document.querySelector("#definition");
  adjustFontSize(definition);

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
        document.getElementById("definition").innerHTML = truncateText(randomWord.eng, maxLength);

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

  document.getElementById("word").innerHTML = randomWord.kanji;
  document.getElementById("definition").innerHTML = "Type the reading!";

  const definition = document.querySelector("#definition");
  adjustFontSize(definition);

  if (randomWord.kana.includes(",")) {
    answer = splitAnswers(kataToHira(randomWord.kana));
  }
  else {
    answer = kataToHira(randomWord.kana);
  }
  function answerCheck(event) { //defines function
    if (event.key === 'Enter') { //checks if right key was pressed
      let userInputValue = textbox.value; 
      if (userInputValue == answer || (Array.isArray(answer) && answer.includes(userInputValue))) { //correct answer
        textbox.value = "";
        textbox.disabled = true;
        answerBox.style.display = '';
        bottom.style.display = '';
        document.getElementById("definition").innerHTML = truncateText(randomWord.eng, maxLength);

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
        document.getElementById("definition").innerHTML = truncateText(randomWord.eng, maxLength);

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
  fullWordPool = fullWordPool.filter((item) => !doneWords.includes(item));

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

const DEFAULT_FONT_SIZE = '25px';
function adjustFontSize(element) {
  const maxLines = 3;

  let lineHeight = window.getComputedStyle(element).lineHeight;

  // If line-height is "normal", use a default based on current font size.
  if (lineHeight === "normal") {
    lineHeight = 1.2 * parseInt(DEFAULT_FONT_SIZE);
  } else {
    lineHeight = parseInt(lineHeight);
  }

  const maxHeight = lineHeight * maxLines;

  // If text is too long
  if (element.offsetHeight > maxHeight) {
    while (element.offsetHeight > maxHeight && parseInt(window.getComputedStyle(element).fontSize) > 10) { // added a minimum size of 10px for safety
      const currentSize = parseInt(window.getComputedStyle(element).fontSize);
      element.style.fontSize = (currentSize - 1) + "px";
    }
  }
  // If text is short, revert back to the default font size
  else if (element.style.fontSize !== DEFAULT_FONT_SIZE) {
    element.style.fontSize = DEFAULT_FONT_SIZE;

    // Check again in case the default size is too big now
    if (element.offsetHeight > maxHeight) {
      adjustFontSize(element);
    }
  }
}

function splitAnswers(str) {
  return str.split(', ').map(item => item.trim());
}

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
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
document.getElementById("dakuten").checked = true;
document.getElementById("handakuten").checked = true;
document.getElementById("hiragana").checked = true;
document.getElementById("katakana").checked = true;

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
      if (event.target.checked) {
          wordPool.push(variableValue);
      } else {
          const index = wordPool.indexOf(variableValue);
          wordPool.splice(index, 1);
      }
      checkboxCheck();
  });
});

function checkboxCheck() {
  if (wordPool.length == 0) {
    document.getElementById("optionsButton").disabled = true;
  }
  else {
    document.getElementById("optionsButton").disabled = false;
  }
}