const kanjiUrl = 'https://script.google.com/macros/s/AKfycbyKW48irQn2p8iTaNdReTMyFU1_vQrlqABdvhmenoXpH7AeNeYK-u9KS9wfeDpJtgIR/exec';
const wordsUrl = 'https://script.google.com/macros/s/AKfycbxdjsA65GpotgP1lTQ2hRcbt_JkxMnRWEo9K5wsrVKP-UfwxEiyoH_Lm4goQg9v-wxI/exec';
const kselUrl = 'https://script.google.com/macros/s/AKfycbyTsUHyX3LteZXSXYuadFVGUEy95zEdnb6TKz6U7hwSznYQ_5plS71IPmJPZtWVsmVX/exec';

const kanji2 = 'https://script.google.com/macros/s/AKfycbztiAiliTcW6FFps1JxyHj5PdWkwQAGSXnPGBmt24b2t6JDCBnjVfKlH8UcOOshCkYlHg/exec';

const kanji3 = 'https://script.google.com/macros/s/AKfycbwMFZT4JcQu_NvtSBqHfrMnTb2KdknVC2UDh3WZ7SzOjKcDDCc4izufsPuQOawgeGQN-Q/exec';

const kanji4 = 'https://script.google.com/macros/s/AKfycbzjW5t7O6M-_pT5LoCskAFJ4wmeIPE7B2yy08AdTlC-We3WA22fTD1xNMUTy4TKX9nObQ/exec';

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
	num++;
	const array = [['Z1','!'], ['Z2','?']];
	const sheet = 'db';
	//const url = `${urlBase}?num=${num}&col=${col}&newValue=${value}&action=toCell`;
	//const url = `${urlBase}?action=toCell`;
	const url = `${urlBase}?sheet=${sheet}&action=toCell`;
	const parameters = {
		method: 'POST',
		//mode: "no-cors",
		//headers: { Accept: 'application/x-www-form-urlencoded' },
		headers: { Accept: 'application/json' },
		//headers: { 'Content-Type': 'application/json' },
		//body: JSON.stringify({'Z1':'!', 'Z2':'?'})
		body: JSON.stringify(array)

	}

	try {
		const resp = await fetch(url, parameters);
		//console.log(resp);
		const val = await resp.json();
		//console.log(array);
		//const val = await resp.text();
		console.log(val);
	} catch(err) {
		//console.log(err);
	}
}
const kanji5 = 'https://script.google.com/macros/s/AKfycbxFwdE97y6AvnDryfuR4LDwgJLc3rp1Y-AAUj2B0h_delFs-gi0yI1b7edvAWhE9_lYMQ/exec';
const kanji6 = 'https://script.google.com/macros/s/AKfycbzFMqEYagKzRrC7cgfGO-yAdKqLaAdWCNDBf4LhYR7iS-ksKVhfnsNN0hoy2gskmYTlxQ/exec';
const kanji7 = 'https://script.google.com/macros/s/AKfycbzqdfsNZbwj6B8RY6ofJNkb35UBvXW5npMiv_pU0N8I3hLPh_iz8F-9aWKqvv4KL-1tZQ/exec';
const kanji8 = 'https://script.google.com/macros/s/AKfycbx5w7ThEWGM7OH7mjgW6XXVCri03R1UHw5A4OFDwchEkg9WNzvr5ZFOBAoBXUaIkT-h7A/exec';
const kanji9 = 'https://script.google.com/macros/s/AKfycbyTx_oJ3m8FNTsRmN4032rcdsd-fyUfpmVVWyenkFlS6hZjpu8T5HejMVaWaC4Mr2NJ5A/exec';
const kanji10 = 'https://script.google.com/macros/s/AKfycbzgHho4fo39DTjWpV-liUyPnpgQr8AgHcRYPx8zOezZvMa-aElI9kvQaftbRssenJvbYg/exec';
sendToCell2(kanji10, 0, 'Z', 'Hello!');