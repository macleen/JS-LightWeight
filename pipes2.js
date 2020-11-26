var mac = l();
console.log(mac);


function attach_event_listener_to_demo_btn(  ) {
    document.getElementById("startDemo").addEventListener("click", function(){
        graphBlocks.direction = '+'; // start to end
        graphBlocks.current = 0;
        var $title= document.getElementById("title");
        var result = article_pipe.fifo().exec( );
        result.then(function( _ ) { 
            var res = block_pipe.exec(graphBlocks);
            res.then(function( _ ) { $title.innerText = '------- (((( Demo finished ))))-------'});
        });    
  });
}


function attach_event_listener_to_reverse_demo_btn(  ) {
  document.getElementById("reverseAnimate").addEventListener("click", function(){
      graphBlocks.direction = '-'; // end to start
      graphBlocks.current = 5;
      var $title= document.getElementById("title");
      var result = block_pipe.lifo().exec( graphBlocks );
      result.then(function( _ ) { 
        var res = article_pipe.lifo().exec();
        res.then(function( _ ) { $title.innerText = '------- (((( Reverse demo finished ))))-------'});
      });   
  });
}


  var $article1 = document.querySelector('#article1');
  var $article2 = document.querySelector('#article2');
  var $article3 = document.querySelector('#article3');

  var graphBlocks = { 
                     current: 0,
                     direction: 1,
                     container: document.querySelectorAll('.block')
                    };  

  var $block6 = document.querySelector('#elementToAnimate');
  var rect = $block6.getBoundingClientRect();
  var offsetTop = window.pageYOffset + rect.top - rect.height;
  var $lastblock = {
                    top: offsetTop +'px',
                    left: 0 +'px',
  }; 

  function start_animation( e ) {
    e.classList.add("animate");
    e.style.top = Math.floor(Math.random() * (window.innerHeight / 2 )) + 'px';
    e.style.left = Math.floor(Math.random() * (window.innerWidth / 2 )) + 'px';
  }  

  function start_animation2( e ) {
    e.style.top = Math.floor(Math.random() * (window.innerHeight / 2 )) + 'px';
    e.style.left = Math.floor(Math.random() * (window.innerWidth / 2 )) + 'px';
  }  

  function stop_animation( e ) {
    e.style.top = $lastblock.top;
    e.style.left = $lastblock.left;
  }  



  var fb1 = function( gbks ) { var x = gbks.direction==='+'?1:-1; gbks.container[gbks.current].style.top = gbks.direction+'25px'; gbks.current += x; return gbks; }
  var fb2 = function( gbks ) { var x = gbks.direction==='+'?1:-1; gbks.container[gbks.current].style.top = gbks.direction+'25px'; gbks.current += x; return gbks; }
  var fb3 = function( gbks ) { var x = gbks.direction==='+'?1:-1; gbks.container[gbks.current].style.top = gbks.direction+'25px'; gbks.current += x; return gbks; }
  var fb4 = function( gbks ) { var x = gbks.direction==='+'?1:-1; gbks.container[gbks.current].style.top = gbks.direction+'25px'; gbks.current += x; return gbks; }
  var fb5 = function( gbks ) { var x = gbks.direction==='+'?1:-1; gbks.container[gbks.current].style.top = gbks.direction+'25px'; gbks.current += x; return gbks; }
  var fb6 = function( gbks ) { var x = gbks.direction==='+'?1:-1; gbks.container[gbks.current].style.top = gbks.direction+'25px'; gbks.current += x; return gbks; }
  var fb7 = function( gbks ) { gbks.direction==='+'?start_animation($block6):stop_animation($block6); return gbks; }  
  var fb8 = function( gbks ) { gbks.direction==='+'?stop_animation($block6):start_animation($block6); return gbks; }  

  var block_pipe = mac.pipe( 
                          mac.async_delay(700), 
                          fb1, 
                          mac.async_delay(400), 
                          fb2, 
                          mac.async_delay(400),
                          fb3, 
                          mac.async_delay(400),
                          fb4, 
                          mac.async_delay(400),
                          fb5, 
                          mac.async_delay(400),
                          fb6, 
                          mac.async_delay(400),
                          fb7, 
                          mac.async_delay(400),
                          fb8, 
                          mac.async_delay(700),
                    );

console.log('block_pipe queue:', block_pipe.queue);                      
console.log('block_pipe stack:', block_pipe.stack);                      
console.log('block_pipe queue_size:', block_pipe.queue_size);                      


//**************************************************************************** */


var art1 = function( ) { var x = graphBlocks.direction==='+'?'Changed to UpperCase ARTICLE 1':'Article 1'; var f = graphBlocks.direction==='+'?'bold':'400';$article1.innerText = x; $article1.style.fontWeight = f; }
var art2 = function( ) { var x = graphBlocks.direction==='+'?'Changed to UpperCase ARTICLE 2':'Article 2'; var f = graphBlocks.direction==='+'?'bold':'400';$article2.innerText = x; $article2.style.fontWeight = f; }
var art3 = function( ) { var x = graphBlocks.direction==='+'?'Changed to UpperCase ARTICLE 3':'Article 3'; var f = graphBlocks.direction==='+'?'bold':'400';$article3.innerText = x; $article3.style.fontWeight = f; }

var article_pipe = mac.pipe( 
                        mac.async_delay(400), 
                        art2, 
                        mac.async_delay(400),
                        art3, 
                        mac.async_delay(800),
                  );

article_pipe.inject(art1).inject(mac.async_delay(800)); 

console.log('article_pipe queue:', article_pipe.queue);                      
console.log('article_pipe stack:', article_pipe.stack);                      
console.log('article_pipe queue_size:', article_pipe.queue_size);                      





attach_event_listener_to_demo_btn( );
attach_event_listener_to_reverse_demo_btn(  );

//var result = pipe.exec($('#person1'));
//result).text('Im done...');
//result.then(function( _ ) { $('#title').text('------- (((( Simple Animation finished ))))-------')})
