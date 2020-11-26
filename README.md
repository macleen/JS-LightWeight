lw: Extensible LightWeight JS LIB 
     containing a handy storage engine 
     (local and cross session) using the native Browser API (session and local storage API)
     2 MB to 10 MB size of data can be stored on the client machine depending on the browser  
     for chrome: Web storage APIs (LocalStorage & SessionStorage ) remain fixed at 5 MB.


 Async pipelining: Using promise chaining ( sequential function queue execution )
                   Queue can be executed forward(FIFO), backward(LIFO) or random    
                   very usefull in currying/function composition, 
                   could also be coupled to any async API such as ajax or the fetch API



---------------------------------------------------------

Storage Usage:


    var l = lw( ); // create the main lib instance


    var engines = l.available_storage_engines( );
    //return values: 
    //      - session: for cross session storage
    //      - permanent: for local storage


    var storage = l.offline_storage( bool ) // true for session storage, false: localstorage

    //save name in storage: 
    storage.name ="value";

    //save json object in storage: 
    storage.settings = JSON.stringify({color:'black', user_name:'tester', last_login:'1654874521})";

    //get name from storage: 
    var name = storage.name;

    //get then convert saved setting from storage: 
    var settings = JSON.parse(storage.settings);    

    //get used storage type: 
    var type = storage.__engine_type__;  // __engine_type__ is a reserved word, can not be set or deleted


    //delete name from storage: 
    delete storage.name;

    //clear all storage: 
    delete storage.all;

---------------------------------------------------------

Async delay usage: ( to be used mainly with the async pipes)

    var wait = l.async_delay( milli_seonds ); // returns a closure with milli_seconds as param
    var delayed_task = wait( task ); // task can be an object, a function or any other data type
     
    //return values: 
    //      - returns a closure with milli_seconds as variable
    //      - a function: with an object that it will use in the resolve process once finished
     
    

---------------------------------------------------------

function Pipelining usage: ( async pipes ) 

var l = lw( ); // create the main lib instance

var add1   = function ( x ) { return x + 1;}
var add2   = function ( x ) { return x + 2;}
var add10  = function ( x ) { return x + 10;}
var times2 = function ( x ) { return x * 10;}
var minus5 = function ( x ) { return x - 5;}

var pipeLeft = l.pipe( add2, add10, times2, minus5 ).fifo( ); // from left to right, this is the default

pipeLeft.inject( add1, 'top' );  // add one more later -- where: 'top' or 'botom / top is default

var pipeRight  = l.pipe( add1, add2, add10, times2, minus5 ).lifo( );// right to left
var pipeRandom = l.pipe( add1, add2, add10, times2, minus5 ).random( ); // random exec

var resultLeft = pipeLeft.exec( 10 );
var resultRight = pipeRight.exec( 10 );
var resultRandom = pipeRandom.exec( 10 );

resultLeft.then(function( res ) { console.log( 'result from '+pipeLeft.stack+': ', res )});
resultRight.then(function( res ) { console.log( 'result from '+pipeRight.stack+': ', res )});
resultRandom.then(function( res ) { console.log( 'result from '+pipeRandom.stack+': ', res )});





Please run the index.html on your browser to see an example with a simple animation demo


---------------------------------------------------------
 Author: C. Mahmoud / MacLeen 2020 v 1.0.0 / email: acutclub@gmail.com
 
 
 for bugs or info please contact me on my email.
