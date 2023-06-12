'use strict';

function nextRecognition() {
	$('.kanji-panel').hide();
	$('.word-panel').show();
	
	currentWordId = deleteRandomFromArray(recognizeList);
	currentWord = wordsDb[currentWordId];
	console.log(currentWordId);
	console.log(currentWord);
	
	writings = processWritings(currentWord);

	wordInputStats = {
		...currentWord,
		max: maxToRepeat,
		next: nextRepeated
	}
	
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
	if(wordMark === 'UNEVALUATED') return;
	//console.log(wordMark);
	//console.log("b " + currentWord.s + ":\t" + currentWord.f + " " + currentWord.b + " | " + currentWord.ff + " " + currentWord.bb);
	
	if(wordMark === 'GOOD') {
		currentWord.ff++;
		wordSuperPlus++;
	} else {
		currentWord.ff--;
		wordSuperMinus++;
		if(currentWord.ff < -1) currentWord.ff = -1;
	}
	
	//console.log("a " + currentWord.s + ":\t" + currentWord.f + " " + currentWord.b + " | " + currentWord.ff + " " + currentWord.bb);
	
	sendWordChanges();
	
	//nextCard();
}
