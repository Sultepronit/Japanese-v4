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

function sendToCell(column, row0, value) {
	sendData('kanji', [[`${column}${row0 + 1}`, value]]);
}

function sendChanges(changes) {
	console.log(changes);
	const re = [];
	const row = changes.id + 1;

	if('progress' in changes) {
		re.push([`B${row}`, changes.progress]);
	}
	if('super' in changes) {
		re.push([`D${row}`, changes.super]);
	}
	if(changes.upgrade) {
		re.push([`C${row}`, nextRepeated++]);
		re.push(['F2', nextRepeated]);
	}
	if(re.length > 0) {
		//console.log(re);
		sendData('kanji', re);
	}
	
}

function evaluate(mark) {
	console.log(mark);

	const changesToSend = { id: currentCardId };

	while(true) {
		if(mark === "NEUTRAL") break;

		if(mark === "BAD") {
			minus++;
			//toCell(currentCardId + 1, 'B', --currentCard[1]);
			changesToSend.progress = currentCard[1] - 1;
			//if(currentCard[3] > 0) toCell(currentCardId + 1, 'D', 0);
			if(currentCard[3] > 0) changesToSend.super = 0;
			break;
		}

		if(mark === "BEST" && currentCard[1] == 0) {
			repeated++;
			//upgradeCard();
			//toCell(currentCardId + 1, 'D', 2);
			//changesToSend.upgrade = nextRepeated;
			changesToSend.upgrade = true;
			changesToSend.super = 2;
		} else { // GOOD
			currentCard[1]++;
			
			if(currentCard[1] > 1) {
				repeated++;
				//upgradeCard();
				currentCard[1] = 0;
				//changesToSend.upgrade = nextRepeated;
				changesToSend.upgrade = true;
			} else if(currentCard[1] < -1) {
				currentCard[1] = -1;
			}
			changesToSend.progress = currentCard[1];
			//toCell(currentCardId + 1, 'B', currentCard[1]);
		}
		break;
	}
	//console.log(changesToSend);
	sendChanges(changesToSend);

	nextCard();
}

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
		/*if(cardStatus === 'REPEAT') {
			currentCardId = deleteRandomFromArray(kanjiToRepeat);
		} else { // PROBLEM
			currentCardId = deleteRandomFromArray(kanjiWithMistakes);
			withProblem++;
		}*/
		if(cardStatus === "PROBLEM") {
			currentCardId = deleteRandomFromArray(kanjiWithMistakes);
			withProblem++;
		} else { // REPEAT
			currentCardId = deleteRandomFromArray(kanjiToRepeat);
		}
		currentCard = kanjiSheet[currentCardId];
		console.log(currentCard);
		
		if(currentCard[3] > 1) {
			console.log('Auto Repeat!');
			autoRepeated++;
			/*toCell(currentCardId + 1, 'D', 1);
			upgradeCard();*/
			sendChanges({id: currentCardId, upgrade: true, super: 1});
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
