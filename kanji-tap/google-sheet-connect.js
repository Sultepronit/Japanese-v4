const urlBase = 'https://script.google.com/macros/s/AKfycbxN69cAIaZWHrrhjHKrs5XO5ZlXpAd63F0rpFqM503OYYqIwC-8jWg2mq_sB1Vn_sSjAw/exec';

async function getData(sheet, firstCol, lastCol) {
    const url = `${urlBase}?sheet=${sheet}&firstCol=${firstCol}&lastCol=${lastCol}`;
	try {
		const resp = await fetch(url);
		const array = await resp.json();
		console.log(sheet + ': ' + array.length);
		console.log(array);
		return array;
	} catch(err) {
		//alert(err);
		console.log(err);
	}
}
//getData('db', 'G', 'G');

async function getData0(urlBase, parseDb) {
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
//sendToCell2(kanji5, 0, 'Z', 'Hello!');