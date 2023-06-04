'use strict';

const wordsDb = [];
let sessionLength = 0, maxToRepeat = 0, nextRepeated = 0;

let repeatList = [];
const problemList = [];
const recognizeList = [];
const sessionList = [];

let numberToRecognize = 0, numberWithProblem = 0, numberToRepeat = 0;

let progress = '';
let direction = '';

//let sessionLength = sessionList.length;

function sendRepeatStatus(sendNext) {
	//toCell(12, 'Q', maxToRepeat);
	console.log('sendNext? ' + sendNext);
	if(sendNext) toCell(14, 'Q', nextRepeated);
}

function sendWordChanges() {
	console.log("b " + unchangedCard.s + ":\t" + unchangedCard.f + " " + unchangedCard.b + " | " + unchangedCard.ff + " " + unchangedCard.bb);
	console.log("a " + currentWord.s + ":\t" + currentWord.f + " " + currentWord.b + " | " + currentWord.ff + " " + currentWord.bb);
	
	/*console.log('not saved!');
	return;*/

	if(currentWord.s !== unchangedCard.s) {
		toCell(currentWordId, 'E', currentWord.s);
	} 
	if(currentWord.f !== unchangedCard.f) {
		toCell(currentWordId, 'F', currentWord.f);
	} 
	if(currentWord.b !== unchangedCard.b) {
		toCell(currentWordId, 'G', currentWord.b);
	} 
	if(currentWord.ff !== unchangedCard.ff) {
		toCell(currentWordId, 'H', currentWord.ff);
	} 
	if(currentWord.bb !== unchangedCard.bb) {
		toCell(currentWordId, 'I', currentWord.bb);
	} 
}

function showStats() {
	$('.stats').empty();
	let re = '<b>';
	let cn = sessionLength - sessionList.length;
	let pc = Math.round(cn / sessionLength * 100);
	re += cn + '/' + sessionLength + ': ' + pc + '%</b>';
	
	re += ' | <span class="green">wl-' + numberToLearn + ': ';
	re += wordLearnPlus + '-' + wordLearnMinus;
	re += '<b> ' + wordLearned + '</b></span>';
	re += ' | <span class="green">wc-' + numberToConfirm + ': '; 
	re += wordConfirmPlus + '-' + wordConfirmMinus;
	re += '<b> ' + wordConfirmed + '-' + wordNotConfirmed + '</b></span>';
	re += ' | wr-' + numberToRepeat + '/' + numberWithProblem + ': ';
	re += wordRepeatPlus + '<sup>' + wordRepeatPlusAuto + '</sup>';
	re += '-' + wordRepeatMinus + '<b> ' + wordRepeated;
	re += '<sup>' + wordRepeatedAuto + '</sup>-' + wordReturned + '</b>';
	re+= ' | <span class="blue">[' + numberToRecognize + '] <b>';
	re += wordSuperPlus + '-' + wordSuperMinus + '</b></span>';
	
	re += ' || <span class="green">kl-' + numberToLearnKanji + ': ';
	re += kanjiLearnPlus + '-' + kanjiLearnMinus;
	re += '<b> ' + kanjiLearned + '</b></span>';
	re += ' | kr: ' + kanjiRepeatPlus + '<sup>' + kanjiRepeatPlusAuto + '</sup>';
	re += '-' + kanjiRepeatMinus + '<b> ' + kanjiRepeated;
	re += '<sup>' + kanjiRepeatedAuto + '</sup>-' + kanjiReturned + '</b>';
	re += ' | <span class="blue"><b>' + kanjiSuperPlus + '-' + kanjiSuperMinus + '</b></span>';
	
	$('.stats').append(re);
}

