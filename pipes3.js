function activateBtnHandler( ) {
    var btn = document.querySelector('#startDemo');
    btn.addEventListener('click', function(){
        startScript( );
    });
}

var resultLeftSpan = document.querySelector("#result-left");
var resultRightSpan = document.querySelector("#result-right");
var resultRandomSpan = document.querySelector("#result-random");

var l = lw( ); // create the main lib instance



var add1   = x => x + 1;
var add2   = x => x + 2;
var add10  = x => x + 10;
var times2 = x => x * 10;
var minus5 = x => x - 5;

var pipeLeft = l.pipe( add2, add10, times2, minus5 ).fifo( ); // from left to right, this is the default

pipeLeft.inject( add1, 'top' );  // add one more later -- where: 'top' or 'botom / top is default

var pipeRight  = l.pipe( add1, add2, add10, times2, minus5 ).lifo( );// right to left
var pipeRandom = l.pipe( add1, add2, add10, times2, minus5 ).random( ); // random exec


function startScript( ){
    var resultLeft = pipeLeft.exec( 10 );
    var resultRight = pipeRight.exec( 10 );
    var resultRandom = pipeRandom.exec( 10 );

    resultLeft.then(function( res ) { resultLeftSpan.innerText = res; console.log( '+result from: ', res )});
    resultRight.then(function( res ) { resultRightSpan.innerText = res; console.log( '+result from : ', res )});
    resultRandom.then(function( res ) { resultRandomSpan.innerText = res; console.log( '+result from : ', res )});
}    

activateBtnHandler( );