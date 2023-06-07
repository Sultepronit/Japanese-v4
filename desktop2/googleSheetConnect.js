//let myApp = 'https://script.google.com/macros/s/AKfycbxdjsA65GpotgP1lTQ2hRcbt_JkxMnRWEo9K5wsrVKP-UfwxEiyoH_Lm4goQg9v-wxI/exec';
//const wordsUrl = 'https://script.google.com/macros/s/AKfycbxdjsA65GpotgP1lTQ2hRcbt_JkxMnRWEo9K5wsrVKP-UfwxEiyoH_Lm4goQg9v-wxI/exec';
//const kselUrl = 'https://script.google.com/macros/s/AKfycbyTsUHyX3LteZXSXYuadFVGUEy95zEdnb6TKz6U7hwSznYQ_5plS71IPmJPZtWVsmVX/exec';

function getData (myApp, parseDb) {
    let action = "getTasks";
    let url = myApp + "?action=" + action

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
			let array = JSON.parse(xhr.response);
			console.log(array.length);
			parseDb(array);
        }
    };
    try { xhr.send(); } catch (err) {console.log(err) }
}

function toCell(myApp, num, col, newValue) {	
	num++;
	console.log(col + num + ': ' + newValue);
	let action = "toCell";
	let xhr = new XMLHttpRequest();
	let body = 'num=' + encodeURIComponent(num) + '&col=' + encodeURIComponent(col) +
	'&newValue=' + encodeURIComponent(newValue) + '&action=' + encodeURIComponent(action);
	xhr.open("POST", myApp, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {

        }

		if (xhr.readyState == 4) {
			console.log('updated!');
        }
    };
	try { xhr.send(body);} catch (err) { }
}
