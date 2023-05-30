"use strict";

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
	re += ' | wr-' + numberToRepeat + '/' + numberWithProblem + ': ';
	re += wordRepeatPlus + '<sup>' + wordRepeatPlusAuto + '</sup>';
	re += '-' + wordRepeatMinus + '<b> ' + wordRepeated;
	re += '<sup>' + wordRepeatedAuto + '</sup>-' + wordReturned + '</b>';
	re+= ' | <span class="blue">[' + numberToRecognize + '] <b>';
	re += wordSuperPlus + '-' + wordSuperMinus + '</b></span>';
	
	$('.stats').append(re);
}

function clearList() {
	$('.single').empty();
	$('.right-half').empty();
	$('.left-half').empty();
}

function nextCard() {
	showStats();

	clearList();
	
	if(sessionList.length < 1) {
		$('.word').empty().append('Happy End!');
		return;
	}
	let cardStatus = deleteRandomFromArray(sessionList);
	console.log(cardStatus);
	//console.log(sessionList);
	
	if(cardStatus === 'RECOGNIZE') {
		nextRecognition();
		return;
	}
	wordStatus = cardStatus;
	nextWord();
}

function prepareSessionLists() {	
	for(let index = 0; index < wordsDb.length; index++) {
		if(wordsDb[index].s > maxToRepeat) {
			if(wordsDb[index].ff <= 0) {
				recognizeList.push(index);
			}
			continue;
		}
		if(wordsDb[index].s > 1) {
			if(wordsDb[index].f < 0 || wordsDb[index].b < 0) {
				problemList.push(index);
				continue;
			}
			repeatList.push(index);
			continue;
		}
		if(wordsDb[index].s == 1) {
			confirmList.push(index);
			continue;
		}
		if(wordsDb[index].s == 0) {
			learnList.push(index);
			continue;
		}
	}
    console.log('recognize:');
    console.log(recognizeList);
    console.log('problem:');
    console.log(problemList);
    console.log('repeat:');
    console.log(repeatList);
    console.log('confrim:');
    console.log(confirmList);
    console.log('learn:');
    console.log(learnList);

    function fillTheList(n, item) {
		for(let i = 0; i < n; i++) sessionList.push(item);
	}
	/*numberToRecognize = Math.round(recognizeList.length / 5);
	fillTheList(numberToRecognize, 'RECOGNIZE');*/
	
	numberToLearn = learnList.length - 2;
	fillTheList(numberToLearn, "LEARN");
	
	numberToConfirm = Math.round(confirmList.length / confirmDivider);
	fillTheList(numberToConfirm, "CONFIRM");
	
	numberWithProblem = Math.round(problemList.length / 3);
	fillTheList(numberWithProblem, "PROBLEM");
	
	numberToRepeat = sessionLength - sessionList.length;
	let minToRepeat = Math.round(numberToConfirm * 1.2);
	if(numberToRepeat < minToRepeat) numberToRepeat = minToRepeat;
    fillTheList(numberToRepeat, "REPEAT");
    console.log(sessionList);
    //console.log(numberToRepeat);

    nextCard();
}

function refactorDb(crudeDb) {
    sessionLength = crudeDb[1][16];
    confirmDivider = crudeDb[3][16];
    maxToRepeat = crudeDb[5][16];
    nextRepeated = crudeDb[7][16];

    for(let a of crudeDb) {
        //console.log(a);
        let card = {
            s: a[0],
            f: a[1],
            b: a[2],
            ff: a[3],
            w: JSON.parse('[' + a[9] + ']'),
            tsc: JSON.parse('[' + a[10] + ']'),
            tsl: a[11],
            e: a[12]
        };
        //console.log(card);
        wordsDb.push(card);
    }
    console.log(wordsDb.length);
    prepareSessionLists();
}

getWordsDb();
//getWordsDb('main');

let main = function () {
	console.log("Document is ready!");
};
	
$(document).ready(main);