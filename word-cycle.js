"use strict";

var wordStatus;
var currentWordId = 0;
var currentWord;
var writings;

var wordFirstMark = '';
var wordMark = '';

var learnPlus = 0,  wordLearnMinus = 0, wordLearned = 0;
var wordConfirmPlus = 0, wordConfirmMinus = 0, wordConfirmed = 0;
var wordRepeatPlus = 0, wordRepeatMinus = 0, wordRepeated = 0;
var wordRepeatPlusAuto = 0, wordRepeatedAuto = 0;
var wordReturned = 0, wordNotConfirmed = 0;
var wordSuperPlus = 0, wordSuperMinus = 0;

function nextWord() {
	/*$('.kanji-panel').hide();
	$('.word-panel').show();*/
	
	if(randomFromRange(0,1)) {
		$('.word').css('font-family', '"Noto Serif JP", serif');
	} else {
		$('.word').css('font-family', '"Noto Sans JP", sans-serif');
	}
	
	switch(wordStatus) {
		case 'LEARN':
			currentWordId = deleteRandomFromArray(learnList);
			//console.log(learnList);
			break;
		case 'CONFIRM':
			currentWordId = deleteRandomFromArray(confirmList);
			break;
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
	//console.log(writings);
	
	wordFirstMark = 'UNEVALUATED';
	wordMark = 'UNEVALUATED';
	
	/*direction = 'FORWARD';
	direction = 'BACKWARD';
	var of2 = randomFromRange(0,1);*/
	//direction = of2 ? 'FORWARD' : 'BACKWARD';
	//direction = (currentWord.f > currentWord.b) ? 'BACKWARD' : 'FORWARD';
	
	if(currentWord.f > currentWord.b) {
		direction = 'BACKWARD';
		if(currentWord.bb > 2.1 && currentWord.s > 2) {
			console.log('Word To PASS! [B]');
			console.log("b " + currentWord.s + ":\t" + currentWord.f + " " + currentWord.b + " | " + currentWord.ff + " " + currentWord.bb);
			
			currentWord.f = 0;
			currentWord.b = 0;
			currentWord.s = nextRepeated++;
			maxToRepeat++;
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
			console.log("b " + currentWord.s + ":\t" + currentWord.f + " " + currentWord.b + " | " + currentWord.ff + " " + currentWord.bb);
			
			currentWord.f++;
			
			currentWord.ff = 2.1;
			if(currentWord.bb > 2.1) currentWord.bb = 2.1;
			wordRepeatPlusAuto++;
			
			showEverything();
			return;
		}
	}
	
	//if(currentWord.b > 1) direction = 'FORWARD';
	if(currentWord.ff <= 0 && currentWord.s < 2) direction = 'FORWARD';
	
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
	
	console.log("a " + currentWord.s + ":\t" + currentWord.f + " " + currentWord.b + " | " + currentWord.ff + " " + currentWord.bb);
	
	sendWordChanges();
}

function showQuestionWord() {
	progress = 'WORD_QUESTION';
	$('.evaluation').hide();
	$('.next').show();
	
	$('.card-info').empty();
	$('.kanji-list').empty();
	$('.word').empty();
	$('.gifs').empty();
	$('.transcription').empty();
	$('.translation').empty();
	$('.example').empty();
	$(".word").css("border-bottom", "6px solid white");
	$(".word-panel").css("border", "6px solid white");
	
	var info = currentWordId + ' [' + currentWord.s + "]:\t";
	info += currentWord.f + " " + currentWord.b + " | " + currentWord.ff;
	$('.card-info').append(info);
	
	if(direction === "FORWARD") {
		var rw = randomFromRange(0, writings.mainWritings.length - 1);
		$('.word').append(writings.mainWritings[rw]);
	} else { // BACKWARD
		$('.translation').append(currentWord.tsl);
	}
}

function showFirstAnswer() {
	progress = "FIRST_EVALUATION";
	if(direction === 'FORWARD') {
		$('.evaluation').show();
		$('.next').hide();
	}
	//$('.transcription').text(currentWord.tsc);
	$('.transcription').text(writings.kana);
	playAudio(0);
}

/*function saveFirstResult() {
	if(direction === 'BACKWARD') { 
		showAnswerWord();
		return;
	}
	if(wordFirstMark === 'UNEVALUATED') return;
	
	showAnswerWord();
}*/

var kanjiFromWord = [];
function showKanjiList() {
	kanjiFromWord = [];
	var n = 0;
	for(let kanji of writings.allKanji) {
		//console.log(kanji);	
		var t = kanji;
		var learning = false;
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
		
		var $kanji = $('<span onmousedown="wordListToWord('+n+')">').append(t);
		$('.kanji-list').append($kanji);
		kanjiFromWord.push(kanji);
		n++;
	}
}

function showAnswerWord() {
	progress = "WORD_EVALUATION";
	if(direction === 'BACKWARD') {
		$('.evaluation').show();
		$('.next').hide();
	}
	//insertGifs(writings.allKanji);
	showKanjiList();
	$('.example').append(example[currentWord.e]);
	$('.word').empty().append(writings.allWritings);
	
	if(direction === "FORWARD") {
		$('.translation').append(currentWord.tsl);
	} else { // BACKWARD
		//$('.word').append(writings.allWritings);
	}
}

function sendCommonWordChanges() {
	//var message = 'cc?mrw=' + maxToRepeat + '&nrw=' + nextRepeated;
	var message = 'sp?type=commonWord';
	message += '&mrw=' + maxToRepeat + '&nrw=' + nextRepeated;
	//console.log(message);
	//contactServer(message);
}

function sendWordChanges() {
	//var message = "sw?id=" + currentWordId + "&s=" + currentWord.s;
	var message = 'sp?type=word';
	message += '&id=' + currentWordId + '&s=' + currentWord.s;
	message += "&f=" + currentWord.f + "&b=" + currentWord.b;
	message += "&ff=" + currentWord.ff + "&bb=" + currentWord.bb;
	//console.log(message);
	//contactServer(message);
}

function saveProgressWord() {
	if(wordMark === 'UNEVALUATED') return;
	console.log("b " + currentWord.s + ":\t" + currentWord.f + " " + currentWord.b + " | " + currentWord.ff + " " + currentWord.bb);
	
	// basic progress
	if(currentWord.s == 0) {
		if(wordMark === 'NEUTRAL') wordMark = 'BAD';
		if(wordMark === 'BAD') {
			sessionList.push('LEARN');
			learnList.push(currentWordId);
			console.log('I\'m back!');
		}
	}
	var change = 0;
	if(wordMark === 'GOOD' || wordMark === 'BEST') {
		change++;
		switch(wordStatus) {
			case 'LEARN':
				learnPlus++;
				break;
			case 'CONFIRM':
				wordConfirmPlus++;
				break;
			default:
				wordRepeatPlus++;
		}
	} else if(wordMark === 'BAD') {
		change--;
		switch(wordStatus) {
			case 'LEARN':
				wordLearnMinus++;
				break;
			case 'CONFIRM':
				wordConfirmMinus++;
				break;
			default:
				wordRepeatMinus++;
		}
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
		if(currentWord.ff > 1 && currentWord.s < 2) currentWord.ff = 1;
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
		if(currentWord.bb > 1 && currentWord.s < 2) currentWord.bb = 1;
	}
	
	upgradeOrDegrade: {
		//degrade
		if(currentWord.f < -1 || currentWord.b < -1) {
			if(wordStatus !== 'LEARN') { 
				currentWord.s = 0;
				currentWord.f = 0;
				currentWord.b = 0;
				if(wordStatus === 'CONFIRM') {
					wordNotConfirmed++;
				} else { //REPEAT
					wordReturned++;
				}
				
				maxToRepeat++;
				sendCommonWordChanges();
			} else { //LEARN
				if(currentWord.f < -1) { //forward
					currentWord.f = -1;
				} else { //backward
					currentWord.f = 0;
					currentWord.b = 0;
				}
			}
			
			break upgradeOrDegrade;
		}
		
		//upgrade 
		if(currentWord.f > 0 && currentWord.b > 0) {
			if(wordStatus === 'REPEAT') {
				currentWord.f = 0;
				currentWord.b = 0;
				currentWord.s = nextRepeated++;
				wordRepeated++;
				
				maxToRepeat++;
				sendCommonWordChanges();
				
				break upgradeOrDegrade;
			}
			
			if(currentWord.ff <= 0) break upgradeOrDegrade;
			
			currentWord.f = 0;
			currentWord.b = 0;
			
			if(wordStatus === 'LEARN') {
				currentWord.s = 1;
				wordLearned++;
				
				maxToRepeat--;
				sendCommonWordChanges();
			} else { // CONFIRM
				currentWord.s = 2;
				wordConfirmed++;
			}
		}
	}
	
	console.log("a " + currentWord.s + ":\t" + currentWord.f + " " + currentWord.b + " | " + currentWord.ff + " " + currentWord.bb);
	
	sendWordChanges();
	
	nextCard();
}
