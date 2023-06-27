'use strict';

var kanjiSheet = [];
var kanjiList = [];

var maxToRepeat = 0;
var nextRepeated = 0;

var kanjiToRepeat = [];
var kanjiWithMistakes = [];;
var sessionList = [];
var currentCardId = 0;
var currentCard;

var cardStatus = '';

var showed = 0, withProblem = 0;
var plus = 0, minus = 0;
var repeated = 0, autoRepeated = 0;

function showAnswer() {
	$('.evaluation').show();
	$('.show').hide();
	
	var wordList = findKanjiInWords(currentCard[0]);
	for(let word of wordList) $('.word-list').append(word.line);
	
	var info = currentCardId + ' [' + currentCard[4] + '] ';
	info += currentCard[1] + '/' + currentCard[3];
	$('.card-info').append(info);
}

function showQuestion() {
	$('.evaluation').hide();
	$('.show').show();
	
	$('.kanji').empty();
	$('.word-list').empty();
	$('.card-info').empty();
	$('.stats').empty();

	$('.kanji').append(currentCard[0]);
	
	/*var info = currentCardId + ' [' + currentCard[4] + '] ';
	info += currentCard[1] + '/' + currentCard[3];
	$('.card-info').append(info);*/
	
	var stats = showed + '<i> ' + withProblem + '</i> ';
	stats += plus + '-' + minus;
	stats += '<b> ' + repeated + '<sup>' + autoRepeated + '</sup></b>';
	$('.stats').append(stats);
}

function upgradeCard() {
	toCell(currentCardId + 1, 'C', nextRepeated);
	toCell(2, 'F', ++nextRepeated);
}

function nextCard() {
	console.log('next!');
	
	cardStatus = deleteRandomFromArray(sessionList);
	console.log(sessionList);
	console.log(cardStatus);
	
	while(true) {
		if(cardStatus === 'REPEAT') {
			currentCardId = deleteRandomFromArray(kanjiToRepeat);
		} else { // PROBLEM
			currentCardId = deleteRandomFromArray(kanjiWithMistakes);
			withProblem++;
		}
		currentCard = kanjiSheet[currentCardId];
		console.log(currentCard);
		
		if(currentCard[3] > 1) {
			console.log('Auto Repeat!');
			autoRepeated++;
			toCell(currentCardId + 1, 'D', 1);
			upgradeCard();
			continue;
		}
		
		break;
	}
	showed++;
	
	//$('.kanji').append(currentCard[0]);
	showQuestion();
	
}

function implementEvaluation(mark) {
	switch(mark) {
		case 'NEUTRAL':
			break;
		case 'BAD':
			minus++;
			toCell(currentCardId + 1, 'B', --currentCard[1]);
			if(currentCard[3] > 0) toCell(currentCardId + 1, 'D', 0);
			break;
		default: // GOOD || BEST
			plus++;
			
			if(mark === 'BEST' && currentCard[1] == 0) {
				repeated++;
				upgradeCard();
				toCell(currentCardId + 1, 'D', 2);
			} else { // good*
				currentCard[1]++;
				
				if(currentCard[1] > 1) {
					currentCard[1] = 0;
					repeated++;
					upgradeCard();
				} else if(currentCard[1] < -1) {
					currentCard[1] = -1;
				}
				
				toCell(currentCardId + 1, 'B', currentCard[1]);
			}
			
			break;
	}
}

function evaluate(mark) {
	console.log(mark);
	
	implementEvaluation(mark);
	
	nextCard();
}

function getKanji() {
var kanjiSet = new Set();

for(let word of wordsDb) {
	var kanjiFromWord = processWritings(word).mainKanji;

	for(let kanji of kanjiFromWord) {
		if(kanjiSet.has(kanji)) continue;
		
		kanjiSet.add(kanji);
		var card = {kanji: kanji, index: 0};
		kanjiList.push(card);
	}
}
//console.log(kanjiList);
}

function prepareSession() {
	var superKanji = 0;
	maxToRepeat = kanjiSheet[5][5];
	nextRepeated = kanjiSheet[1][5]
	//console.log(maxToRepeat);
	//console.log(nextRepeated);
	
	for(var i = 0; i < kanjiSheet.length; i++) {
		if(kanjiSheet[i][3] > 0) superKanji++;
		
		if(kanjiSheet[i][1] < 0) {
			kanjiWithMistakes.push(i);
			//console.log(kanjiSheet[i]);
			continue;
		}
		
		if(kanjiSheet[i][2] < maxToRepeat) {
			kanjiToRepeat.push(i);
		}
	}
	var prc = Math.round(superKanji / kanjiSheet.length * 1000) / 10;
	console.log(superKanji + ': ' + prc + '%');
	console.log(kanjiWithMistakes);
	console.log(kanjiToRepeat);
	
	var numberWithMistakes = Math.round(kanjiWithMistakes.length / 2);
	//console.log(numberWithMistakes);
	
	var index = 0;
	for(;index < numberWithMistakes; index++) sessionList.push('PROBLEM');
	for(;index < 50; index++) sessionList.push('REPEAT');
	
	console.log(sessionList);
	
	nextCard();
}

function mergeDb() {
	var orphan = 0;
	for(var i = 0; i < kanjiList.length; i++) {
		
		// if there are new kanji
		if(i >= kanjiSheet.length) { 
			kanjiSheet.push([kanjiList[i].kanji, 0, 0, 0]);
			toCell(i + 1, 'A', kanjiList[i].kanji);
		}
		
		// if kanji order changed
		if(kanjiList[i].kanji != kanjiSheet[i][0]) { 
			if(kanjiSheet[i][0] == '') {
				kanjiSheet[i][0] = kanjiList[i].kanji;
				toCell(i + 1, 'A', kanjiList[i].kanji);
			} else {
				console.log(kanjiList[i].kanji + ':' + kanjiSheet[i][0]);
				document.write(kanjiList[i].kanji + ': (' + kanjiSheet[i][0] + ') ');
			}	
		}
		
		// find kanji indices
		kanjiSheet[i][4] = -1;
		orphan++;
		for(var j = 0; j < kanjiDb.length; j++) {
			if(kanjiDb[j].k == kanjiSheet[i][0]) {
				kanjiSheet[i][4] = j;
				orphan--;
				break;
			}
		}
		
	}
	console.log(kanjiSheet);
	console.log(orphan + '/' + kanjiSheet.length);
	
	prepareSession();
}

function startSession() {
	mergeDb();
	
	//nextCard();
}

getDbData();
getKanji();
//console.log(kanjiList);

var main = function () {
	//nextCard();
	 
	$('.show').on('click', function(){showAnswer();});
	$('.best').on('click', function(){evaluate('BEST');});
	$('.good').on('click', function(){evaluate('GOOD');});
	$('.neutral').on('click', function(){evaluate('NEUTRAL');});
	$('.bad').on('click', function(){evaluate('BAD');});
};

$(document).ready(main);
//nextCard();

