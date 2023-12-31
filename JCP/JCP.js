import {words} from "./words.js";
import {ConjForms} from "./words.js";
import {specialConjForms} from "./words.js";
import {adjConjForms} from "./words.js";
import {adjSpConjForms} from "./words.js";
import {wordPool} from "./words.js";
import {verbPool} from "./words.js";
import {adjPool} from "./words.js";
import {adjConjPool} from "./words.js";
import {adjSpConjPool} from "./words.js";
import {spConjPool} from "./words.js";
import {ConjPool} from "./words.js";
import {verbTenses} from "./words.js";
import {adjTenses} from "./words.js";
import {verbAffOrNeg} from "./words.js";
import {adjAffOrNeg} from "./words.js";
import {verbFormality} from "./words.js";
import {adjFormality} from "./words.js";
import {romajiToHiraganaMap} from "../characterList.js";

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
  textbox.value = hiraganaValue; //replace romaji with hiragana
});

function question() {
  textbox.disabled = false;
  textbox.focus();

  let conjugationList;
  let answer;
  
  //pick word
  const randomWord = getRandomWord(words, wordPool);

  //generate conjugations
  if (randomWord.type == "ru" || randomWord.type == "u") {
    const conjugations = generateConjugation(specialConjForms, ConjForms, spConjPool, ConjPool);
    conjugationList = listConjugations(conjugations);
    answer = conjugate(randomWord, conjugations);
  }
  else if (randomWord.type == "i" || randomWord.type == "na") {
    const conjugations = generateAdjConj(adjSpConjForms, adjConjForms, adjSpConjPool, adjConjPool);
    conjugationList = adjListConjugations(conjugations);
    answer = conjugateAdj(randomWord, conjugations);
  }
  else if (randomWord.type == "exv") {
    let conjugations;
    if (randomWord.kana == "ある") {
      conjugations = generateAruConj(specialConjForms, ConjForms, spConjPool, ConjPool);
    }
    else {
      conjugations = generateConjugation(specialConjForms, ConjForms, spConjPool, ConjPool);
    }
    conjugationList = listConjugations(conjugations);
    answer = conjugateExv(randomWord, conjugations);
  }
  else if (randomWord.type == "exa") {
    const conjugations = generateAdjConj(adjSpConjForms, adjConjForms, adjSpConjPool, adjConjPool);
    conjugationList = adjListConjugations(conjugations);
    answer = conjugateExa(randomWord, conjugations);
  }

  
  document.getElementById("word").innerHTML = randomWord.kanji;
  document.getElementById("definition").innerHTML = randomWord.eng;
  document.getElementById("targetInflections").innerHTML = conjugationList;
  document.getElementById("type").innerHTML = "";
  manageFurigana(document.getElementById("furigana"));

  function answerCheck(event) { //defines function
    if (event.key === 'Enter') { //checks if right key was pressed
      let userInputValue = textbox.value;
      if (userInputValue == answer) { //correct answer
        textbox.value = "";
        textbox.disabled = true;
        answerBox.style.display = '';
        bottom.style.display = '';
        document.getElementById("type").innerHTML = getType(randomWord);
        answerBox.style.backgroundColor = '#008000';
        document.getElementById("result").innerHTML = "Correct";
        document.getElementById("correctAnswer").innerHTML = answer + " ○";
        document.addEventListener('keyup', reset);
        document.addEventListener('mouseup', reset);
        userInputValue = null;
      }
      else { //wrong answer
        textbox.value = "";
        textbox.disabled = true;
        answerBox.style.display = '';
        bottom.style.display = '';
        document.getElementById("type").innerHTML = getType(randomWord);
        answerBox.style.backgroundColor = '#c92424';
        if (userInputValue == "") {
          document.getElementById("result").innerHTML = userInputValue + "No answer ×";
        }
        else {
          document.getElementById("result").innerHTML = userInputValue + " ×";
        }
        document.getElementById("correctAnswer").innerHTML = answer + " ○";
        document.addEventListener('keyup', reset);
        document.addEventListener('mouseup', reset);
        userInputValue = null;
      }
      document.removeEventListener('keyup', answerCheck);
    }
  } 
  document.addEventListener('keyup', answerCheck); //calls function
}

function reset(event) {
  textbox.value = '';
  ConjForms.verbFormal = null;
  ConjForms.verbPresent = null;
  ConjForms.verbAffirmative = null;
  specialConjForms.verbて = null;
  specialConjForms.verbPotential = null;
  specialConjForms.verbPassive = null;
  specialConjForms.verbCausative = null;
  specialConjForms.verbCausativePassive = null;
  specialConjForms.verbImperative = null;
  specialConjForms.verbVolitional = null;
  adjConjForms.adjFormal = null;
  adjConjForms.adjCasual = null;
  adjConjForms.adjPresent = null;
  adjConjForms.adjPast = null;
  adjConjForms.adjAffirmative = null;
  adjConjForms.adjNegative = null;
  adjSpConjForms.adjて = null;
  adjSpConjForms.adverb = null;
  adjSpConjForms.nominalized = null;
  answerBox.style.display = 'none';
  bottom.style.display = 'none';
  question();
  document.removeEventListener('keyup', reset);
  document.removeEventListener('mouseup', reset);
}

function generateConjugation(specialConjForms, ConjForms, spConjPool, ConjPool) {
  const validConjugations = Object.keys(ConjForms).filter(conj => ConjPool.includes(conj));
  const validSpecialConjugations = Object.keys(specialConjForms).filter(conj => spConjPool.includes(conj));

  if (validSpecialConjugations.includes("verbて") && RNG(5)) {
      specialConjForms.verbて = true;
  }

  // Handle tense (present or past)
  if (validConjugations.includes("verbPresent") && validConjugations.includes("verbPast")) {
      ConjForms.verbPresent = RNG(2);
  } else if (validConjugations.includes("verbPresent")) {
      ConjForms.verbPresent = true;
  } else if (validConjugations.includes("verbPast")) {
      ConjForms.verbPresent = false;
  }

  // Handle affirmation (affirmative or negative)
  if (validConjugations.includes("verbAffirmative") && validConjugations.includes("verbNegative")) {
      ConjForms.verbAffirmative = RNG(2);
  } else if (validConjugations.includes("verbAffirmative")) {
      ConjForms.verbAffirmative = true;
  } else if (validConjugations.includes("verbNegative")) {
      ConjForms.verbAffirmative = false;
  }

  // Handle formality (formal or casual)
  if (validConjugations.includes("verbFormal") && validConjugations.includes("verbCasual")) {
      ConjForms.verbFormal = RNG(2);
  } else if (validConjugations.includes("verbFormal")) {
      ConjForms.verbFormal = true;
  } else if (validConjugations.includes("verbCasual")) {
      ConjForms.verbFormal = false;
  }

  // Handle other special conjugations, if て-form wasn't chosen
  if (!specialConjForms.verbて) {
      const randomIndex = Math.floor(Math.random() * validSpecialConjugations.length);
      const selectedConjugation = validSpecialConjugations[randomIndex];
      specialConjForms[selectedConjugation] = true;

      // Reset certain forms if specific special conjugation is chosen
      if (selectedConjugation === "verbImperative" || selectedConjugation === "verbVolitional") {
          ConjForms.verbPresent = null;
          ConjForms.verbFormal = null;
          if (selectedConjugation === "verbVolitional") {
              ConjForms.verbAffirmative = null;
              ConjForms.verbNegative = null;
          }
      }
  }

  // Reset some forms if て-form was chosen
  if (specialConjForms.verbて) {
    if (ConjForms.verbAffirmative == true) {
      ConjForms.verbAffirmative = null;
    }
    ConjForms.verbFormal = null;
    ConjForms.verbPresent = null;
    specialConjForms.verbPotential = null;
    specialConjForms.verbPassive = null;
    specialConjForms.verbCausative = null;
    specialConjForms.verbCausativePassive = null;
    specialConjForms.verbImperative = null;
    specialConjForms.verbVolitional = null;
  }
  //console.log(ConjForms)
  //console.log(specialConjForms)
  return { ...ConjForms, ...specialConjForms };
}

