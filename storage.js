
var key_to_store = document.querySelector("#key_to_store");
var value_to_store = document.querySelector("#value_to_store");

var key_to_restore = document.querySelector("#key_to_restore");
var value_to_restore = document.querySelector("#value_to_restore");

var store_value_btn = document.querySelector("#store_value_btn");
var restore_value_btn = document.querySelector("#restore_value_btn");


function attach_event_listeners(  ) {
    store_value_btn.addEventListener("click", function(){
        if ( key_to_store.value ) {
             lw_storage[key_to_store.value]= value_to_store.value;
             key_to_store.value = '';
             value_to_store.value = '';
        }     
    });
    restore_value_btn.addEventListener("click", function(){
        if ( key_to_restore.value ) 
             value_to_restore.value = lw_storage[key_to_restore.value];
    });

  }



var l = lw( ); // create the main lib instance
var lw_storage = l.offline_storage( !!0 );
attach_event_listeners(  )
