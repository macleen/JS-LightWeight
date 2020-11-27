# LightWeight-JS

> Extensible LightWeight JS LIB whitout any xternal dependency

## Introduction

**LightWeight-JS** is a small sized javascript library with components and functions that are most useful in many projects and other libraries, noticeably the storage functionality and the pipelining pattern which remains **reusable** through out the whole application. You can create pipelines consisting of one or more stages using **different payloads** passed from one stage to the next in the order you pre-select.


## Components

   -  Helpers ; 
     Some helpers, those which are believed to be most needed in applications are redesigned or created 

   -  A handy client-side storage engine; 
     (local and cross session) using the native Browser API (session and local storage API);
     2 MB to 10 MB size of data can be stored on the client machine depending on the browser;  
     for chrome: Web storage APIs (Local & Session ) remain fixed at 5 MB.

   - Async pipelining;
     Using promise chaining ( sequential function queue execution );
     Queue can be executed **forward(FIFO), backward(LIFO) or random**;    
     very usefull in currying/function composition; 
     could also be coupled to any async API such as ajax or the fetch API;

---------------------------------------------------------

## helpers:

**type_of**
```javascript

    var l = lw( ); // create the main lib instance

    l.type_of([])        => 'array';
    l.type_of(object)    => 'object';
    l.type_of(promise)   => 'promise';
    l.type_of(primitive) => primitive type ['number', 'boolean', 'string', null, undefined]    
    l.type_of(function)  => function types ['function', 'asyncfunction','generatorfunction','constructorfunction']
```

**is_callable** & **is_pomise**
```javascript

    var l = lw( ); // create the main lib instance

    l.is_callable( f )   => boolean; 
    l.is_promise( p )    => boolean;// using type_of === 'promise'


```

**extend**
>Is inspired from jQuery extend function and using the same syntax


**clone**

```javascript

    var l = lw( ); // create the main lib instance
    l.clone( o )  => cloned_object; 

```

**random_number**

```javascript

    var l = lw( ); // create the main lib instance
    l.random_number( max_exclusive )  => // returns n included in [0..max_exclusive[

```

**random_array_element**

```javascript

    var l = lw( ); // create the main lib instance
    l.random_array_element( arr )  => random_arr_element;

```

**shuffle_array**

```javascript

    var l = lw( ); // create the main lib instance
    l.shuffle_array( arr )  => shuffled_array; 

```

---------------------------------------------------------

## Storage Usage:


```javascript

    var l = lw( ); // create the main lib instance

    //return values: 
    //      - session: for cross session storage
    //      - permanent: for local storage
    var engines = l.available_storage_engines( );

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

```
---------------------------------------------------------

## Async delay usage: 
**( to be used mainly with the async pipes)**

```javascript

    var wait = l.async_delay( milli_seonds ); // returns a closure with milli_seconds as param
    
    // task can be an object, a function or any other data type
    //return values: 
    //      - returns a closure with milli_seconds as variable
    //      - a function: with an object that it will use in the resolve process once finished
    var delayed_task = wait( task ); 

```     

---------------------------------------------------------

## Pipeline usage: ( async pipes ) 

```javascript
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

```



> Please run the index.html on your browser to see an example with a simple animation demo
or go to this link: https://tradingunited.org/test/

---------------------------------------------------------
 >Author: C. Mahmoud / MacLeen 2020 v 1.0.0 / email: **acutclub@gmail.com**
 
 
 for bugs or info please contact me on my email.
