const urlBase = 'https://script.google.com/macros/s/AKfycbxSifZzh0G8Y95_mSfnLsErqS8RUrx73IgJmQvl1Oq81e08p_YeSKDrvoWo_MvljP0sBw/exec';

async function getData(sheet, firstCol, lastCol) {
    const url = `${urlBase}?sheet=${sheet}&firstCol=${firstCol}&lastCol=${lastCol}`;
	try {
		const resp = await fetch(url);
		const array = await resp.json();
		console.log(sheet + ': ' + array.length);
		//console.log(array);
		return array;
	} catch(err) {
		//alert(err);
		console.log(err);
	}
}
//getData('db', 'G', 'G');

async function sendData(sheet, data) {
	console.log('saving...');
	//const data = [['Z3','!'], ['Z4','?']];
	//const sheet = 'ksel';
	const url = `${urlBase}?sheet=${sheet}`;
	const parameters = {
		method: 'POST',
		//headers: { Accept: 'application/x-www-form-urlencoded' },
		headers: { Accept: 'application/json' },
		body: JSON.stringify(data)
	}

	try {
		const resp = await fetch(url, parameters);
		//console.log(resp);
		const val = await resp.json();
		//const val = await resp.text();
		if('length' in val) { // expected response
			for(let i = 0; i < val.length; i++) {
				console.log(val[i]);
			}
		} else { // error on server
			console.log(val);
			alert('Error on server!');
		}
		
	} catch(err) {
		console.log(err);
	}
}