/*
******************************************************************************************
* lw: Extendible LightWeight JS LIB 
*     containing a handy storage engine 
*     (local and cross session) using the Browser native (session and local storage API)
*     2 MB to 10 MB size of data can be stored on the client machine depending on the browser  
*     for chrome: Web storage APIs (LocalStorage & SessionStorage ) remain fixed at 5 MB.
*
* Async pipelining: Using promise chaining ( sequential function queue execution )
*                   Queue can be executed LIFO, FIFO or random    
*                   very usefull in currying/function composition, 
*                   could also be coupled to any async API such as ajax or the fetch API
*
* Licence: MIT / free to use and distribute
*
* Author: C. Mahmoud / MacLeen 2020 v 1.0.0 / email: acutclub@gmail.com
*
******************************************************************************************
*/
;(function(global, factory){
    'use strict';
    //*************************************************************
    var noBrowser = ( typeof module === "object" && typeof module.exports === "object" );
	factory( global, noBrowser );

// Pass this if window is not defined yet
})( typeof window !== "undefined" ? window : this, function( global, ServerSide ) {

    //*************************************************************
    var version = "1.0.0 - macLeen 2020";
    var reserved = ['__engine_type__', ];
    var available_storage_engines = ServerSide ? null
                                  : {
                                     session: global.sessionStorage,
                                     permanent: global.localStorage
                                    };

    //************************************************************* 

    var shuffleArray              = function( arr ) {
                                        arr = Array.isArray( arr ) ? arr : [arr];
                                        if ( arr.length > 1 )
                                             arr = arr.sort(function(){ return Math.random() - 0.5});
                                        return arr;
                                    };
                            
    //************************************************************* 

    var StorageEngine = function( selected_engine ) {
        
        if ( available_storage_engines ) {
             var engine_type = selected_engine;
             var selected_engine = available_storage_engines[engine_type];
             return new Proxy({ }, { 

                 deleteProperty( _, k ) {
                         if ( reserved.includes( k ))
                              throw new Error(k+': is a reserved word, access denied.');
                         return k === 'all' ? selected_engine.clear( ) : selected_engine.removeItem( k );
                 },
                 get( _, k ) {
                         if ( k === '__engine_type__')
                              return engine_type;
                         var v = selected_engine.getItem( k ); 
                         return !v || v === undefined ? '' : v;
                 },
                 set( _, k, v ) {

                     if ( reserved.includes( k ))
                          throw new Error(k+': is a reserved word, access denied.');
                     return selected_engine.setItem(k, v);
                 },

             })
        } else throw new Error('This feature is currently available for browsers only');
    };

    //*************************************************************

    var QueueReducer      = async ( accumulatorPromise, functionChain ) => accumulatorPromise.then( x => Promise.resolve( functionChain( x )));
    var asyncReducerLeft  = ( ...fQ ) => o => fQ.reduce( QueueReducer, Promise.resolve( o )); 
    var asyncReducerRight = ( ...fQ ) => o => fQ.reduceRight( QueueReducer, Promise.resolve( o )); 
    
    //*************************************************************    

    var pipeObject = function( ...fQ ) {
        this.queue = fQ;
        this.stack = 'fifo';
        this.queue_size = this.queue.length;
    };

    pipeObject.prototype = {
        lifo   : function( ) { this.stack = 'lifo'; return this; },
        fifo   : function( ) { this.stack = 'fifo'; return this; },
        random : function( ) { this.stack = 'random'; return this; },
        inject : function(f, where) {
                               if ( typeof f === 'function' ) {
                                    where = (where || 'top',
                                            !['top','bottom'].includes( where ) ? 'top' : where);
                                     console.log( 'queue before: ', this.queue );
                                    if ( where === 'top')         
                                         this.queue.unshift( f ); 
                                    else this.queue.push( f );
                                    console.log( 'queue after: ', this.queue );
                               } else throw new Error('Injected object must be invocable');
                               return this;
                             },         
        exec   : function(o) { 
                          if ( this.stack === 'random' ) 
                               this.queue = shuffleArray( this.queue ); 
                          var  q = this.stack === 'lifo' 
                                 ? asyncReducerRight( ...this.queue )
                                 : asyncReducerLeft ( ...this.queue ); 
                          return q( o );
                        }

    }
    //*************************************************************

    var lw = function( ) {
        return new lw.init( );
    }

   //*************************************************************

    lw.prototype = {

        version: function( ) {

            return version;

        },

        //*************************************************************

        void: function( ){ },

        /*************************************************************
        * usage: l().type_of( o ) 
        *       possible return values:
        *           - primitives ( number, string, boolean, null, undefined )
        *           - function
        *           - asyncfunction
        *           - generatorfunction
        *           - constructorfunction
        *           - promise
        *           - object
        *           - array
        * 
        *************************************************************
        */
        type_of: function( o ) {
        
            return [ undefined, 'undefined', null ].includes( o ) ? o 
                   : new RegExp("\\[.+ (.+)\\]").exec({}.toString.call( o ).toLowerCase( ))[1];
            
        },
          
        //*************************************************************

        is_callable: function( f ) {

            return typeof( f ) === 'function';

        },

        //*************************************************************
        
        is_promise: function( p ) {
        
            return this.type_of( p ) === 'promise' || this.type_of(p.then) === 'function';
            
        },
        
        //*************************************************************
        
        clone: function ( o ) { 
        
            var primitives =['string', 'number', 'boolean', 'symbol', null, undefined, 'undefined'];
            if ( !primitives.includes( this.type_of( o ))) 
                    if ( this.type_of( o[Symbol.iterator]) === 'function' ||
                        this.type_of( o[Symbol.asyncIterator]) === 'function' )
                        return [...o];
            return o; 
        
        },

        /************************************************************* 
         * Storage engine: 
         * 
         *     2 MB to 10 MB size of data can be stored on the client machine depending on the browser  
         *     for chrome: Web storage APIs (LocalStorage & SessionStorage ) remain fixed at 5 MB.
         * 
         * usage: var l = lw( ); // create a lib instance
         *        var storage = l.offline_storage( bool ) // true for session storage, false: localstorage     
         * 
         * save name in storage: storage.name ="value";
         * get name from storage: var name = storage.name;
         * delete name from storage: delete storage.name;
         * clear all storage: delete storage.all;
         * get used storage type: var type = storage.__engine_type__;
         * 
         ************************************************************* 
        */
        offline_storage: function( cross_sessions ) {
            this.cross_sessions = cross_sessions;
            var selected_engine = cross_sessions ? 'session' : 'permanent';
            return StorageEngine( selected_engine );
        },

        /************************************************************* 
         * usage: var l = lw( ); // create a lib instance
         *        var engines = l.available_storage_engines( );
         * 
         * return values: 
         *      - session: for cross session storage
         *      - permanent: for local storage
         * 
         ************************************************************* 
        */
        available_storage_engines: function( ) {

            return Object.keys(available_storage_engines);

        },

        //*************************************************************

        random_number: function( max_exclusive ) {
            max_exclusive = max_exclusive || 100;
            return Math.floor(Math.random() * max_exclusive );
        },

        //*************************************************************

        random_array_element: function( arr ) {
            arr = this.type_of( arr ) === 'array' ? arr : [arr];
            return arr[ this.random_number( arr.length )];
        },

        //*************************************************************

        shuffle_array: shuffleArray,

        /************************************************************* 
         * usage: var l = lw( ); // create a lib instance
         *        var wait = l.async_delay( milli_seonds );
         *        var delayed_task = wait( task ); // task can be an object, a function or any other data type
         * 
         * return values: 
         *      - returns a closure with milli_seconds as variable
         *      - a function: with an object that it will use in the resolve process once finished
         * 
         ************************************************************* 
        */
        async_delay: function( delay ) {
                        return function(x) {
                            return new Promise( res => {
                                setTimeout( function(){
                                    return res( x );
                                }, delay);
                            });
                        }    
        },        

        /*
        ******************************************************************************************
        * Async pipe: Using promise chaining ( sequential function queue execution )
        *             Function varibales can be passed from one function to the next
        *             Queue can be executed LIFO, FIFO or random    
        * 
        * usage: var l = lw( ); // create a lib instance
        * 
        *        var f1 = function( x ){...; return x;};
        *        var f2 = function( x ){...; return x;};
        *        var f3 = function( x ){...; return x;};
        * 
        *        var pipe = l.pipe( f1, f2, f3 ).lifo( ).exec( x );
        *   or
        *        var pipe = l.pipe( f1, f2, f3 ).fifo( ).exec( x ); 
        *   or
        *        var pipe = l.pipe( f1, f2, f3 ).random( ).exec( x );
        * 
        *   or
        *        var pipe = l.pipe( f1, f2, f3 );
        *   
        *        pipe.inject( f, where );  // add one more -- where: 'top' or 'botom
        * 
        *        var pipe_queue = pipe.queue; // get queue content
        *        var stack      = pipe.stack; // get used stacking method ( lifo, fifo, random )                     
        *        var queue_size = pipe.queue_size; // get number of queue elements
        *
        *        var result     = pipe.random( ).exec( x );
        *
        *        // result is a promise
        *        result.then(function( output ){ console.log( output )});
        *
        ******************************************************************************************
        */
        pipe: function(...fQ ){
                 return new pipeObject( ...fQ );
        },

        //*************************************************************     
        // inspired from jQuery extend function

        extend: function() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[ 0 ] || {},
                i = 1,
                length = arguments.length,
                deep = false;
        
            // Handle a deep copy situation
            if ( this.type_of(target) === "boolean" ) {
                deep = target;
        
                // Skip the boolean and the target
                target = arguments[ i ] || {};
                i++;
            }
        
            // Handle case when target is a string or something (possible in deep copy)
            if ( this.type_of(target) !== "object" && !this.is_callable( target ) ) {
                target = {};
            }
        
            // Extend lw itself if only one argument is passed
            if ( i === length ) {
                target = this;
                i--;
            }
        
            for ( ; i < length; i++ ) {
        
                // Only deal with non-null/undefined values
                if ( ( options = arguments[ i ] ) != null ) {
        
                    // Extend the base object
                    for ( name in options ) {
                        copy = options[ name ];
        
                        // Prevent Object.prototype pollution
                        // Prevent never-ending loop
                        if ( name === "__proto__" || target === copy ) {
                            continue;
                        }
        
                        // Recurse if we're merging plain objects or arrays
                        if ( deep && copy && ( this.type_of( copy ) === 'object' ||
                            ( copyIsArray = Array.isArray( copy ) ) ) ) {
                            src = target[ name ];
        
                            // Ensure proper type for the source value
                            if ( copyIsArray && !Array.isArray( src ) ) {
                                clone = [];
                            } else if ( !copyIsArray && this.type_of( src ) !== 'object' ) {
                                clone = {};
                            } else {
                                clone = src;
                            }
                            copyIsArray = false;
        
                            // Never move original objects, clone them
                            target[ name ] = this.extend( deep, clone, copy );
        
                        // Don't bring in undefined values
                        } else if ( copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
            }
        
            // Return the modified object
            return target;
        },

    };

    //************************************************************* 

    lw.init = function( ) { }

   //*************************************************************

    lw.init.prototype = lw.prototype;
    global.lw         = global.l = lw;

   //*************************************************************    
   // Map over lw and l in case of overwrite   
   var _l  = window.l,
       _lw = window.lw;

   if ( _lw === lw ) global.lw = _lw;
   if ( _l ===  lw ) global.l  = _l;

});