console.log('Start....');

const kanjiApp = 'https://script.google.com/macros/s/AKfycbyKW48irQn2p8iTaNdReTMyFU1_vQrlqABdvhmenoXpH7AeNeYK-u9KS9wfeDpJtgIR/exec';
let kanjiSheet = [];

let promise0 = new Promise(function(resolve) {
    let control = 0;
    function getData() {
        let action = "getTasks";
        let url = kanjiApp + "?action=" + action

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                kanjiSheet = JSON.parse(xhr.response);
                console.log(kanjiSheet.length);
                control++;
                //startSession();
                //nextCard();
            }
        };
        try { xhr.send(); } catch (err) {console.log(err) }
    }
    getData();
    if(control === 1) {
        resolve('done');
    } else {
        resolve('Nothing!!!');
    }

});

promise0.then(function(value){
    console.log(value);
});

async function getKanjiDbAsync() {
    let promise = new Promise(function(resolve){
        let action = "getTasks";
        let url = kanjiApp + "?action=" + action

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                kanjiSheet = JSON.parse(xhr.response);
                console.log(kanjiSheet.length);
                resolve('done');
                //startSession();
                //nextCard();
            }
        };
        try { xhr.send(); } catch (err) {console.log(err) }
    });
    console.log(await promise);
}
//getKanjiDbAsync();

async function getBothDb() {
    let promise = new Promise(function(resolve){
        getWordsDb();
        getKanjiDb();
        if(kanjiSheet.length > 10) {
            console.log('Here we go!');
            resolve('done');
        }
        
    });
    //console.log(await promise);
    document.getElementById("result").innerHTML = await promise;
}

//getBothDb();

//console.log('done!');