let kanjiSheet = [];
let wordsDb = [];
//let kanjiList = [];
let maxToRepeat = 0, nextRepeated = 0;
let kanjiToRepeat = [];
let kanjiWithMistakes = [];
let sessionList = [];

let currentCardId = 0;
let currentCard;
let cardStatus = '';

let progress = {
	showed: 0,
	withProblem: 0,
	plus: 0,
	minus: 0,
	repeated: 0,
	autoRepeated: 0
};

let resetButtonIsHidden = true;

function sendToCell(column, row0, value) {
	sendData('kanji', [[`${column}${row0 + 1}`, value]]);
}

function sendChanges(changes) {
	console.log(changes);
	const re = [];
	const row = changes.id + 1;

	/*console.log('not saved');
	return;*/

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
			progress.minus++;
			//toCell(currentCardId + 1, 'B', --currentCard[1]);
			changesToSend.progress = currentCard[1] - 1;
			//if(currentCard[3] > 0) toCell(currentCardId + 1, 'D', 0);
			if(currentCard[3] > 0) changesToSend.super = 0;
			break;
		}

		progress.plus++;
		if(mark === "BEST" && currentCard[1] == 0) {
			progress.repeated++;
			changesToSend.upgrade = true;
			changesToSend.super = 2;
		} else { // GOOD
			currentCard[1]++;
			if(currentCard[1] > 1) {
				progress.repeated++;
				changesToSend.upgrade = true;
				currentCard[1] = 0;
			} else if(currentCard[1] < -1) {
				currentCard[1] = -1;
			}
			changesToSend.progress = currentCard[1];
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

	// if it is continuation of aborted session
	if(!resetButtonIsHidden) {
		$('.reset').hide();
		resetButtonIsHidden = true;
	}
}

function showQuestion() {
	progress.showed++;
	$('.evaluation').hide();
	$('.show').show();
	
	$('.kanji').empty();
	$('.word-list').empty();
	$('.card-info').empty();
	$('.stats').empty();

	$('.kanji').append(currentCard[0]);
	
	var stats = progress.showed + '<i> ' + progress.withProblem + '</i> ';
	stats += progress.plus + '-' + progress.minus;
	stats += '<b> ' + progress.repeated + '<sup>' + progress.autoRepeated + '</sup></b>';
	$('.stats').append(stats);
}

function nextCard() {
	console.log('next!');
	localStorage.setItem('nextRepeated', nextRepeated);
	localStorage.setItem('progress', JSON.stringify(progress));
	localStorage.setItem('sessionList', JSON.stringify(sessionList));

	cardStatus = deleteRandomFromArray(sessionList);
	console.log(sessionList);
	console.log(cardStatus);
	
	while(true) {
		if(cardStatus === "PROBLEM") {
			currentCardId = deleteRandomFromArray(kanjiWithMistakes);
			localStorage.setItem('kanjiWithMistakes', JSON.stringify(kanjiWithMistakes));
			progress.withProblem++;
		} else { // REPEAT
			currentCardId = deleteRandomFromArray(kanjiToRepeat);	
			localStorage.setItem('kanjiToRepeat', JSON.stringify(kanjiToRepeat));
		}
		currentCard = kanjiSheet[currentCardId];
		console.log(currentCard);
		
		if(currentCard[3] > 1) {
			console.log('Auto Repeat!');
			progress.autoRepeated++;
			sendChanges({id: currentCardId, upgrade: true, super: 1});
			continue;
		}
		
		break;
	}
	
	showQuestion();
}

function main() {
 
	$('.show').on('click', function(){showAnswer();});
	$('.best').on('click', function(){evaluate('BEST');});
	$('.good').on('click', function(){evaluate('GOOD');});
	$('.neutral').on('click', function(){evaluate('NEUTRAL');});
	$('.bad').on('click', function(){evaluate('BAD');});
	$('.reset').on('click', () => {
		localStorage.clear();
		/*sessionList = [];
		getAllDb();*/
		location.reload();
	});
}
$(document).ready(main);
