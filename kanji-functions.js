'use strict';

function sendDownGif(resource, code, kanji) {
	let message = 'gg?re=' + resource + '&code=' + code + '&kanji=' + kanji;
	//console.log(message);
	//contactServer(message);
	let src = 'http://localhost:5050/' + message;
	console.log(src);
	$.getScript(src, function(){
		//console.log("Success!");
	}).fail(function () {
		alert("No connection!");
		//console.log("No connection!");
	});
}

function getGif(kanji) {
	let source = '../collection/1' + kanji + '.gif';
	let $new_image = $('<img>');
	$new_image.attr('src', source);
	
	let errorCount = 0;
	let request = ['',''];
	$new_image.on('error', function() {
		switch(++errorCount) {
			case 1:
				let code = kanji.charCodeAt(0).toString(16).toUpperCase(); 
				source = "http://www.yosida.com/images/kanji/" + code + ".gif"; 
				request = ['yo', code];
				break;
			case 2:
				source = 'https://kanji.quus.net/images/d'+ quus[kanji] + '.gif';
				request = ['qu', quus[kanji]];
				break;
			default:
				console.log("img error!!!");
				return;
		}
		$new_image.attr('src', source);
	});
	
	$new_image.on('load', function() {
		if(errorCount) sendDownGif(request[0], request[1], kanji);
	});
	
	return $new_image;
}

function findKanjiInWords(kanji) {
	let wordList = [];
	let additionalWordList = [];
	for(let i = 0; i < wordsDb.length; i++) {
		let writings = processWritings(wordsDb[i]);
		
		let mainKanji = writings.mainKanji;
		if(mainKanji.has(kanji)) {
			/*let head = writings.allWritings + ' : ';
			let tail = writings.kana;
			tail += ' — ' + wordsDb[i].tsl;
			wordList.push({head: head, tail: tail, index: i});*/
			let line = '<p><span class="word-head">' + writings.allWritings + ' : </span>';
			line += writings.kana;
			line += ' — ' + wordsDb[i].tsl + '</p>';
			wordList.push({line: line, index: i});
			
			continue;
		}
		
		let additionalKanji = writings.additionalKanji;
		if(additionalKanji.has(kanji)) {
			/*let head = writings.allWritings + ' : ';
			let tail = writings.kana;
			tail += ' — ' + wordsDb[i].tsl;
			additionalWordList.push({head: head, tail: tail, add: true, index: i});*/
			let line = '<p class="additional">';
			line += '<span class="word-head">' + writings.allWritings + ' : </span>';
			line += writings.kana;
			line += ' — ' + wordsDb[i].tsl + '</p>';
			additionalWordList.push({line: line, index: i});
		}
	}
	//console.log(wordList);
	
	if(wordList.length > 4) {
		let rn = randomFromRange(0, wordList.length - 1);
		console.log("Slice! " + rn);
		if(rn) {
			let rest = wordList.slice(0, rn);
			let randomStart = wordList.slice(rn);
			
			return randomStart.concat(rest, additionalWordList);
		}
	}
	
	return wordList.concat(additionalWordList);
}

function showWordList(wordList, question) {
	if(wordList.length < 2) {
		//$('.single').append(formWordP(wordList[0], answer));
		$('.single').append(wordList[0].line);
	} else {
		for(let i = 0; i < wordList.length; i++) {
			if(i % 2) { 
				$('.right-half').append(wordList[i].line);
			} else {
				$('.left-half').append(wordList[i].line);
			}
			
		}
	}
	/*if(answer) {
		$('.word-head').show();
	} else {
		$('.word-head').hide();
	}*/
	if(question) $('.word-head').hide();
}
