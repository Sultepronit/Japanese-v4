//const kanjiApp = 'https://script.google.com/macros/s/AKfycbyKW48irQn2p8iTaNdReTMyFU1_vQrlqABdvhmenoXpH7AeNeYK-u9KS9wfeDpJtgIR/exec';

function getKanjiDb () {
    var action = "getTasks";
    var url = kanjiApp + "?action=" + action

    //подготавливаем и выполняем GET запрос
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
        	//в случае успеха преобразуем полученный ответ в JSON и передаем отдельной функции, которая сформирует нам таблицу
			kanjiSheet = JSON.parse(xhr.response);
			console.log(kanjiSheet.length);

			startSession();
			//nextCard();
        }
    };
    try { xhr.send(); } catch (err) {console.log(err) }
}

function toCell(num, col, newValue)
{
	var action = "toCelll";
	var xhr = new XMLHttpRequest();
	var body = 'num=' + encodeURIComponent(num) + '&col=' + encodeURIComponent(col) +
	'&newValue=' + encodeURIComponent(newValue) + '&action=' + encodeURIComponent(action);
	xhr.open("POST", myApp, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
        	//$("#updateTaskModal").modal("hide");
        	alert(xhr.response);
        }
    };
	try { xhr.send(body);} catch (err) { }
	//try { xhr.send(body);} catch (err) {console.log(err) }
	//console.log("Saved to sheet!");
}