function generateAdjConj(adjSpConjForms, adjConjForms, adjSpConjPool, adjConjPool) {
  const validConjugations = Object.keys(adjConjForms).filter(conj => adjConjPool.includes(conj));
  let validSpecialConjugations = Object.keys(adjSpConjForms).filter(conj => adjSpConjPool.includes(conj));

  if (validSpecialConjugations.includes("adjて") && RNG(5)) {
      adjSpConjForms.adjて = true;
      validSpecialConjugations = validSpecialConjugations.filter(validSpecialConjugations => validSpecialConjugations !== "adjて");
  }

  // tense
  if (validConjugations.includes("adjPresent") && validConjugations.includes("adjPast")) {
      adjConjForms.adjPresent = RNG(2);
  } else if (validConjugations.includes("adjPresent")) {
      adjConjForms.adjPresent = true;
  } else if (validConjugations.includes("adjPast")) {
      adjConjForms.adjPresent = false;
  }

  // aff or neg
  if (validConjugations.includes("adjAffirmative") && validConjugations.includes("adjNegative")) {
      adjConjForms.adjAffirmative = RNG(2);
  } else if (validConjugations.includes("adjAffirmative")) {
      adjConjForms.adjAffirmative = true;
  } else if (validConjugations.includes("adjNegative")) {
      adjConjForms.adjAffirmative = false;
  }

  // formality
  if (validConjugations.includes("adjFormal") && validConjugations.includes("adjCasual")) {
      adjConjForms.adjFormal = RNG(2);
  } else if (validConjugations.includes("adjFormal")) {
      adjConjForms.adjFormal = true;
  } else if (validConjugations.includes("adjCasual")) {
      adjConjForms.adjFormal = false;
  }

  // special if no te
  if (!adjSpConjForms.adjて && RNG(5)) {
      const randomIndex = Math.floor(Math.random() * validSpecialConjugations.length);
      const selectedConjugation = validSpecialConjugations[randomIndex];
      adjSpConjForms[selectedConjugation] = true;

      // reset forms
      if (selectedConjugation === "adverb" || selectedConjugation === "nominalized") {
          adjConjForms.adjPresent = null;
          adjConjForms.adjFormal = null;
          adjConjForms.adjAffirmative = null;
      }
  }

  // reset forms
  if (adjSpConjForms.adjて) {
    if (adjConjForms.adjAffirmative == true) {
      adjConjForms.adjAffirmative = null;
    }
    adjConjForms.adjFormal = null;
    adjConjForms.adjPresent = null;
    adjSpConjForms.adverb = null;
    adjSpConjForms.nominalized = null;
  }
  //console.log(ConjForms)
  //console.log(specialConjForms)
  return { ...adjConjForms, ...adjSpConjForms };
}

function generateAruConj() {
  const validConjugations = Object.keys(ConjForms).filter(conj => ConjPool.includes(conj));
  const validSpecialConjugations = Object.keys(specialConjForms).filter(conj => spConjPool.includes(conj));
  let aff = null;
  if (verbTenses.length == 1 && verbTenses.includes("verbて") && validSpecialConjugations.includes("verbて")) {
    if (validConjugations.includes("verbAffirmative") && validConjugations.includes("verbNegative")) {
      if (RNG(2)) {
        ConjForms.verbAffirmative = false;
      }
    }
    else if (validConjugations.includes("verbAffirmative")) {
      ConjForms.verbAffirmative = null;
    }
    else if (validConjugations.includes("verbNegative")) {
      ConjForms.verbAffirmative = false;
    }
    return { ...ConjForms, ...specialConjForms };
  }
  if (validConjugations.includes("verbPresent") && validConjugations.includes("verbPast") && validSpecialConjugations.includes("verbて")) { //decides past or present
    if (RNG(5)) {
      specialConjForms.verbて = true;
    }
    else {
      if (RNG(2)) {
        ConjForms.verbPresent = true;
      }
      else {
        ConjForms.verbPresent = false;
      }
    }
  }
  else if (validConjugations.includes("verbPresent") && validSpecialConjugations.includes("verbて")) { //always present
    if (RNG(5)) {
      specialConjForms.verbて = true;
    }
    else {
      ConjForms.verbPresent = true;
    }
  }
  else if (validConjugations.includes("verbPast") && validSpecialConjugations.includes("verbて")) { //always past
    if (RNG(5)) {
      specialConjForms.verbて = true;
    }
    else {
      ConjForms.verbPresent = false;
    }
  }
  else if (validConjugations.includes("verbPresent") && validConjugations.includes("verbPast")) {
    if (RNG(2)) {
        ConjForms.verbPresent = true;
      }
      else {
        ConjForms.verbPresent = false;
      }
  }
  else if (validConjugations.includes("verbPresent")) {
    ConjForms.verbPresent = true;
  }
  else if (validConjugations.includes("verbPast")) {
    ConjForms.verbPresent = false;
  }
  if (validConjugations.includes("verbAffirmative") && validConjugations.includes("verbNegative")) { //decides aff or neg
    if (RNG(2)) {
      ConjForms.verbAffirmative = true;
    }
    else {
      ConjForms.verbAffirmative = false;
    }
  }
  else if (validConjugations.includes("verbAffirmative")) {
    ConjForms.verbAffirmative = true;
  }
  else if (validConjugations.includes("verbNegative")) {
    ConjForms.verbAffirmative = false;
  }
  if (validConjugations.includes("verbFormal") && validConjugations.includes("verbCasual")) { //decides formal or casual
    ConjForms.verbFormal = RNG(2);
  }
  else if (validConjugations.includes("verbFormal")) {
    ConjForms.verbFormal = true;
  }
  else if (validConjugations.includes("verbCasual")) {
    ConjForms.verbFormal = false;
  }
  if (specialConjForms.verbて) {
    if (ConjForms.verbAffirmative == true) {
      ConjForms.verbAffirmative = null;
    }
    ConjForms.verbFormal = null;
  }
  return { ...ConjForms, ...specialConjForms };
}

