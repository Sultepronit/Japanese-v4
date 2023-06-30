'use strict';

function prepareSession() {
	localStorage.setItem('kanjiSheet', JSON.stringify(kanjiSheet));
	localStorage.setItem('wordsDb', JSON.stringify(wordsDb));
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
	localStorage.setItem('kanjiToRepeat', JSON.stringify(kanjiToRepeat));
	localStorage.setItem('kanjiWithMistakes', JSON.stringify(kanjiWithMistakes));
	
	var numberWithMistakes = Math.round(kanjiWithMistakes.length / 2);
	//console.log(numberWithMistakes);
	
	var index = 0;
	for(;index < numberWithMistakes; index++) sessionList.push('PROBLEM');
	for(;index < 50; index++) sessionList.push('REPEAT');
	
	console.log(sessionList);
	
	nextCard();
}

function mergeDb(ksel, kanjiList) {
	let orphan = 0;
	for(let i = 0; i < kanjiList.length; i++) {
		
		// if there are new kanji
		if(i >= kanjiSheet.length) { 
			kanjiSheet.push([kanjiList[i], 0, 0, 0]);
			sendToCell('A', i, kanjiList[i]);
		}
		
		// if kanji order changed
		if(kanjiList[i] != kanjiSheet[i][0]) { 
			if(kanjiSheet[i][0] == '') {
				kanjiSheet[i][0] = kanjiList[i];
				sendToCell('A', i, kanjiList[i]);
			} else {
				console.log(kanjiList[i] + ':' + kanjiSheet[i][0]);
				document.write(kanjiList[i] + ': (' + kanjiSheet[i][0] + ') ');
			}	
		}
		
		// find kanji indices
		kanjiSheet[i][4] = -1;
		for(let j = 0; j <= ksel.length; j++) {
            if(j === ksel.lengh || !ksel[j][0]) {
                orphan++;
                break;
            }
			if(ksel[j][0] == kanjiSheet[i][0]) {
				kanjiSheet[i][4] = j;
				break;
			}
		}
		
	}
	console.log(kanjiSheet);
	console.log(orphan + '/' + kanjiSheet.length);
	
	prepareSession();
}

function getKanjiFromWords() {
    const kanjiSet = new Set();
	const kanjiList = [];
    
    for(let word of wordsDb) {
        //console.log(word);
        const kanjiFromWord = processWritings(word).mainKanji;
    
        for(let kanji of kanjiFromWord) {
            if(kanjiSet.has(kanji)) continue;
            
            kanjiSet.add(kanji);
			kanjiList.push(kanji);
        }
    }
    console.log(kanjiList);

	const wordsProcessed = new Promise(res => {
		res(kanjiList);
	});
	return wordsProcessed;
	//return kanjiList;
}

function parseWordsDb(crudeDb) {
    for(let a of crudeDb) {
		//if(isNaN(a[0])) break;
		if(!(a[0] && a[1] && a[2]))  break;
        let card = {
			w: a[0].split(', '),
			tsc: a[1].split(', '),
            tsl: a[2],
        };
        wordsDb.push(card);
    }
    console.log('words: ' + wordsDb.length);

    return getKanjiFromWords();
}


function getAllDb() {
    const kanjiPromise = getData('kanji', 'A', 'F');
    const wordsPromise  = getData('jap', 'J', 'L');
    const kselPromise = getData('ksel', 'F', 'F');
    
    Promise.all([kanjiPromise, wordsPromise, kselPromise]).then( values => {
        kanjiSheet = values[0];
		const ksel = values[2];
        parseWordsDb(values[1]).then( kanjiList => {
			mergeDb(ksel, kanjiList);
		});
    });
   
    
}
//getAllDb();

function restoreSession() {
	let json = localStorage.getItem('sessionList');
	const sl = JSON.parse(json);
	//console.log(sl);
	if(json && sl.length > 0) { // there is saved session
		sessionList = sl;
		json = localStorage.getItem('kanjiSheet');
		kanjiSheet = JSON.parse(json);
		json = localStorage.getItem('wordsDb');
		wordsDb = JSON.parse(json);
		json = localStorage.getItem('kanjiToRepeat');
		kanjiToRepeat = JSON.parse(json);
		json = localStorage.getItem('kanjiWithMistakes');
		kanjiWithMistakes = JSON.parse(json);
		json = localStorage.getItem('progress');
		progress = JSON.parse(json);
		nextRepeated = localStorage.getItem('nextRepeated');

		$('.reset').show();
		resetButtonIsHidden = false;
		nextCard();
	} else { // start new one
		getAllDb();
	}
}
//localStorage.clear();
restoreSession();

