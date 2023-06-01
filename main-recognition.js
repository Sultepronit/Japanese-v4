"use strict";

function nextRecognition() {
	/*$('.kanji-panel').hide();
	$('.word-panel').show();*/
	
	currentWordId = deleteRandomFromArray(recognizeList);
	currentWord = wordsDb[currentWordId];
	unchangedCard = Object.assign({}, currentWord);
	console.log(currentWordId);
	console.log(currentWord);
	
	writings = processWritings(currentWord);
	
	wordMark = 'UNEVALUATED';
	
	showQuestionToRecognize();
}

function showQuestionToRecognize() {
	direction = 'FORWARD';
	showQuestionWord();
	$(".word").css("border-bottom", "6px solid black");
	progress = 'RECOGNITION';
}

function showAnswerToRecognize() {
	showFirstAnswer();
	showAnswerWord();
	progress = 'RECOGNITION_EVALUATION';
}

function saveRecognitionProgress() {
	//if(wordMark === 'UNEVALUATED') return;
	//console.log(wordMark);
	
	if(wordMark === 'GOOD') {
		currentWord.ff++;
		wordSuperPlus++;
		if(currentWord.ff < 0) currentWord.ff = 0;
	} else {
		currentWord.ff--;
		wordSuperMinus++;
		//if(currentWord.ff < -1) currentWord.ff = -1;
	}
	
	sendWordChanges();
	
	nextCard();
}
