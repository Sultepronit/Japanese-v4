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
	numberToRecognize = Math.round(recognizeList.length / 5);
	fillTheList(numberToRecognize, 'RECOGNIZE');
	
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

	let i = 0;
    for(let a of crudeDb) {
		i++;
        //console.log(a);
		if(isNaN(a[0])) break;
		//console.log(i + ': ' + a[0]);
        let card = {
            s: a[0],
            f: a[1],
            b: a[2],
            ff: a[3],
			//w: JSON.parse(a[9]),
			w: a[9].split(', '),
            //tsc: JSON.parse(a[10]),
			tsc: a[10].split(', '),
            tsl: a[11],
            e: a[12]
        };
        //console.log(card);
        wordsDb.push(card);
    }
	//console.log(wordsDb);
    console.log(wordsDb.length);
    prepareSessionLists();
}

getWordsDb();