function listConjugations(conjugations) {
  let String = "";
  if (conjugations.verbて) {
    String += "て-form　";
  }

  if (conjugations.verbPotential) {
    String += "Potential　";
  }

  if (conjugations.verbCausative) {
    String += "Causative　";
  }

  if (conjugations.verbPassive) {
    String += "Passive　";
  }

  if (conjugations.verbCausativePassive) {
    String += "Causative-Passive　";
  }

  if (conjugations.verbImperative) {
    String += "Imperative　";
  }

  if (conjugations.verbVolitional) {
    String += "Volitional　";
  }

  if (conjugations.verbFormal) {
    String += "Formal　";
  }
  else if (conjugations.verbFormal == false) {
    String += "Casual　";
  }

  if (conjugations.verbPresent) {
    String += "Present　";
  }
  else if (conjugations.verbPresent == false) {
    String += "Past　";
  }

  if (conjugations.verbAffirmative) {
    String += "Affirmative　";
  }
  else if (conjugations.verbAffirmative == false) {
    String += "Negative　";
  }

  String = String.slice(0, -1);
  return String;
}

function adjListConjugations(conjugations) {
  let String = "";

  if (conjugations.nominalized) {
    String += "Nominalized　";
  }

  if (conjugations.adjて) {
    String += "て-form　";
  }
  
  if (conjugations.adverb) {
    String += "Adverb　";
  }

  if (conjugations.adjFormal) {
    String += "Formal　";
  }
  else if (conjugations.adjFormal == false) {
    String += "Casual　";
  }

  if (conjugations.adjPresent) {
    String += "Present　";
  }
  else if (conjugations.adjPresent == false) {
    String += "Past　";
  }

  if (conjugations.adjAffirmative) {
    String += "Affirmative　";
  }
  else if (conjugations.adjAffirmative == false) {
    String += "Negative　";
  }
  String = String.slice(0, -1);
  return String;
}

function getType(Object) {
  if (Object.type == "ru") {
    return "Ichidan Verb";
  }
  else if (Object.type == "u") {
    return "Godan Verb";
  }
  else if (Object.type == "exv") {
    return "Exception Verb";
  }
  else if (Object.type == "i") {
    return "い-adjective";
  }
  else if (Object.type == "na") {
    return "な-adjective";
  }
  else {
    return "Exception adjective";
  }
}

function getGodanType(verbObject) { //returns す、う、く、む as string
  if (verbObject.kana.substring(verbObject.kana.length - 1, verbObject.kana.length) == "す") {
    return "す";
  }
  else if (verbObject.kana.substring(verbObject.kana.length - 1, verbObject.kana.length) == "く" || verbObject.kana.substring(verbObject.kana.length - 1, verbObject.kana.length) == "ぐ") {
    return "く";
  }
  else if (verbObject.kana.substring(verbObject.kana.length - 1, verbObject.kana.length) == "む" || verbObject.kana.substring(verbObject.kana.length - 1, verbObject.kana.length) == "ぶ" || verbObject.kana.substring(verbObject.kana.length - 1, verbObject.kana.length) == "ぬ") {
    return "む";
  }
  else if (verbObject.kana.substring(verbObject.kana.length - 1, verbObject.kana.length) == "う" || verbObject.kana.substring(verbObject.kana.length - 1, verbObject.kana.length) == "る" || verbObject.kana.substring(verbObject.kana.length - 1, verbObject.kana.length) == "つ") {
    return "う";
  }
}

function getLast(verbObject) { //returns last char of string
  return verbObject.kana.substring(verbObject.kana.length - 1, verbObject.kana.length);
}

function inflect(verbObject, target) {
  if (getLast(verbObject) == "す") {
    if (target == "a") {
      return "さ";
    }
    else if (target == "i") {
      return "し";
    }
    else if (target == "e") {
      return "せ";
    }
    else if (target == "o") {
      return "そ";
    }
  }
  else if (getLast(verbObject) == "つ") {
    if (target == "a") {
      return "た";
    }
    else if (target == "i") {
      return "ち";
    }
    else if (target == "e") {
      return "て";
    }
    else if (target == "o") {
      return "と";
    }
  }
  else if (getLast(verbObject) == "う") {
    if (target == "a") {
      return "わ";
    }
    else if (target == "i") {
      return "い";
    }
    else if (target == "e") {
      return "え";
    }
    else if (target == "o") {
      return "お";
    }
  }
  else if (getLast(verbObject) == "る") {
    if (target == "a") {
      return "ら";
    }
    else if (target == "i") {
      return "り";
    }
    else if (target == "e") {
      return "れ";
    }
    else if (target == "o") {
      return "ろ";
    }
  }
  else if (getLast(verbObject) == "く") {
    if (target == "a") {
      return "か";
    }
    else if (target == "i") {
      return "き";
    }
    else if (target == "e") {
      return "け";
    }
    else if (target == "o") {
      return "こ";
    }
  }
  else if (getLast(verbObject) == "ぐ") {
    if (target == "a") {
      return "が";
    }
    else if (target == "i") {
      return "ぎ";
    }
    else if (target == "e") {
      return "げ";
    }
    else if (target == "o") {
      return "ご";
    }
  }
  else if (getLast(verbObject) == "ぶ") {
    if (target == "a") {
      return "ば";
    }
    else if (target == "i") {
      return "び";
    }
    else if (target == "e") {
      return "べ";
    }
    else if (target == "o") {
      return "ぼ";
    }
  }
  else if (getLast(verbObject) == "ぬ") {
    if (target == "a") {
      return "な";
    }
    else if (target == "i") {
      return "に";
    }
    else if (target == "e") {
      return "ね";
    }
    else if (target == "o") {
      return "の";
    }
  }
  else if (getLast(verbObject) == "む") {
    if (target == "a") {
      return "ま";
    }
    else if (target == "i") {
      return "み";
    }
    else if (target == "e") {
      return "め";
    }
    else if (target == "o") {
      return "も";
    }
  }
}

function getStem(verbObject) {
  if (verbObject.type == "ru") {
    return (verbObject.kana.substring(0,verbObject.kana.length - 1));
  }
  else if (verbObject.type == "u") {
    return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "i")));
  }
  else {
    return null;
  }
}

