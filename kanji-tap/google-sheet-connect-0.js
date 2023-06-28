const kanjiUrl = 'https://script.google.com/macros/s/AKfycbyKW48irQn2p8iTaNdReTMyFU1_vQrlqABdvhmenoXpH7AeNeYK-u9KS9wfeDpJtgIR/exec';
const wordsUrl = 'https://script.google.com/macros/s/AKfycbxdjsA65GpotgP1lTQ2hRcbt_JkxMnRWEo9K5wsrVKP-UfwxEiyoH_Lm4goQg9v-wxI/exec';
const kselUrl = 'https://script.google.com/macros/s/AKfycbyTsUHyX3LteZXSXYuadFVGUEy95zEdnb6TKz6U7hwSznYQ_5plS71IPmJPZtWVsmVX/exec';

const kanji2 = 'https://script.google.com/macros/s/AKfycbw9x8_yWpYy-oL8D4WyJE01kNyxLIh2JZ5glOlCK_WTwVGJuXH3yoEynYv6EYT7xLIq9g/exec';

async function getData2(urlBase) {
    const url = urlBase;
	const resp = await fetch(url);
	const array = await resp.json();
	console.log('Here we go: ' + array.length);
	console.log(array);
	//parseDb(array);
	//return array;
}
getData2(kanji2);
//getData2(kanjiUrl);

async function getData(urlBase, parseDb) {
    const url = urlBase + '?action=getTasks';
	const resp = await fetch(url);
	const array = await resp.json();
	console.log(array.length);
	//parseDb(array);
	return array;
}

async function sendToCell(urlBase, num, col, value) {
	num++;
	const url = `${urlBase}?num=${num}&col=${col}&newValue=${value}&action=toCelll`;
	const parameters = {
		method: 'POST',
		headers: { Accept: 'application/x-www-form-urlencoded' }
	}

	try {
		const response = await fetch(url, parameters);
		console.log(response);
	} catch(err) {
		//console.log(err);
	}
}
//sendToCell(kanjiUrl, 1, 'Z', 'Hello!');

async function sendToCell2(urlBase, num, col, value) {
	console.log('saving...');
	const array = [['Z3','!'], ['Z4','?']];
	const sheet = 'ksel';
	const url = `${urlBase}?sheet=${sheet}`;
	const parameters = {
		method: 'POST',
		//headers: { Accept: 'application/x-www-form-urlencoded' },
		headers: { Accept: 'application/json' },
		body: JSON.stringify(array)
	}

	try {
		const resp = await fetch(url, parameters);
		//console.log(resp);
		const val = await resp.json();
		//console.log(array);
		//const val = await resp.text();
		//console.log(val);
		for(let i = 0; i < val.length; i++) {
			console.log(val[i]);
		}
	} catch(err) {
		//console.log(err);
	}
}
const kanji5 = 'https://script.google.com/macros/s/AKfycbzO9pUq8lXb-7b1RIVbfMDCmv-tS3OuVqeua0GorqUqNEzFrB-WfQSSlrbMQ5EtEtsB/exec';
sendToCell2(kanji5, 0, 'Z', 'Hello!');
sendToCell2(kanji2, 0, 'Z', 'Hello!');