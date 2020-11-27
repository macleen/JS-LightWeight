function clear_result_spans( ) {
    var res = document.querySelectorAll(".result-span");
    for ( var i =0, l = res.length; i<l; i++ )
          res[i].innerText = '....'; 
    result_counter = 0;     
};

function clear_log( ) {
    var log = document.querySelector("#log");
    log.value = '';
};


function write_result( line ) {
    var res = document.querySelector("#result"+result_counter);
    res.innerText = line;    
    result_counter++;
};

function write_log( line ) {
    var log = document.querySelector("#log");
    log.value = log.value + line + "\n";    
};


function activateBtnHandler( ) {
    var btn = document.querySelector('#startDemo');
    btn.addEventListener('click', function(){
        startScript( );
    });
}


function asyncCall( o ) {
    var t = ( Math.random( ) * 4 ) * 1000; 
    let func_id = call_id;
    call_id++;
    write_log( 'Async call running -- Call_id: '+func_id );
    return new Promise( function( resolve ) {
        setTimeout(function( ) {
            write_log( 'Async call (id: '+func_id+') returned with results -- waited: '+(t/1000).toFixed(2)+' sec' );
            resolve( o+'-return-data-'+func_id+'['+Math.random( )+']***');
        }, t );
    })
}

function getAsyncData( dataName, guestParams ) {

    guestParams = guestParams ? ' -- '+guestParams : '';
    var passed = dataName + guestParams;
    write_result( passed );
    return asyncCall( passed );

}

function closurize( f, ...params ){
    write_log( 'function converted to closure with params: ' + params );
    return function( x ) {
        return f(params, x);
    }
}

//****************************************** */

function startScript( ){
    
    clear_log( );
    clear_result_spans( );
    call_id = 1;
    var p1 = closurize(getAsyncData, 'serverFile1' );
    var p2 = closurize(getAsyncData, 'serverFile2' );
    var p3 = closurize(getAsyncData, 'serverFile3' );
    var p4 = closurize(getAsyncData, 'serverFile4' );

    var pipe = l.pipe(p1,p2,p3,p4).fifo().exec().then(console.log);

   

}


//****************************************** */
var l = lw( );
var result_counter, call_id;
activateBtnHandler( );