function conjugate(verbObject, conjugations) {
  if (conjugations.verbVolitional) { 
    if (conjugations.verbFormal) { //volitional formal
      return (getStem(verbObject).concat("ましょう"));
    }
    else { //volitional casual
      if (verbObject.type == "ru") { //ichidan
        return (getStem(verbObject).concat("よう"));
      }
      else { //godan
        return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "o").concat("う")));
      }
    }
  }
  if (conjugations.verbImperative) { //imperative
    if (conjugations.verbAffirmative == false) {
      return (verbObject.kana.concat("な"));
    }
    else {
      if (verbObject.type == "ru") { //ichidan
        return (getStem(verbObject).concat("ろ"));
      }
      else { //godan
        return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "e")));
      }
    }
  }
  if (conjugations.verbて) { //teForm
    if (conjugations.verbAffirmative == false) {
      if (verbObject.type == "ru") { //ichidan
        return (getStem(verbObject).concat("なくて"));
      }
      else { //godan
        return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("なくて")));
      }
    }
    else {
      if (verbObject.type == "ru") { //ichidan
        return (getStem(verbObject).concat("て"));
      }
      else { //godan
        if (getGodanType(verbObject) == "す") {
          return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "i").concat("て"))); //failed
        }
        else if (getGodanType(verbObject) == "う") {
          return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat("って"));
        }
        else if (getGodanType(verbObject) == "く") {
          if (getLast(verbObject) == "く") {
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat("いて"));
          }
          else {
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat("いで"));
          }
        }
        else if (getGodanType(verbObject) == "む") {
          return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat("んで")); //failed
        }
      }
    }
  }
  else if (conjugations.verbAffirmative == false) { //negative verbs
    if (conjugations.verbCausativePassive) { 
      if (conjugations.verbPresent) { 
        if (conjugations.verbFormal) { //negative causativePassive present formal
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させられません"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せられません")));
          }
        }
        else { //negative causativePassive present casual
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させられない"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せられない")));
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //negative causativePassive past formal
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させられませんでした"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せられませんでした")));
          }
        }
        else { //negative causativePassive past casual
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させられなかった"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せられなかった")));
          }
        }
      }
    }
    else if (conjugations.verbCausative) {
      if (conjugations.verbPresent) { 
        if (conjugations.verbFormal) { //negative causative present formal
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させません"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せません")));
          }
        }
        else { //negative causative present casual
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させない"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せない")));
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //negative causative past formal
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させませんでした"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せませんでした")));
          }
        }
        else { //negative causative past casual
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させなかった"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せなかった")));
          }
        }
      }
    }
    else if (conjugations.verbPassive) { 
      if (conjugations.verbPresent) { 
        if (conjugations.verbFormal) { //negative passive formal present
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られません"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("れません")));
          }
        }
        else { //negative passive present casual
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られない"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("れない")));
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //negative passive past formal
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られませんでした"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("れませんでした")));
          }
        }
        else { //negative passive past casual
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られなかった"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("れなかった")));
          }
        }
      }
    }
    else if (conjugations.verbPotential) {
      if (conjugations.verbPresent) {
        if (conjugations.verbFormal) { //negative potential formal present
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られません"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "e").concat("ません")));
          }
        }
        else { //negative potential present casual
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られない"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "e").concat("ない")));
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //negative potential past formal
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られませんでした"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "e").concat("ませんでした")));
          }
        }
        else { //negative potential past casual
          if (verbObject.type == "ru") { //ichidan 
            return (getStem(verbObject).concat("られなかった"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "e").concat("なかった"))); //failed
          }
        }
      }
    }
    else if (conjugations.verbFormal) {
      if (conjugations.verbPresent) { //negative formal present
        if (verbObject.type == "ru") { //ichidan
          return (getStem(verbObject).concat("ません"));
        }
        else { //godan
          return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "i").concat("ません")));
        }
      }
      else { //negative formal past
        if (verbObject.type == "ru") { //ichidan
          return (getStem(verbObject).concat("ませんでした"));
        }
        else { //godan
          return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "i").concat("ませんでした")));
        }
      }
    }
    else if (conjugations.verbPresent) { //negative casual present
      if (verbObject.type == "ru") { //ichidan
        return (getStem(verbObject).concat("ない"));
      }
      else { //godan
        return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("ない")));
      }
    }
    else { //negative casual past
      if (verbObject.type == "ru") { //ichidan
        return (getStem(verbObject).concat("なかった"));
      }
      else { //godan
        return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("なかった")));
      }
    }
  }
  else { //affirmative verbs
    if (conjugations.verbCausativePassive) { 
      if (conjugations.verbPresent) { 
        if (conjugations.verbFormal) { //affirmative causativePassive present formal
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させられます"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せられます")));
          }
        }
        else { //affirmative causativePassive present casual
          if (verbObject.type == "ru") { //ichidan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1) + "させられる");
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せられる")));
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //affirmative causativePassive past formal
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させられました"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せられました")));
          }
        }
        else { //affirmative causativePassive past casual
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させられた"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せられた")));
          }
        }
      }
    }
    else if (conjugations.verbCausative) {
      if (conjugations.verbPresent) { 
        if (conjugations.verbFormal) { //affirmative causative present formal
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させます"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せます")));
          }
        }
        else { //affirmative causative present casual
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させる"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せる")));
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //affirmative causative past formal
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させました"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せました")));
          }
        }
        else { //affirmative causative past casual
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("させた"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("せた")));
          }
        }
      }
    }
    else if (conjugations.verbPassive) { 
      if (conjugations.verbPresent) { 
        if (conjugations.verbFormal) { //affirmative passive formal present
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られます"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("れます")));
          }
        }
        else { //affirmative passive present casual
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られる"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("れる")));
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //affirmative passive past formal
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られました"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("れました")));
          }
        }
        else { //affirmative passive past casual
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られた"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "a").concat("れた")));
          }
        }
      }
    }
    else if (conjugations.verbPotential) {
      if (conjugations.verbPresent) {
        if (conjugations.verbFormal) { //affirmative potential formal present
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られます"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "e").concat("ます")));
          }
        }
        else { //affirmative potential present casual
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られる"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "e").concat("る")));
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //affirmative potential past formal
          if (verbObject.type == "ru") { //ichidan
            return (getStem(verbObject).concat("られました"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "e").concat("ました")));
          }
        }
        else { //affirmative potential past casual
          if (verbObject.type == "ru") { //ichidan 
            return (getStem(verbObject).concat("られた"));
          }
          else { //godan
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "e").concat("た")));
          }
        }
      }
    }
    
    else if (conjugations.verbFormal) {
      if (conjugations.verbPresent) { //affirmative formal present
        if (verbObject.type == "ru") { //ichidan
          return (getStem(verbObject).concat("ます"));
        }
        else { //godan
          return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "i").concat("ます")));
        }
      }
      else { //affirmative formal past
        if (verbObject.type == "ru") { //ichidan
          return (getStem(verbObject).concat("ました"));
        }
        else { //godan
          return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "i").concat("ました")));
        }
      }
    }
    else if (conjugations.verbPresent) { //affirmative casual present
      return (verbObject.kana);
    }
    else { //affirmative casual past
      if (verbObject.type == "ru") { //ichidan
        return (getStem(verbObject).concat("た"));
      }
      else { //godan
        if (getGodanType(verbObject) == "す") {
          return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat(inflect(verbObject, "i").concat("た")));
        }
        if (getGodanType(verbObject) == "う") {
          return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat("った"));
        }
        else if (getGodanType(verbObject) == "く" || getGodanType(verbObject) == "ぐ") {
          if (getLast(verbObject) == "く") {
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat("いた"));
          }
          else {
            return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat("いだ"));
          }
        }
        else if (getGodanType(verbObject) == "む") {
          return (verbObject.kana.substring(0,verbObject.kana.length - 1).concat("んだ"));
        }
      }
    }
  }
}