function pressedG() {
	switch(progress) {
		case 'FIRST_EVALUATION':
			if(direction !== 'FORWARD') break;
			$(".word").css("border-bottom", "6px solid green");
			wordFirstMark = "GOOD";
			break;
		case 'WORD_EVALUATION':
			$(".word-panel").css("border", "6px solid green");
			wordMark = "GOOD";
			break;
		case 'KANJI_EVALUATION':
			$(".kanji-panel").css("border", "6px solid green");
			kanjiMark = "GOOD";
			break;
		case 'RECOGNITION_EVALUATION':
			$(".word-panel").css("border", "6px solid green");
			wordMark = "GOOD";
			break;
		default: 
			console.log(progress);
	}
}

function pressedB() {
	switch(progress) {
		case 'FIRST_EVALUATION':
			if(direction !== 'FORWARD') break;
			$(".word").css("border-bottom", "6px solid red");
			wordFirstMark = "BAD";
			break;
		case 'WORD_EVALUATION':
			$(".word-panel").css("border", "6px solid red");
			wordMark = "BAD";
			break;
		case 'KANJI_EVALUATION':
			$(".kanji-panel").css("border", "6px solid red");
			kanjiMark = "BAD";
			break;
		case 'RECOGNITION_EVALUATION':
			$(".word-panel").css("border", "6px solid red");
			wordMark = "BAD";
			break;
		default: 
			console.log(progress);
	}
}

function pressedN() {
	switch(progress) {
		case "FIRST_EVALUATION":
			if(direction !== 'FORWARD') break;
			$(".word").css("border-bottom", "6px solid yellow");
			wordFirstMark = "NEUTRAL";
			break;
		case "WORD_EVALUATION":
			$(".word-panel").css("border", "6px solid yellow");
			wordMark = "NEUTRAL";
			break;
		default:
			console.log(progress);
	}
}

function pressedV() {
	switch(progress) {
		case "WORD_EVALUATION":
			if(direction !== "BACKWARD") return;
			$(".word-panel").css("border", "6px solid blue");
			wordMark = "BEST";
			break;
		case 'KANJI_EVALUATION':
			$(".kanji-panel").css("border", "6px solid blue");
			kanjiMark = "BEST";
			break;
		default:
			console.log(progress);
	}
}

function pressedEnter() {
	switch(progress) {
		case "WORD_QUESTION":
			showFirstAnswer();
			break;
		case "FIRST_EVALUATION":
			saveFirstResult();
			break;
		case "WORD_EVALUATION":
			saveProgressWord();
			break;
		case 'KANJI_QUESTION':
			showAnswerKanji();
			break;
		case 'KANJI_EVALUATION':
			saveProgressKanji();
			break;
		case 'READY_TO_GO':
			nextCard();
			break;
		case 'RECOGNITION':
			showAnswerToRecognize();
			break;
		case 'RECOGNITION_EVALUATION':
			saveRecognitionProgress();
			break;
		default: 
			console.log(progress);
	}
}

$(document).on("keypress", function (event) {

	//console.log(event.keyCode);
	$(".control").text(event.key);

	switch(event.keyCode) {
		case 97: 
			playAudio(0);
			break;
		case 13: 
			pressedEnter();
			break;
		case 103:
			pressedG();
			break;
		case 98:
			pressedB();
			break;
		case 110:
			pressedN();
			break;
		case 118: 
			pressedV();
			break;
		case 104:
			pressedH();
			break;
		case 112:
			pressedP();
			break;
	}

});

function clearList() {
	$('.single').empty();
	$('.right-half').empty();
	$('.left-half').empty();
}

function nextCard() {
	//showStats();

	clearList();
	
	if(sessionList.length < 1) {
		$('.word').empty().append('Happy End!');
		return;
	}
	let cardStatus = deleteRandomFromArray(sessionList);
	console.log(cardStatus);
	//console.log(sessionList);
	
	if(cardStatus[0] == 'K') {
		kanjiStatus = cardStatus;
		nextKanji();
		return;
	}
	if(cardStatus === 'RECOGNIZE') {
		nextRecognition();
		return;
	}
	wordStatus = cardStatus;
	nextWord();
	
	//nextKanji();
	//nextRecognition();
}

const main = function () {
	console.log('Document is ready!');
};
	
$(document).ready(main);
