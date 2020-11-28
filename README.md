# LightWeight-JS

> Extensible LightWeight JS LIB whitout any xternal dependency

## Introduction

**LightWeight-JS** is a small sized javascript library with components and functions that are most useful in many projects and other libraries, noticeably the storage functionality and the pipelining pattern which remains **reusable** through out the whole application. You can create pipelines consisting of one or more stages using **different payloads** passed from one stage to the next in the order you pre-select.


## Components

   -  **Helpers**\
     Some helpers, those which are believed to be most needed in applications are redesigned or created

   -  **Storage engine**\
     (local and cross session) using the native Browser API (session and local storage API)\
     2 MB to 10 MB size of data can be stored on the client machine depending on the browser\
     for chrome: Web storage APIs (Local & Session ) remain fixed at 5 MB

   - **Async pipelining**\
     Using promise chaining ( sequential function queue execution )\
     Queue can be executed **forward(FIFO), backward(LIFO) or random**\
     very usefull in currying, partial functions and function composition\
     could also be coupled to any async API such as ajax or the fetch API&nbsp;

---------------------------------------------------------

## helpers:

**type_of**
```javascript

    var l = lw( ); // create the main lib instance

    l.type_of([])        => 'array';
    l.type_of(object)    => 'object';
    l.type_of(promise)   => 'promise';
    l.type_of(primitive) => 'primitive type' ['number', 'boolean', 'string', null, undefined]    
    l.type_of(function)  => 'function types' ['function', 'asyncfunction','generatorfunction','constructorfunction']
```

**is_callable** & **is_promise**
```javascript

    var l = lw( ); // create the main lib instance

    l.is_callable( f )   => boolean; 
    l.is_promise( p )    => boolean;// using type_of === 'promise'


```

**extend**
>Is inspired from **jQuery** extend function and using the same syntax


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

## Available properties (Pipeline)

**queue**\
returns the current queue content.


**queue_size**\
returns the current queue size

**stack**\
returns the current queue processing method, lifo, fifo or random



## Available methods (Pipeline)

**fifo( )**\
Parameters: none\
Chainable: Yes\
Change stack order processing from top to bottom (First-In-First-Out)


**lifo( )**\
Parameters: none\
Chainable: Yes\
Change stack order processing from bottom to top (Lirst-In-First-Out)

**random( )**\
Parameters: none\
Chainable: Yes\
Change stack order processing to random

**inject( f, where )**\
Parameters: f: invocable [function], where: 'top' or 'bottom' [string]\
Chainable: Yes\
Once the queue is already set, use this function to add one element to the queue ( top or bottom)

**push( ...fA )**\
Parameters: fA: array of invocable [functions], or functions seperated by comma\
Chainable: Yes\
Add an unlimited number of elements to the bottom of the queue\
>** If you downloaded the animation example, before clicking the startdemo button try adding the following in the dev console to see how this function works
```javascript
T1 = function(){$article1.style.color = 'red'}
T2 = function(){$article2.style.color = 'red'}
T3 = function(){$article3.style.color = 'red'}
article_pipe.push(mac.async_delay(700),T1, mac.async_delay(700), T2, mac.async_delay(700), T3, mac.async_delay(700));
```

**unshift( ...fA )**\
Parameters: fA: array of invocable [functions], or functions seperated by comma\
Chainable: Yes\
Add an unlimited number of elements to the top of the queue
>** If you downloaded the animation example, before clicking the startdemo button try adding the following in the dev console to see how this function works
```javascript
T4 = function(){$article1.style.color = 'red'}
T5 = function(){$article2.style.color = 'red'}
T6 = function(){$article3.style.color = 'red'}
article_pipe.unshift(mac.async_delay(700),T4, mac.async_delay(700), T5, mac.async_delay(700), T6, mac.async_delay(700));
```


**exec( e )**\
Parameters: e: any, this is the main parameter that will be handed over from one stage to the next (if present)\
Chainable: No\
This is the function to be called last to run the functions in the queue\
returns: promise


--------------------------------------------------------------------------


## Examples

**[ 1 ]**

4 Async-calls are being made ( simulating server requests ), these calls are supposed to be interdependant\
**stage[4]->needs-->stage[3]->needs-->stage[2]->needs-->stage[1]->needs-->params** so the order of execution and result output are vital here.
you will see how each call waits for the the previous to return before running.
this example is included in the list above and here is a ready made demo of it\
check it out **https://tradingunited.org/tests/lwjs/concurrency.html**

**[ 2 ]**

A graphic demo shows the injection of the delay time between each call.
this example is included in the list above and here is a ready made demo of it\
check it out **https://tradingunited.org/tests/lwjs/animation.html**

**[ 3 ]**

A math demo showing the implementation of function composition.
this example is included in the list above and here is a ready made demo of it\
check it out **https://tradingunited.org/tests/lwjs/math.html**

---------------------------------------------------------
 >Author: C. Mahmoud / MacLeen 2020 v 1.0.0 / email: **acutclub@gmail.com**\
 >For bugs, suggestions or any other info please contact me on my email.