function conjugateAdj(adjObject, conjugations) {
  let adj = "";
  if (conjugations.adverb) {
    if (adjObject.type == "i") {
      return (adjObject.kana.substring(0,adjObject.kana.length - 1).concat("く"));
    }
    else {
      return (adjObject.kana.concat("に"));
    }
  }
  if (conjugations.nominalized) {
    if (adjObject.type == "i") {
      return (adjObject.kana.substring(0, adjObject.kana.length - 1).concat("さ"));
    }
    else {
      return (adjObject.kana.concat("さ"));
    }
  }
  if (conjugations.adjて) {
    if (conjugations.adjAffirmative == false) {
      if (adjObject.type == "i") {
        return(adjObject.kana.substring(0, adjObject.kana.length - 1).concat("くなくて"));
      }
      else {
        return(adjObject.kana.concat("じゃなくて"));
      }
    }
    else {
      if (adjObject.type == "i") {
        return(adjObject.kana.substring(0,adjObject.kana.length - 1).concat("くて"));
      }
      else {
        return(adjObject.kana.concat("で"));
      }
    }
  }
  if (conjugations.adjAffirmative == false) {
    if (conjugations.adjPresent) { //negative present
      if (adjObject.type == "i") {
        adj = adjObject.kana.substring(0,adjObject.kana.length - 1).concat("くない");
      }
      else {
        adj = adjObject.kana.concat("じゃない");
      }
      if (conjugations.adjFormal) {
        return adj.concat("です");
      }
      else {
        return adj;
      }
    }
    else { //negative past
      if (adjObject.type == "i") {
        adj = adjObject.kana.substring(0,adjObject.kana.length - 1).concat("くなかった");
      }
      else {
        adj = adjObject.kana.concat("じゃなかった");
      }
      if (conjugations.adjFormal) {
        return adj.concat("です");
      }
      else {
        return adj;
      }
    }
  }
  else {
    if (conjugations.adjPresent) { //present affirmative
      if (adjObject.type == "i") {
        adj = adjObject.kana;
      }
      else {
        adj = adjObject.kana;
      }
      if (conjugations.adjFormal) {
        return adj.concat("です");
      }
      else {
        return adj;
      }
    }
    else { //past affirmative
      if (adjObject.type == "i") {
        adj = adjObject.kana.substring(0,adjObject.kana.length - 1).concat("かった");
      }
      else {
        adj = adjObject.kana.concat("だった");
      }
      if (conjugations.adjFormal) {
        if (adjObject.type == "i") {
          return adj.concat("です");
        }
        else {
          return adjObject.kana.concat("でした");
        }
      }
      else {
        return adj;
      }
    }
  }
}

