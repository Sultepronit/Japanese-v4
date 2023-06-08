'use strict';

function processWritings(card) {
	//console.log(card);
	let result = {
		mainWritings: [],
		allWritings: '',
		allKanji: new Set(),
		mainKanji: new Set(),
		additionalKanji: new Set(),
		kana: ''
	}
	//console.log("get: " + card.w);
	let writingsType = "normal";
	for(let i = 0; i < card.w.length; i++) {
		
		if(card.w[i] == '[') {
			writingsType = "rare";
			result.allWritings += "<span class='blue'>";
			continue;
		}
		if(card.w[i] == '(') {
			if(writingsType != "normal") result.allWritings += "</span>";
			writingsType = "shady";
			result.allWritings += "<span class='gray'>";
			continue;
		}
		
		//if(writingsType != "shady") result.mainWritings.push(card.w[i]);
		let mainWritting = ''; 
		let throwAway = false;
		for(let j = 0; j < card.w[i].length; j++) {
			if(card.w[i][j] == '[') {
				result.allWritings += "<span class='blue'>";
				continue;
			}
			if(card.w[i][j] == '{') {
				result.allWritings += "<span class='green'>";
				throwAway = (randomFromRange(0,1));
				continue;
			}
			if(card.w[i][j] == '(') {
				result.allWritings += "<span class='yellow'>";
				throwAway = true;
				continue;
			}
			if(card.w[i][j] == ']' || card.w[i][j] == '}' || card.w[i][j] == ')') {
				result.allWritings += "</span>";
				throwAway = false;
				continue;
			}
			
			result.allWritings += card.w[i][j];
			if(writingsType != "shady" && !throwAway) mainWritting += card.w[i][j];
			
			if(card.w[i][j] <= 'ー') continue;
			result.allKanji.add(card.w[i][j]);
			if(writingsType === "normal") {
				result.mainKanji.add(card.w[i][j]);
			} else {
				result.additionalKanji.add(card.w[i][j]);
			}
		}
		
		if(i + 1 < card.w.length) result.allWritings += "　";
		if(writingsType != "shady") result.mainWritings.push(mainWritting);
	}
	if(writingsType != "normal") result.allWritings += "</span>";
	
	for(let i = 0; i < card.tsc.length; i++) {
		result.kana += card.tsc[i];
		if(i + 1 >= card.tsc.length) continue;
		if(card.tsc[i] === '(') continue;
		//if(card.tsc[i + 1] === ')') continue;
		if(card.tsc[i + 1] === ')') {
			result.kana += ')';
			break;
		}
		result.kana += '　';
	}
	//console.log(result.kana + ']');
	if( randomFromRange(0,1) ) result.kana = wanakana.toKatakana(result.kana);
	
	return result;
}


let audio = new Audio();
function playAudio(n) {
	//if(muted) return;
	if(n >= currentWord.tsc.length) return;
	//console.log('pron v' + n);
	
	let src='http://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=';
	src += currentWord.tsc[n] + '&kanji=' + writings.mainWritings[0];
	audio.src = src;
	//console.log(src);
	
	audio.oncanplaythrough = function() {
		let duration = audio.duration;
		if(duration > 5) {
			console.log("duration: " + duration);
			console.log("No good sound!");
			console.log('pron v' + n);
			playAudio(++n);
		} else {
			audio.play();
			audio.onended = function() {
				//console.log("Ended!");
				playAudio(++n);
			}
		}
	}
}	

function insertGifs(kanjiSet) {
	kanjiSet.forEach(function(value) {
		//console.log(value);
		$('.gifs').append(getGif(value));
	});
}

function showWordListSingle(wordList) {
	for(let i = 0; i < wordList.length; i++) {
		$('.word-list').append(wordList[i].line);
	}
}

function prepareWordList(i) {
	clearList();
	let wl = findKanjiInWords(kanjiFromWord[i]);
	for(let j = 0; j < wl.length; j++) {
		if(wl[j].index == currentWordId) {
			wl.splice(j,1)
			break;
		}
	}
	return wl;
}

function showKanji(i) {
	console.log(kanjiFromWord[i]);
	$('#k' + i).show();
	let wl = prepareWordList(i);
	if(wl.length) showWordListSingle(wl);
}

function wordListToWord(i) {
	$(".control").text(kanjiFromWord[i]);
	let wl = prepareWordList(i);
	if(wl.length) showWordList(wl);
}