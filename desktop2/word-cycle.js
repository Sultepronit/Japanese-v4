"use strict";

let wordStatus;
let currentWordId = 0;
let currentWord;
let writings;

let wordFirstMark = '';
let wordMark = '';

let wordRepeatPlus = 0, wordRepeatMinus = 0, wordRepeated = 0;
let wordRepeatPlusAuto = 0, wordRepeatedAuto = 0;
let wordReturned = 0;
let wordSuperPlus = 0, wordSuperMinus = 0;

let unchangedCard = {};

function nextWord() {
	$('.kanji-panel').hide();
	$('.word-panel').show();
	
	if(randomFromRange(0,1)) {
		$('.word').css('font-family', '"Noto Serif JP", serif');
	} else {
		$('.word').css('font-family', '"Noto Sans JP", sans-serif');
	}
	
	switch(wordStatus) {
		case 'PROBLEM':
			currentWordId = deleteRandomFromArray(problemList);
			break;
		case 'REPEAT':
			currentWordId = deleteRandomFromArray(repeatList);
			break;
		default:
			console.log("!!!" + wordStatus);
	}
	//currentWordId = randomFromRange(0, wordsDb.length -1);
	
	currentWord = wordsDb[currentWordId];
	//console.log(currentWordId);
	console.log(currentWord);
	
	writings = processWritings(currentWord);

	unchangedCard = Object.assign({}, currentWord);

	if(currentWord.f > currentWord.b) {
		direction = 'BACKWARD';
		if(currentWord.bb > 2.1 && currentWord.s > 2) {
			console.log('Word To PASS! [B]');
			//console.log("b " + currentWord.s + ":\t" + currentWord.f + " " + currentWord.b + " | " + currentWord.ff + " " + currentWord.bb);
			
			currentWord.f = 0;
			currentWord.b = 0;
			currentWord.s = nextRepeatedWord++;
			maxToRepeatWord++;
			sendCommonWordChanges();
			
			currentWord.bb = 2.1;
			wordRepeatedAuto++;
			wordRepeatPlusAuto++;
			
			showEverything();
			return;
		}
	} else {
		direction = 'FORWARD';
		if(currentWord.ff > 2.1) {
			console.log('Word To PASS! [F]');
			//console.log("b " + currentWord.s + ":\t" + currentWord.f + " " + currentWord.b + " | " + currentWord.ff + " " + currentWord.bb);
			
			currentWord.f++;
			
			currentWord.ff = 2.1;
			if(currentWord.bb > 2.1) currentWord.bb = 2.1;
			wordRepeatPlusAuto++;
			
			showEverything();
			return;
		}
	}
	//direction = 'BACKWARD';

	wordFirstMark = 'UNEVALUATED';
	wordMark = 'UNEVALUATED';
	
	showQuestionWord();
}

function showEverything() {
	sessionList.push('REPEAT');
	
	direction = 'BACKWARD';
	showQuestionWord();
	showFirstAnswer();
	showAnswerWord();
	$(".word-panel").css("border", "6px solid black");
	
	progress = 'READY_TO_GO';
	
	sendWordChanges();
}

function showQuestionWord() {
	progress = 'WORD_QUESTION';
	
	$('.card-info').empty();
	$('.kanji-list').empty();
	$('.word').empty();
	$('.gifs').empty();
	$('.transcription').empty();
	$('.translation').empty();
	$('.example').empty();
	$(".word").css("border-bottom", "6px solid white");
	$(".word-panel").css("border", "6px solid white");
	
	//$('.card-info').append(currentWordId);
	let info = '[' + currentWordId + '] ' + currentWord.s + ":\t";
	info += currentWord.f + " " + currentWord.b + " | " + currentWord.ff + " " + currentWord.bb;
	$('.card-info').append(info);
	
	if(direction === "FORWARD") {
		//$('.word').append(writings.allWritings);
		let rw = randomFromRange(0, writings.mainWritings.length - 1);
		$('.word').append(writings.mainWritings[rw]);
	} else { // BACKWARD
		$('.translation').append(currentWord.tsl);
	}
}