function conjugateExv(verbObject, conjugations) {
  if (conjugations.verbVolitional) { 
    if (conjugations.verbFormal) { //volitional formal
      if (verbObject.kana == "する") {
        return "しましょう"
      }
      else if (verbObject.kana == "くる") {
        return "きましょう"
      }
      else if (verbObject.kana == "いく") {
        return "いきましょう"
      }
    }
    else { //volitional casual
      if (verbObject.kana == "する") {
        return "しよう"
      }
      else if (verbObject.kana == "くる") {
        return "こよう"
      }
      else if (verbObject.kana == "いく") {
        return "いこう"
      }
    }
  }
  if (conjugations.verbImperative) { //imperative
    if (conjugations.verbAffirmative == false) {
      return verbObject.kana.concat("な");
    }
    else {
      if (verbObject.kana == "する") {
        return "しろ"
      }
      else if (verbObject.kana == "くる") {
        return "こい"
      }
      else if (verbObject.kana == "いく") {
        return "いけ"
      }
    }
  }
  if (conjugations.verbて) { //teForm
    if (conjugations.verbAffirmative == false) {
      if (verbObject.kana == "する") {
        return "しなくて"
      }
      else if (verbObject.kana == "くる") {
        return "こなくて"
      }
      else if (verbObject.kana == "いく") {
        return "いかなくて"
      }
      else if (verbObject.kana == "ある") {
        return "なくて"
      }
    }
    else {
      if (verbObject.kana == "する") {
        return "して"
      }
      else if (verbObject.kana == "くる") {
        return "きて"
      }
      else if (verbObject.kana == "いく") {
        return "いって"
      }
      else if (verbObject.kana == "ある") {
        return "あって"
      }
    }
  }
  else if (conjugations.verbAffirmative == false) { //negative verbs
    if (conjugations.verbCausativePassive) { 
      if (conjugations.verbPresent) { 
        if (conjugations.verbFormal) { //negative causativePassive present formal
          if (verbObject.kana == "する") {
            return "させられません"
          }
          else if (verbObject.kana == "くる") {
            return "こさせられません"
          }
          else if (verbObject.kana == "いく") {
            return "いかせられません"
          }
        }
        else { //negative causativePassive present casual
          if (verbObject.kana == "する") {
            return "させられない"
          }
          else if (verbObject.kana == "くる") {
            return "こさせられない"
          }
          else if (verbObject.kana == "いく") {
            return "いかせられない"
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //negative causativePassive past formal
          if (verbObject.kana == "する") {
            return "させられませんでした"
          }
          else if (verbObject.kana == "くる") {
            return "こさせられませんでした"
          }
          else if (verbObject.kana == "いく") {
            return "いかせられませんでした"
          }
        }
        else { //negative causativePassive past casual
          if (verbObject.kana == "する") {
            return "させられなかった"
          }
          else if (verbObject.kana == "くる") {
            return "こさせられなかった"
          }
          else if (verbObject.kana == "いく") {
            return "いかせられなかった"
          }
        }
      }
    }
    else if (conjugations.verbCausative) {
      if (conjugations.verbPresent) { 
        if (conjugations.verbFormal) { //negative causative present formal
          if (verbObject.kana == "する") {
            return "させません"
          }
          else if (verbObject.kana == "くる") {
            return "こさせません"
          }
          else if (verbObject.kana == "いく") {
            return "いかせません"
          }
        }
        else { //negative causative present casual
          if (verbObject.kana == "する") {
            return "させない"
          }
          else if (verbObject.kana == "くる") {
            return "こさせない"
          }
          else if (verbObject.kana == "いく") {
            return "いかせない"
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //negative causative past formal
          if (verbObject.kana == "する") {
            return "させませんでした"
          }
          else if (verbObject.kana == "くる") {
            return "こさせませんでした"
          }
          else if (verbObject.kana == "いく") {
            return "いかせませんでした"
          }
        }
        else { //negative causative past casual
          if (verbObject.kana == "する") {
            return "させなかった"
          }
          else if (verbObject.kana == "くる") {
            return "こさせなかった"
          }
          else if (verbObject.kana == "いく") {
            return "いかせなかった"
          }
        }
      }
    }
    else if (conjugations.verbPassive) { 
      if (conjugations.verbPresent) { 
        if (conjugations.verbFormal) { //negative passive formal present
          if (verbObject.kana == "する") {
            return "されません"
          }
          else if (verbObject.kana == "くる") {
            return "こられません"
          }
          else if (verbObject.kana == "いく") {
            return "いかれません"
          }
        }
        else { //negative passive present casual
          if (verbObject.kana == "する") {
            return "されない"
          }
          else if (verbObject.kana == "くる") {
            return "こられない"
          }
          else if (verbObject.kana == "いく") {
            return "いかれない"
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //negative passive past formal
          if (verbObject.kana == "する") {
            return "されませんでした"
          }
          else if (verbObject.kana == "くる") {
            return "こられませんでした"
          }
          else if (verbObject.kana == "いく") {
            return "いかれませんでした"
          }
        }
        else { //negative passive past casual
          if (verbObject.kana == "する") {
            return "されなかった"
          }
          else if (verbObject.kana == "くる") {
            return "こられなかった"
          }
          else if (verbObject.kana == "いく") {
            return "いかれなかった"
          }
        }
      }
    }
    else if (conjugations.verbPotential) {
      if (conjugations.verbPresent) {
        if (conjugations.verbFormal) { //negative potential formal present
          if (verbObject.kana == "する") {
            return "できません"
          }
          else if (verbObject.kana == "くる") {
            return "こられません"
          }
          else if (verbObject.kana == "いく") {
            return "いけません"
          }
        }
        else { //negative potential present casual
          if (verbObject.kana == "する") {
            return "できない"
          }
          else if (verbObject.kana == "くる") {
            return "こられない"
          }
          else if (verbObject.kana == "いく") {
            return "いけない"
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //negative potential past formal
          if (verbObject.kana == "する") {
            return "できませんでした"
          }
          else if (verbObject.kana == "くる") {
            return "こられませんでした"
          }
          else if (verbObject.kana == "いく") {
            return "いけませんでした"
          }
        }
        else { //negative potential past casual
          if (verbObject.kana == "する") {
            return "できなかった"
          }
          else if (verbObject.kana == "くる") {
            return "こられなかった"
          }
          else if (verbObject.kana == "いく") {
            return "いけなかった"
          }
        }
      }
    }
    else if (conjugations.verbFormal) {
      if (conjugations.verbPresent) { //negative formal present
        if (verbObject.kana == "する") {
          return "しません"
        }
        else if (verbObject.kana == "くる") {
          return "きません"
        }
        else if (verbObject.kana == "いく") {
          return "いきません"
        }
        else if (verbObject.kana == "ある") {
          return "ありません"
        }
      }
      else { //negative formal past
        if (verbObject.kana == "する") {
          return "しませんでした"
        }
        else if (verbObject.kana == "くる") {
          return "きませんでした"
        }
        else if (verbObject.kana == "いく") {
          return "いきませんでした"
        }
        else if (verbObject.kana == "ある") {
          return "ありませんでした"
        }
      }
    }
    else if (conjugations.verbPresent) { //negative casual present
      if (verbObject.kana == "する") {
        return "しない"
      }
      else if (verbObject.kana == "くる") {
        return "こない"
      }
      else if (verbObject.kana == "いく") {
        return "いかない"
      }
      else if (verbObject.kana == "ある") {
        return "ない"
      }
    }
    else { //negative casual past
      if (verbObject.kana == "する") {
        return "しなかった"
      }
      else if (verbObject.kana == "くる") {
        return "こなかった"
      }
      else if (verbObject.kana == "いく") {
        return "いかなかった"
      }
      else if (verbObject.kana == "ある") {
        return "なかった"
      }
    }
  }
  else { //affirmative verbs
    if (conjugations.verbCausativePassive) { 
      if (conjugations.verbPresent) { 
        if (conjugations.verbFormal) { //affirmative causativePassive present formal
          if (verbObject.kana == "する") {
            return "させられます"
          }
          else if (verbObject.kana == "くる") {
            return "こさせられます"
          }
          else if (verbObject.kana == "いく") {
            return "いかせられます"
          }
        }
        else { //affirmative causativePassive present casual
          if (verbObject.kana == "する") {
            return "させられる"
          }
          else if (verbObject.kana == "くる") {
            return "こさせられる"
          }
          else if (verbObject.kana == "いく") {
            return "いかせられる"
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //affirmative causativePassive past formal
          if (verbObject.kana == "する") {
            return "させられました"
          }
          else if (verbObject.kana == "くる") {
            return "こさせられました"
          }
          else if (verbObject.kana == "いく") {
            return "いかせられました"
          }
        }
        else { //affirmative causativePassive past casual
          if (verbObject.kana == "する") {
            return "させられた"
          }
          else if (verbObject.kana == "くる") {
            return "こさせられた"
          }
          else if (verbObject.kana == "いく") {
            return "いかせられた"
          }
        }
      }
    }
    else if (conjugations.verbCausative) {
      if (conjugations.verbPresent) { 
        if (conjugations.verbFormal) { //affirmative causative present formal
          if (verbObject.kana == "する") {
            return "させます"
          }
          else if (verbObject.kana == "くる") {
            return "こさせます"
          }
          else if (verbObject.kana == "いく") {
            return "いかせます"
          }
        }
        else { //affirmative causative present casual
          if (verbObject.kana == "する") {
            return "させる"
          }
          else if (verbObject.kana == "くる") {
            return "こさせる"
          }
          else if (verbObject.kana == "いく") {
            return "いかせる"
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //affirmative causative past formal
          if (verbObject.kana == "する") {
            return "させました"
          }
          else if (verbObject.kana == "くる") {
            return "こさせました"
          }
          else if (verbObject.kana == "いく") {
            return "いかせました"
          }
        }
        else { //affirmative causative past casual
          if (verbObject.kana == "する") {
            return "させた"
          }
          else if (verbObject.kana == "くる") {
            return "こさせた"
          }
          else if (verbObject.kana == "いく") {
            return "いかせた"
          }
        }
      }
    }
    else if (conjugations.verbPassive) { 
      if (conjugations.verbPresent) { 
        if (conjugations.verbFormal) { //affirmative passive formal present
          if (verbObject.kana == "する") {
            return "されます"
          }
          else if (verbObject.kana == "くる") {
            return "こられます"
          }
          else if (verbObject.kana == "いく") {
            return "いかれます"
          }
        }
        else { //affirmative passive present casual
          if (verbObject.kana == "する") {
            return "される"
          }
          else if (verbObject.kana == "くる") {
            return "こられる"
          }
          else if (verbObject.kana == "いく") {
            return "いかれる"
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //affirmative passive past formal
          if (verbObject.kana == "する") {
            return "されました"
          }
          else if (verbObject.kana == "くる") {
            return "こられました"
          }
          else if (verbObject.kana == "いく") {
            return "いかれました"
          }
        }
        else { //affirmative passive past casual
          if (verbObject.kana == "する") {
            return "された"
          }
          else if (verbObject.kana == "くる") {
            return "こられた"
          }
          else if (verbObject.kana == "いく") {
            return "いかれた"
          }
        }
      }
    }
    else if (conjugations.verbPotential) {
      if (conjugations.verbPresent) {
        if (conjugations.verbFormal) { //affirmative potential formal present
          if (verbObject.kana == "する") {
            return "できます"
          }
          else if (verbObject.kana == "くる") {
            return "こられます"
          }
          else if (verbObject.kana == "いく") {
            return "いけます"
          }
        }
        else { //affirmative potential present casual
          if (verbObject.kana == "する") {
            return "できる"
          }
          else if (verbObject.kana == "くる") {
            return "こられる"
          }
          else if (verbObject.kana == "いく") {
            return "いける"
          }
        }
      }
      else {
        if (conjugations.verbFormal) { //affirmative potential past formal
          if (verbObject.kana == "する") {
            return "できました"
          }
          else if (verbObject.kana == "くる") {
            return "こられました"
          }
          else if (verbObject.kana == "いく") {
            return "いけました"
          }
        }
        else { //affirmative potential past casual
          if (verbObject.kana == "する") {
            return "できた"
          }
          else if (verbObject.kana == "くる") {
            return "こられた"
          }
          else if (verbObject.kana == "いく") {
            return "いけた"
          }
        }
      }
    }
    
    else if (conjugations.verbFormal) {
      if (conjugations.verbPresent) { //affirmative formal present
        if (verbObject.kana == "する") {
          return "します"
        }
        else if (verbObject.kana == "くる") {
          return "きます"
        }
        else if (verbObject.kana == "いく") {
          return "いきます"
        }
        else if (verbObject.kana == "ある") {
          return "あります"
        }
      }
      else { //affirmative formal past
        if (verbObject.kana == "する") {
          return "しました"
        }
        else if (verbObject.kana == "くる") {
          return "きました"
        }
        else if (verbObject.kana == "いく") {
          return "いきました"
        }
        else if (verbObject.kana == "ある") {
          return "ありました"
        }
      }
    }
    else if (conjugations.verbPresent) { //affirmative casual present
      return (verbObject.kana);
    }
    else { //affirmative casual past
      if (verbObject.kana == "する") {
        return "した"
      }
      else if (verbObject.kana == "くる") {
        return "きた"
      }
      else if (verbObject.kana == "いく") {
        return "いった"
      }
      else if (verbObject.kana == "ある") {
        return "あった"
      }
    }
  }
}

function conjugateExa(adjObject, conjugations) {
  let adj = "";
  if (conjugations.adverb) {
    let newString = (adjObject.kana.substring(0, adjObject.kana.length - 2) + "よ" + adjObject.kana.slice(-1));
    return (newString.substring(0,adjObject.kana.length - 1).concat("く"));
  }
  if (conjugations.nominalized) {
    let newString = (adjObject.kana.substring(0, adjObject.kana.length - 2) + "よ" + adjObject.kana.slice(-1));
    return (newString.substring(0, adjObject.kana.length - 1).concat("さ"));
  }
  if (conjugations.adjて) {
    if (conjugations.adjAffirmative == false) {
      let newString = (adjObject.kana.substring(0, adjObject.kana.length - 2) + "よ" + adjObject.kana.slice(-1));
      return(newString.substring(0, adjObject.kana.length - 1).concat("くなくて"));
    }
    else {
      let newString = (adjObject.kana.substring(0, adjObject.kana.length - 2) + "よ" + adjObject.kana.slice(-1));
      return(newString.substring(0,adjObject.kana.length - 1).concat("くて"));
    }
  }
  if (conjugations.adjAffirmative == false) {
    if (conjugations.adjPresent) { //negative present
      let newString = (adjObject.kana.substring(0, adjObject.kana.length - 2) + "よ" + adjObject.kana.slice(-1));
      adj = newString.substring(0,adjObject.kana.length - 1).concat("くない");
      if (conjugations.adjFormal) {
        return adj.concat("です");
      }
      else {
        return adj;
      }
    }
    else { //negative past
      let newString = (adjObject.kana.substring(0, adjObject.kana.length - 2) + "よ" + adjObject.kana.slice(-1));
      adj = newString.substring(0,adjObject.kana.length - 1).concat("くなかった");
      if (conjugations.adjFormal) {
        return adj.concat("です");
      }
      else {
        return adj;
      }
    }
  }
  else {
    if (conjugations.adjPresent) { //present affirmative
      adj = adjObject.kana;
      if (conjugations.adjFormal) {
        return adj.concat("です");
      }
      else {
        return adj;
      }
    }
    else { //past affirmative
      let newString = (adjObject.kana.substring(0, adjObject.kana.length - 2) + "よ" + adjObject.kana.slice(-1));
        adj = newString.substring(0,adjObject.kana.length - 1).concat("かった");
      if (conjugations.adjFormal) {
        return adj.concat("です");
      }
      else {
        return adj;
      }
    }
  }
}

function getRandomWord(words, wordPool) {
  //convert the words object to an array of arrays
  const allWords = Object.keys(words)
      .filter(key => wordPool.includes(key))
      .map(key => words[key]);

  const flatAllowedWords = [].concat(...allWords);
  const randomIndex = Math.floor(Math.random() * flatAllowedWords.length);

  return flatAllowedWords[randomIndex];
}

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function RNG(num) {
  const randomNumber = Math.floor(Math.random() * num) + 1;
  return num === randomNumber;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

//define every checkbox
const verbIchidan = document.getElementById("verbIchidan");
const verbす = document.getElementById("verbす");
const verbく = document.getElementById("verbく");
const verbむ = document.getElementById("verbむ");
const verbう = document.getElementById("verbう");
const verbException = document.getElementById("verbException");
const verbPotential = document.getElementById("verbPotential");
const verbPassive = document.getElementById("verbPassive");
const verbCausative = document.getElementById("verbCausative");
const verbCausativePassive = document.getElementById("verbCausativePassive");
const verbImperative = document.getElementById("verbImperative");
const verbVolitional = document.getElementById("verbVolitional");
const verbPresent = document.getElementById("verbPresent");
const verbPast = document.getElementById("verbPast");
const verbて = document.getElementById("verbて");
const verbAffirmative = document.getElementById("verbAffirmative");
const verbNegative = document.getElementById("verbNegative");
const verbCasual = document.getElementById("verbCasual");
const verbFormal = document.getElementById("verbFormal");
const adjい = document.getElementById("adjい");
const adjな = document.getElementById("adjな");
const adjException = document.getElementById("adjException");
const adjPresent = document.getElementById("adjPresent");
const adjPast = document.getElementById("adjPast");
const adjて = document.getElementById("adjて");
const adverb = document.getElementById("adverb");
const adjAffirmative = document.getElementById("adjAffirmative");
const adjNegative = document.getElementById("adjNegative");
const adjCasual = document.getElementById("adjCasual");
const adjFormal = document.getElementById("adjFormal");
const nominalized = document.getElementById("nominalized");
const furigana = document.getElementById("furigana");

const checkboxes = document.querySelectorAll('input[type="checkbox"]'); //check every checkbox
checkboxes.forEach(checkbox => {
  checkbox.checked = true;
});

function conjList(element) {
  if (element.checked) {
    if (element.id == "verbAffirmative" || element.id == "verbNegative") {
      verbAffOrNeg.push(element.id);
    }
    if (element.id == "verbFormal" || element.id == "verbCasual") {
      verbFormality.push(element.id);
    }
    if (element.id == "verbPresent" || element.id == "verbPast") {
      verbTenses.push(element.id);
    }
    ConjPool.push(element.id);
  }
  else {
    let index;

    if (element.id == "verbAffirmative" || element.id == "verbNegative") {
      index = verbAffOrNeg.indexOf(element.id);
      if(index !== -1) verbAffOrNeg.splice(index, 1);
    }
    if (element.id == "verbFormal" || element.id == "verbCasual") {
      index = verbFormality.indexOf(element.id);
      if(index !== -1) verbFormality.splice(index, 1);
    }
    if (element.id == "verbPresent" || element.id == "verbPast") {
      index = verbTenses.indexOf(element.id);
      if(index !== -1) verbTenses.splice(index, 1);
    }

    index = ConjPool.indexOf(element.id);
    if(index !== -1) ConjPool.splice(index, 1);
  }
  checkboxCheck(element);
}

function adjConjList(element) {
  if (element.checked) {
    if (element.id == "adjAffirmative" || element.id == "adjNegative") {
      adjAffOrNeg.push(element.id);
    }
    if (element.id == "adjFormal" || element.id == "adjCasual") {
      adjFormality.push(element.id);
    }
    if (element.id == "adjPresent" || element.id == "adjPast") {
      adjTenses.push(element.id);
    }
    adjConjPool.push(element.id);
    console.log(adjConjPool);
  }
  else {
    let index;

    if (element.id == "adjAffirmative" || element.id == "adjNegative") {
      index = adjAffOrNeg.indexOf(element.id);
      if(index !== -1) adjAffOrNeg.splice(index, 1);
    }
    if (element.id == "adjFormal" || element.id == "adjCasual") {
      index = adjFormality.indexOf(element.id);
      if(index !== -1) adjFormality.splice(index, 1);
    }
    if (element.id == "adjPresent" || element.id == "adjPast") {
      index = adjTenses.indexOf(element.id);
      if(index !== -1) adjTenses.splice(index, 1);
    }

    index = adjConjPool.indexOf(element.id);
    if(index !== -1) adjConjPool.splice(index, 1);
    console.log(adjConjPool);
  }
  checkboxCheck(element);
}

function specialList(element) {
  if (element.checked) {
    if (element.id == "verbて") {
      verbTenses.push(element.id);
    }
    spConjPool.push(element.id);
  }
  else {
    let index;

    if (element.id == "verbて") {
      index = verbTenses.indexOf(element.id);
      if(index !== -1) verbTenses.splice(index, 1);
    }

    index = spConjPool.indexOf(element.id);
    if(index !== -1) spConjPool.splice(index, 1);
  }
  checkboxCheck(element);
}

function adjSpList(element) {
  if (element.checked) {
    if (element.id == "adjて" || element.id == "adverb" || element.id == "nominalized") {
      adjTenses.push(element.id);
    }
    adjSpConjPool.push(element.id);
  }
  else {
    let index;

    if (element.id == "adjて" || element.id == "adverb" || element.id == "nominalized") {
      index = adjTenses.indexOf(element.id);
      if(index !== -1) adjTenses.splice(index, 1);
    }

    index = adjSpConjPool.indexOf(element.id);
    if(index !== -1) adjSpConjPool.splice(index, 1);
  }
  checkboxCheck(element);
}

function wordList(element) {
  const index = wordPool.indexOf(element.id);
  let verbIndex = null;
  let adjIndex = null;
  if (element.id.startsWith("v")) {
    verbIndex = verbPool.indexOf(element.id);
  }
  else {
    adjIndex = adjPool.indexOf(element.id)
  }
  if (element.checked) {
    wordPool.push(element.id);
    if (element.id.startsWith("v")) {
      verbPool.push(element.id);
    }
    else {
      adjPool.push(element.id);
    }
  }
  else {
    if (index !== -1) {
      wordPool.splice(index, 1);
    }
    if (verbIndex !== -1 && verbIndex !== null) {
      verbPool.splice(verbIndex, 1);
    }
    if (adjIndex !== -1 && adjIndex !== null) {
      adjPool.splice(adjIndex, 1);
    }
  }
  checkboxCheck(element);
}

function checkboxCheck() {
  if (wordPool.length == 0 || verbAffOrNeg.length == 0 || verbFormality.length == 0 || verbTenses.length == 0 || adjTenses.length == 0 || adjAffOrNeg.length == 0 || adjFormality.length == 0) {
    document.getElementById("options").disabled = true;
  }
  else {
    document.getElementById("options").disabled = false;
  }
}


verbIchidan.addEventListener('click', () => {wordList(event.target)});
verbす.addEventListener('click', () => {wordList(event.target)});
verbく.addEventListener('click', () => {wordList(event.target)});
verbむ.addEventListener('click', () => {wordList(event.target)});
verbう.addEventListener('click', () => {wordList(event.target)});
verbException.addEventListener('click', () => {wordList(event.target)});
verbPotential.addEventListener('click', () => {specialList(event.target)});
verbPassive.addEventListener('click', () => {specialList(event.target)});
verbCausative.addEventListener('click', () => {specialList(event.target)});
verbCausativePassive.addEventListener('click', () => {specialList(event.target)});
verbImperative.addEventListener('click', () => {specialList(event.target)});
verbVolitional.addEventListener('click', () => {specialList(event.target)});
verbPresent.addEventListener('click', () => {conjList(event.target)});
verbPast.addEventListener('click', () => {conjList(event.target)});
verbて.addEventListener('click', () => {specialList(event.target)});
verbAffirmative.addEventListener('click', () => {conjList(event.target)});
verbNegative.addEventListener('click', () => {conjList(event.target)});
verbCasual.addEventListener('click', () => {conjList(event.target)});
verbFormal.addEventListener('click', () => {conjList(event.target)});

adjい.addEventListener('click', () => {wordList(event.target)});
adjな.addEventListener('click', () => {wordList(event.target)});
adjException.addEventListener('click', () => {wordList(event.target)});

adjPresent.addEventListener('click', () => {adjConjList(event.target)});
adjPast.addEventListener('click', () => {adjConjList(event.target)});
adjて.addEventListener('click', () => {adjSpList(event.target)});
adverb.addEventListener('click', () => {adjSpList(event.target)});
nominalized.addEventListener('click', () => {adjSpList(event.target)});

adjAffirmative.addEventListener('click', () => {adjConjList(event.target)});
adjNegative.addEventListener('click', () => {adjConjList(event.target)});

adjCasual.addEventListener('click', () => {adjConjList(event.target)});
adjFormal.addEventListener('click', () => {adjConjList(event.target)});


furigana.addEventListener('click', () => {manageFurigana(event.target)});

function manageFurigana(element) {
  const furiganaElements = document.querySelectorAll('rt');
  if (element.checked) {
    furiganaElements.forEach(element => {
      element.style.display = '';
    });
  }
  else {
    furiganaElements.forEach(element => {
      element.style.display = 'none';
    });
  }
}