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
	numberToRecognize = Math.round(recognizeList.length / 5);
	fillTheList(numberToRecognize, 'RECOGNIZE');
	
	numberWithProblem = Math.round(problemList.length / 3);
	fillTheList(numberWithProblem, "PROBLEM");
	
	numberToRepeat = sessionLength - sessionList.length;
    fillTheList(numberToRepeat, "REPEAT");

    console.log(sessionList);
    //console.log(numberToRepeat);
    nextCard();
}

function refactorDb(crudeDb) {
    sessionLength = crudeDb[1][16];
    maxToRepeat = crudeDb[5][16];
    nextRepeated = crudeDb[7][16];
	let ignored = crudeDb[5][16];

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
	console.log(wordsDb);
    console.log(wordsDb.length);
    prepareSessionLists();
}

getWordsDb();