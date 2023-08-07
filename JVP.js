import {animals} from "./animals.js";
import {common} from "./common.js";
import {countries} from "./countries.js";
import {n1} from "./n1.js";
import {n2} from "./n2.js";
import {n3} from "./n3.js";
import {n4} from "./n4.js";
import {n5} from "./n5.js";
import {plants} from "./plants.js";
import {vegetables} from "./vegetables.js";
import {prefectures} from "./prefectures.js";
import {romajiToHiraganaMap} from "./characterList.js";

//let wordPool = [animals, common, countries, n1, n2, n3, n4, n5, plants, vegetables, prefectures];
let wordPool = [n5];

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
textbox.addEventListener('input', function() {
  const romajiValue = textbox.value;
  const hiraganaValue = convertToHiragana(romajiValue);
  textbox.value = hiraganaValue; // Replace the Romaji with the converted Hiragana
});

function question() {
  textbox.disabled = false;
  textbox.focus();

  let answer;
  
  //pick word
  const randomWord = getRandomWord(wordPool);

  document.getElementById("word").innerHTML = randomWord.kanji;
  document.getElementById("definition").innerHTML = "Type the reading!";

  const definition = document.querySelector("#definition");
  adjustFontSize(definition);

  if (randomWord.kana.includes(",")) {
    answer = splitAnswers(randomWord.kana);
  }
  else {
    answer = randomWord.kana;
  }
  function answerCheck(event) { //defines function
    if (event.key === 'Enter') { //checks if right key was pressed
      let userInputValue = textbox.value; 
      if (userInputValue == answer || (Array.isArray(answer) && answer.includes(userInputValue))) { //correct answer
        textbox.value = "";
        textbox.disabled = true;
        answerBox.style.display = '';
        bottom.style.display = '';
        document.getElementById("definition").innerHTML = randomWord.eng;

        answerBox.style.backgroundColor = '#62e776';
        document.getElementById("result").innerHTML = "Correct";
        document.getElementById("correctAnswer").innerHTML = userInputValue + " ○";

        document.addEventListener('keyup', reset);
        userInputValue = null;
      }
      else { //wrong answer
        textbox.value = "";
        textbox.disabled = true;
        answerBox.style.display = '';
        bottom.style.display = '';
        document.getElementById("definition").innerHTML = randomWord.eng;

        answerBox.style.backgroundColor = '#de5842';
        if (userInputValue == "") {
          document.getElementById("result").innerHTML = userInputValue + "No answer ×";
        }
        else {
          document.getElementById("result").innerHTML = userInputValue + " ×";
        }
        document.getElementById("correctAnswer").innerHTML = answer + " ○";

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
    question();
  document.removeEventListener('keyup', reset);
}

function getRandomWord(wordPool) {
  // Step 1: Randomly select an array from the array of arrays
  const randomArray = wordPool[Math.floor(Math.random() * wordPool.length)];

  // Step 2: Randomly select an object from the chosen array
  const randomObject = randomArray[Math.floor(Math.random() * randomArray.length)];

  return randomObject;
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

// convert romaji to hiragana
function convertToHiragana(romaji) {
  let hiragana = '';
  let i = 0;

  while (i < romaji.length) {
    let nextFourChars = romaji.substr(i, 4);
    let nextThreeChars = romaji.substr(i, 3);
    let nextTwoChars = romaji.substr(i, 2);
    let nextOneChar = romaji.substr(i, 1);

    if (romajiToHiraganaMap[nextFourChars]) {
      hiragana += romajiToHiraganaMap[nextFourChars];
      i += 4;
    } else if (romajiToHiraganaMap[nextThreeChars]) {
      hiragana += romajiToHiraganaMap[nextThreeChars];
      i += 3;
    } else if (romajiToHiraganaMap[nextTwoChars]) {
      hiragana += romajiToHiraganaMap[nextTwoChars];
      i += 2;
    } else if (romajiToHiraganaMap[nextOneChar]) {
      hiragana += romajiToHiraganaMap[nextOneChar];
      i += 1;
    } else {
      // If the current character is not found in the mapping, leave it as is.
      hiragana += romaji[i];
      i += 1;
    }
  }
  return hiragana;
}

document.getElementById("n5").checked = true;

const idToVariableMapping = {
  "common": common,
  "n1": n1,
  "n2": n2,
  "n3": n3,
  "n4": n4,
  "n5": n5,
  "plants": plants,
  "vegetables": vegetables,
  "animals": animals,
  "prefectures": prefectures
};

const checkboxes = document.querySelectorAll('input[type="checkbox"]')
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function(event) {
      const variableValue = idToVariableMapping[event.target.id];
      if (event.target.checked) {
          wordPool.push(variableValue);
      } else {
          const index = wordPool.indexOf(variableValue);
          if (index !== -1) wordPool.splice(index, 1);
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