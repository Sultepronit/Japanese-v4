let kanjiSheet = [];
let wordsDb = [];
let kanjiList = [];
let maxToRepeat = 0, nextRepeated = 0;
const kanjiToRepeat = [];
const kanjiWithMistakes = [];
const sessionList = [];

let currentCardId = 0;
let currentCard;
let cardStatus = '';

let showed = 0, withProblem = 0;
let plus = 0, minus = 0;
let repeated = 0, autoRepeated = 0;

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

function main() {
 
	$('.show').on('click', function(){showAnswer();});
	$('.best').on('click', function(){evaluate('BEST');});
	$('.good').on('click', function(){evaluate('GOOD');});
	$('.neutral').on('click', function(){evaluate('NEUTRAL');});
	$('.bad').on('click', function(){evaluate('BAD');});
}
$(document).ready(main);
