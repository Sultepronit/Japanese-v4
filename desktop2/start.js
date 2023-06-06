'use strict';

function prepareSessionLists() {	
	for(let index = 0; index < wordsDb.length; index++) {
		if(!wordsDb[index]) continue;

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

    function fillTheList(n, item) {
		for(let i = 0; i < n; i++) sessionList.push(item);
	}
	numberToRecognize = Math.round(recognizeList.length / 2);
	fillTheList(numberToRecognize, 'RECOGNIZE');
	
	numberWithProblem = Math.round(problemList.length / 3);
	fillTheList(numberWithProblem, "PROBLEM");
	
	numberToRepeat = sessionLength - sessionList.length;
    fillTheList(numberToRepeat, "REPEAT");

    console.log(sessionList);
    //console.log(numberToRepeat);
    nextCard();
}

function parseWordsDb(crudeDb) {
    sessionLength = crudeDb[10][16];
    maxToRepeat = crudeDb[12][16];
    nextRepeated = crudeDb[14][16];
	let ignored = crudeDb[5][16];
	console.log(maxToRepeat + ' / ' + nextRepeated);

	//let i = 0;
    for(let a of crudeDb) {
		if(a[0] < ignored) {
			wordsDb.push(null);
			continue;
		}
		//i++;
        //console.log(a);
		if(isNaN(a[0])) break;
		//console.log(i + ': ' + a[0]);
        let card = {
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
	dBcounter++;
    //prepareSessionLists();
}

function parseKselDb(crudeDb) {
	//console.log(crudeDb);
	for(let a of crudeDb) {
		/*if(a[0] < ignored) {
			wordsDb.push(null);
			continue;
		}*/

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
	dBcounter++;
}

const wordsUrl = 'https://script.google.com/macros/s/AKfycbxdjsA65GpotgP1lTQ2hRcbt_JkxMnRWEo9K5wsrVKP-UfwxEiyoH_Lm4goQg9v-wxI/exec';
const kselUrl = 'https://script.google.com/macros/s/AKfycbyTsUHyX3LteZXSXYuadFVGUEy95zEdnb6TKz6U7hwSznYQ_5plS71IPmJPZtWVsmVX/exec';

let dBcounter = 0;
function waitForDb() {
	setTimeout(function(){
		console.log('loading...');
		if(dBcounter > 1) {
			console.log('db loaded!');
			prepareSessionLists();
		} else {
			waitForDb();
		}
	}, 300);
}

getData(wordsUrl, parseWordsDb);
getData(kselUrl, parseKselDb);
waitForDb();

