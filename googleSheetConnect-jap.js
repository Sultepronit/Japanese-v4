let myApp = 'https://script.google.com/macros/s/AKfycbxdjsA65GpotgP1lTQ2hRcbt_JkxMnRWEo9K5wsrVKP-UfwxEiyoH_Lm4goQg9v-wxI/exec';

function getWordsDb () {
    let action = "getTasks";
    let url = myApp + "?action=" + action

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
			let wordsDb = JSON.parse(xhr.response);
			console.log(wordsDb.length);
			refactorDb(wordsDb);
			//console.log(wordsDb);
        }
    };
    try { xhr.send(); } catch (err) {console.log(err) }
}

function toCell(num, col, newValue)
{	
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
        	//$("#updateTaskModal").modal("hide");
        	//alert(xhr.response);
			//console.log('updated!');
        }

		if (xhr.readyState == 4) {
        	//$("#updateTaskModal").modal("hide");
        	//alert(xhr.response);
			console.log('updated!');
        }
    };
	try { xhr.send(body);} catch (err) { }
	//try { xhr.send(body);} catch (err) {console.log(err) }
	//console.log("Saved to sheet!");
}
