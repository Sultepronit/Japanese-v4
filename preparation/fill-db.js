console.log('Hello!');
/*
for(let i = 0; i < wordsDb.length; i++) {
    //if(i > 99) break;
    console.log(wordsDb[i].w);

    document.write(wordsDb[i].s + '||||');
    document.write(wordsDb[i].f + '||||');
    document.write(wordsDb[i].b + '||||');
    document.write(wordsDb[i].ff + '||||');
    document.write(wordsDb[i].bb + '||||');
    document.write(wordsDb[i].w + '||||');
    document.write(wordsDb[i].tsc + '||||');
    document.write(wordsDb[i].tsl + '||||');
    document.write(wordsDb[i].e + '||||');
    document.write('<br>');
}*/

for(let i = 0; i < wordsDb.length; i++) {
    //if(i > 99) break;
    //document.write( JSON.stringify(wordsDb[i].w) );
    //document.write( JSON.stringify(wordsDb[i].tsc) );
    
    //let json = JSON.stringify(wordsDb[i].w);
    let json = JSON.stringify(wordsDb[i].tsc);
    let re = json.replace('["','');
    re = re.replace('"]','');
    re = re.replace(/","/g,', ');
    document.write( re );
    document.write('<br>');
}
