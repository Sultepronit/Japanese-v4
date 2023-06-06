console.log('Start....');

/*let kanjiSheet = [];
let wordsDb = [];*/
let kanjiSheet = null;
let wordsDb = null;

function refactorDb(db) {
    wordsDb = db;
}

getWordsDb();
getKanjiDb();

function waitForDb() {
    setTimeout(function(){
        //console.log(kanjiSheet);
        console.log('not yet.....');
        //if(kanjiSheet.length < 10 || wordsDb.length < 10) {
        /*if(!kanjiSheet || !wordsDb) {
            waitForDb();
        } else {
            console.log('done!');
        }*/
        if(kanjiSheet && wordsDb) {
            console.log('done!');
        } else {
            waitForDb();
        }
    }, 300);
}
waitForDb();


