'use strict';

function prepareSessionList() {	

    function fillTheList(n, item) {
		for(let i = 0; i < n; i++) sessionList.push(item);
	}
	// kanji
	numberToLearnKanji = learnListKanji.length;
	fillTheList(numberToLearnKanji, "KANJI_LEARN");
	
	fillTheList(numbertoRepeatKanji, "KANJI_REPEAT");

	// words
	numberToRecognize = Math.round(recognizeList.length / 2);
	fillTheList(numberToRecognize, 'RECOGNIZE');
	
	numberWithProblem = Math.round(problemList.length / 3);
	fillTheList(numberWithProblem, "PROBLEM");
	
	//numberToRepeat = sessionLength - sessionList.length;
    fillTheList(numberToRepeat, "REPEAT");

	sessionLength = sessionList.length;
    console.log(sessionList);
    //console.log(numberToRepeat);
    nextCard();
}

function parseWordsDb(crudeDb) {
	// numbers
    //sessionLength = crudeDb[10][16];
	numberToRepeat = crudeDb[10][16];
    maxToRepeat = crudeDb[12][16];
    nextRepeated = crudeDb[14][16];
	let ignoredWords = crudeDb[5][16];
	console.log(maxToRepeat + ' / ' + nextRepeated);

	// db as array of objects
    for(let a of crudeDb) {
        //console.log(a);
		if(isNaN(a[0])) break;
        let card = {
			a: a[0],
            s: a[4],
            f: a[5],
            b: a[6],
            ff: a[7],
			bb: a[8],
			w: a[9].split(', '),
			tsc: a[10].split(', '),
            tsl: a[11],
            e: a[12]
        };
        //console.log(card);
        wordsDb.push(card);
    }
	//console.log(wordsDb);
    console.log(wordsDb.length);

	// lists
	for(let index = 0; index < wordsDb.length; index++) {
		if(wordsDb[index].a < ignoredWords) continue;

		if(wordsDb[index].s > maxToRepeat) {
			if(wordsDb[index].ff <= 0) {
				recognizeList.push(index);
			}
			continue;
		}

		if(wordsDb[index].f < 0 || wordsDb[index].b < 0) {
			problemList.push(index);
			continue;
		}

		repeatList.push(index);
	}

	if(repeatList.length > 500) {
		repeatList = repeatList.slice(repeatList.length - 500);
	}
    console.log('recognize:');
    console.log(recognizeList);
    console.log('problem:');
    console.log(problemList);
    console.log('repeat:');
    console.log(repeatList);

	// now, we ready to go 
	//prepareSessionLists();
	dBcounter++;
}

function parseKselDb(crudeDb) {
	// numbers
	numbertoRepeatKanji = crudeDb[1][13];
    maxToRepeatKanji = crudeDb[3][13];
    nextRepeatedKanji = crudeDb[5][13];
	console.log(maxToRepeatKanji + ' / ' + nextRepeatedKanji);

	// db as array of objects
	for(let a of crudeDb) {
        //console.log(a);
		if(isNaN(a[0])) break;

        let card = {
			s: a[0],
            f: a[1],
            b: a[2],
            ff: a[3],
			bb: a[4],
			k: a[5],
			n: a[6],
            d: a[7],
			r: a[8],
			c: a[9],
			j: a[10],
			ky: a[11]
        };
        //console.log(card);
        kanjiDb.push(card);
    }
	//console.log(kanjiDb);
    console.log(kanjiDb.length);

	// lists
	for(let index = 0; index < kanjiDb.length; index++) {
		if(kanjiDb[index].s > maxToRepeatKanji) continue;

		if(kanjiDb[index].s > 0) {
			repeatListKanji.push(index);
			continue;
		}
		if(kanjiDb[index].s == 0) {
			learnListKanji.push(index);
			continue;
		}
	}
	console.log('learn:');
    console.log(learnListKanji);
	console.log('repeat:');
    console.log(repeatListKanji);

	// now, we ready to go 
	dBcounter++;
}

let dBcounter = 0;
function waitForDb() {
	setTimeout(function(){
		console.log('loading...');
		if(dBcounter > 1) {
			console.log('db loaded!');
			prepareSessionList();
		} else {
			waitForDb();
		}
	}, 300);
}

getData(wordsUrl, parseWordsDb);
getData(kselUrl, parseKselDb);
waitForDb();

