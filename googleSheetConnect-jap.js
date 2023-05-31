var myApp = 'https://script.google.com/macros/s/AKfycbxdjsA65GpotgP1lTQ2hRcbt_JkxMnRWEo9K5wsrVKP-UfwxEiyoH_Lm4goQg9v-wxI/exec';

//function getWordsDb (next) {
	function getWordsDb () {
    var action = "getTasks";
    var url = myApp + "?action=" + action

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
			var wordsDb = JSON.parse(xhr.response);
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
	var action = "toCell";
	var xhr = new XMLHttpRequest();
	var body = 'num=' + encodeURIComponent(num) + '&col=' + encodeURIComponent(col) +
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