function showFirstAnswer() {
	progress = "FIRST_EVALUATION";
	
	//$('.transcription').text(currentWord.tsc);
	$('.transcription').text(writings.kana);
	playAudio(0);
}

function saveFirstResult() {
	if(direction === 'BACKWARD') { 
		showAnswerWord();
		return;
	}
	if(wordFirstMark === 'UNEVALUATED') return;
	
	showAnswerWord();
}

let kanjiFromWord = [];
function showKanjiList() {
	kanjiFromWord = [];
	let n = 0;
	for(let kanji of writings.allKanji) {
		
		let t = kanji;
		let learning = false;
		for(let card of kanjiDb) {
			if(card.k == kanji) {
				learning = true;
				t += ' - ' + card.n + ' <i>' + jooyoo[card.j][4] + '</i>';
				break;
			}
		}
		
		if(!learning) {
			for(let card of jooyoo) {
				if(card[0] == kanji) {
					t += ' - <i>' + card[4] + '</i>';
					break;
				}
			}
		}
		
		let $kanji = $('<span onmousedown="wordListToWord('+n+')">').append(t);
		$('.kanji-list').append($kanji);
		kanjiFromWord.push(kanji);
		n++;
	}
}

function showAnswerWord() {
	progress = "WORD_EVALUATION";
	
	insertGifs(writings.allKanji);
	showKanjiList();
	$('.example').append(example[currentWord.e]);
	$('.word').empty().append(writings.allWritings);
	
	if(direction === "FORWARD") {
		$('.translation').append(currentWord.tsl);
	} else { // BACKWARD
		//$('.word').append(writings.allWritings);
	}
}

function saveProgressWord() {
	if(wordMark === 'UNEVALUATED') return;
	
	// basic progress
	let change = 0;
	if(wordMark === 'GOOD' || wordMark === 'BEST') {
		change++;
		wordRepeatPlus++;
	} else if(wordMark === 'BAD') {
		change--;
		wordRepeatMinus++;
	}

	if(direction === 'FORWARD') {
		currentWord.f += change;
	} else { // BACKWARD
		currentWord.b += change;
	}
	
	// recognition/writing progress
	if(direction === 'FORWARD') {
		if(wordFirstMark === 'GOOD') {
			wordFirstMark = wordMark;
		} else if(wordFirstMark === 'NEUTRAL' && wordMark === 'BAD') {
			wordFirstMark = 'BAD';
		}

		if(wordFirstMark === 'GOOD') {
			currentWord.ff++;
			wordSuperPlus++;
		} else if(wordFirstMark === 'BAD') {
			currentWord.ff--;
			wordSuperMinus++;
			if(currentWord.ff > 1) currentWord.ff = 1;
		}
		if(currentWord.ff < 0) {
			currentWord.ff = 0;
			wordSuperMinus--;
		}
	} else { // BACKWARD
		if(wordMark === 'BEST') {
			currentWord.bb++;
			wordSuperPlus++;
		} else if(wordMark !== 'NEUTRAL') {
			currentWord.bb--;
			wordSuperMinus++;
			if(currentWord.bb > 1) currentWord.bb = 1;
		}
		if(currentWord.bb < 0) {
			currentWord.bb = 0;
			wordSuperMinus--;
		}
	}
	
	upgradeOrDegrade: {
		//degrade
		if(currentWord.f < -1 || currentWord.b < -1) {
			currentWord.s = -1;
			currentWord.f = 0;
			currentWord.b = 0;
			currentWord.ff = 0;
			currentWord.bb = 0;
			wordReturned++;
			
			//maxToRepeat++;
			//sendRepeatStatus();
			break upgradeOrDegrade;
		}
		
		//upgrade 
		if(currentWord.f > 0 && currentWord.b > 0) {
			currentWord.f = 0;
			currentWord.b = 0;
			currentWord.s = nextRepeated++;
			wordRepeated++;
			
			//maxToRepeat++;
			sendRepeatStatus(true);
			
			break upgradeOrDegrade;
		}
	}
	
	sendWordChanges();
	
	nextCard();
}
