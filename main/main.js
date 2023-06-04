'use strict';

let muted = false;

let wordsDb = [];
let sessionLength = 0, confirmDivider = 0, maxToRepeat = 0, nextRepeated = 0;

let learnList = [];
let confirmList = [];
let repeatList = [];
let problemList = [];
let recognizeList = [];
let sessionList = [];

let numberToRecognize = 0, numberToLearn = 0, numberToConfirm = 0,
    numberWithProblem = 0, numberToRepeat = 0;

let progress = '';
let direction = '';

function sendRepeatStatus(sendNext) {
	toCell(5, 'Q', maxToRepeat);
	console.log('sendNext? ' + sendNext);
	if(sendNext) toCell(7, 'Q', nextRepeated);
}

function sendWordChanges() {
	//console.log('-----------');
	console.log("b " + unchangedCard.s + ":\t" + unchangedCard.f + " " + unchangedCard.b + " | " + unchangedCard.ff);
	console.log("a " + currentWord.s + ":\t" + currentWord.f + " " + currentWord.b + " | " + currentWord.ff);
	
	/*console.log('not saved!');
	return;*/

	if(currentWord.s !== unchangedCard.s) {
		toCell(currentWordId, 'A', currentWord.s);
	} 
	if(currentWord.f !== unchangedCard.f) {
		toCell(currentWordId, 'B', currentWord.f);
	} 
	if(currentWord.b !== unchangedCard.b) {
		toCell(currentWordId, 'C', currentWord.b);
	} 
	if(currentWord.ff !== unchangedCard.ff) {
		toCell(currentWordId, 'D', currentWord.ff);
	} 
	//toCell(currentWordId, 'E', 'here!');
}

function showStats() {
	$('.stats').empty();
	let cn = sessionLength - sessionList.length;
	let pc = Math.round(cn / sessionLength * 100);
    let re = '<b>';
	re += cn + '/' + sessionLength + ': ' + pc + '%</b>';
	
	re += ' | <span class="green">wl-' + numberToLearn + ': ';
	re += learnPlus + '-' + wordLearnMinus;
	re += '<b> ' + wordLearned + '</b></span>';
	re += ' | <span class="green">wc-' + numberToConfirm + ': '; 
	re += wordConfirmPlus + '-' + wordConfirmMinus;
	re += '<b> ' + wordConfirmed + '-' + wordNotConfirmed + '</b></span>';
	re += ' <br> wr-' + numberToRepeat + '/' + numberWithProblem + ': ';
	re += wordRepeatPlus + '<sup>' + wordRepeatPlusAuto + '</sup>';
	re += '-' + wordRepeatMinus + '<b> ' + wordRepeated;
	re += '<sup>' + wordRepeatedAuto + '</sup>-' + wordReturned + '</b>';
	re+= ' | <span class="blue">[' + numberToRecognize + '] <b>';
	re += wordSuperPlus + '-' + wordSuperMinus + '</b></span>';
	
	$('.stats').append(re);
}

function clearList() {
	$('.word-list').empty();
}

function nextCard() {
	showStats();

	clearList();
	
	if(sessionList.length < 1) {
		$('.word').empty().append('Happy End!');
		return;
	}
	//let cardStatus = deleteRandomFromArray(sessionList);
	wordStatus = deleteRandomFromArray(sessionList);
	console.log(wordStatus);
	//console.log(sessionList);
	
	if(wordStatus === 'RECOGNIZE') {
		nextRecognition();
		return;
	}
	//wordStatus = cardStatus;
	nextWord();
	//nextRecognition();
}

let pressedGood = function() {
    console.log(progress);
	switch(progress) {
		case 'FIRST_EVALUATION':
			if(direction !== 'FORWARD') break;
			$(".word").css("border-bottom", "6px solid green");
			wordFirstMark = "GOOD";
            showAnswerWord();
			break;
		case 'WORD_EVALUATION':
			$(".word-panel").css("border", "6px solid green");
			wordMark = "GOOD";
			saveProgressWord();
			break;
		case 'RECOGNITION_EVALUATION':
			//$(".word-panel").css("border", "6px solid green");
			wordMark = "GOOD";
			saveRecognitionProgress();
			break;
		default: 
			console.log(progress);
	}
}

let pressedBad = function() {
	switch(progress) {
		case 'FIRST_EVALUATION':
			if(direction !== 'FORWARD') break;
			$(".word").css("border-bottom", "6px solid red");
			wordFirstMark = "BAD";
			showAnswerWord();
			break;
		case 'WORD_EVALUATION':
			$(".word-panel").css("border", "6px solid red");
			wordMark = "BAD";
			saveProgressWord();
			break;
		case 'RECOGNITION_EVALUATION':
			//$(".word-panel").css("border", "6px solid red");
			wordMark = "BAD";
			saveRecognitionProgress();
			break;
		default: 
			console.log(progress);
	}
}

let pressedNeutral = function() {
	console.log(progress);
	switch(progress) {
		case "FIRST_EVALUATION":
			if(direction !== 'FORWARD') break;
			$(".word").css("border-bottom", "6px solid yellow");
			wordFirstMark = "NEUTRAL";
			showAnswerWord();
			break;
		case "WORD_EVALUATION":
			$(".word-panel").css("border", "6px solid yellow");
			wordMark = "NEUTRAL";
			saveProgressWord();
			break;
		default:
			console.log(progress);
	}
}

let pressedNext = function() {
	console.log(progress);
    switch(progress) {
		case "WORD_QUESTION":
			showFirstAnswer();
			break;
		case "FIRST_EVALUATION":
			//saveFirstResult();
			showAnswerWord();
			break;
		/*case "WORD_EVALUATION":
			saveProgressWord();
			break;*/
		case 'READY_TO_GO':
			nextCard();
			break;
		case 'RECOGNITION':
			showAnswerToRecognize();
			break;
		/*case 'RECOGNITION_EVALUATION':
			saveRecognitionProgress();
			break;*/
		default: 
			console.log(progress + '!!!');
    }
}

let toggleSound = function() {
	console.log('click!');
	muted = !muted;
	if(muted) {
		$('.sound').text('🔇');
	} else {
		$('.sound').text('🔊');
		playAudio(0);
	}
}

const main = function () {
	console.log('Document is ready!');
	//$('.evaluation').hide();
	//toCell(10,'O', 'go!');

	$('.sound').on('click', toggleSound);

    $('.next').on('click', pressedNext);
    $('.good').on('click', pressedGood);
	$('.neutral').on('click', pressedNeutral);
	$('.bad').on('click', pressedBad);
};
	
$(document).ready(main);