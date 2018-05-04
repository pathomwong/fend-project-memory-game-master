/*
* Global variable
*/
let moveCounter = 0;
let matchNum = 0;
let timerStart = false;
let running = false;
let timecounter = 0;
let level = 'normal'

/*
* Caching the element
*/
const deck = $('.deck');

/*
 * Create a list that holds all of your cards
 */
const cardlist = ['fa-diamond','fa-anchor','fa-bolt','fa-cube','fa-leaf','fa-bicycle','fa-bomb','fa-paper-plane-o',
                  'fa-diamond','fa-anchor','fa-bolt','fa-cube','fa-leaf','fa-bicycle','fa-bomb','fa-paper-plane-o'];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function cardGen(cardlist){
    cardlist = shuffle(cardlist);
    for(let i=0; i < cardlist.length; i++){
      deck.append(`<li class="card facedown" id="${i}"><i class="fa ${cardlist[i]}"></i></li>`);
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
* @description reposponed when the card is click
* @param {event} event - event from the element
*/
const cardclick = (event) => {
  if(!timerStart){
    running =true;
    timer();
    timerStart = true;
    $('#level').addClass("noevent");
  }

  const curentCard = $(event.target);
  //static variable to check card clicking from https://www.electrictoolbox.com/javascript-static-variables/
  if( typeof cardclick.checker === 'undefined' ) {
      cardclick.checker = true;
  }

 //static variable to store previous card that clicked
  if( typeof cardclick.prevCard === 'undefined' ) {
      cardclick.prevCard = null;
  }

  curentCard.addClass("open show");
  if(cardclick.checker){
      cardclick.prevCard = curentCard;
      cardclick.checker = false;
  }else{
      countMove();
      if(curentCard.children().attr('class') === cardclick.prevCard.children().attr('class')){
        curentCard.removeClass("open show facedown");
        cardclick.prevCard.removeClass("open show facedown");
        curentCard.addClass("match");
        cardclick.prevCard.addClass("match");
        matchNum++;
        checkWin();
      }else{
          curentCard.addClass("unmatch");
          cardclick.prevCard.addClass("unmatch");
      }

      $('.facedown').addClass("noevent");
      setTimeout(function(){
        curentCard.removeClass("open show");
        cardclick.prevCard.removeClass("open show");
        curentCard.removeClass("unmatch");
        cardclick.prevCard.removeClass("unmatch");
        cardclick.prevCard = null;
        cardclick.checker = true;
        $('.facedown').removeClass("noevent");
      },900);

      if(level === 'epic'){
        swapCard();
      }
  }
}

/**
* @description check if player win
*/
function checkWin(){
  console.log('match#'+matchNum);
  if(matchNum === 8){
    running = false;
    $('.card').addClass("win-spin");
    $('#win-modal').css("display","block");
    $('#win-star').html($('.stars').html());
    $('#win-move').html('you use '+  moveCounter + ' moves');
    $('#win-time').html('Time: '+  $('#time').html());
  }
}

/**
* @description count player moves
*/
function countMove(){
  moveCounter++;
  $('.moves').html(moveCounter);

  // if(moveCounter === 30){
  //   $('#star1').addClass("star-grey");
  // }
  if(moveCounter === 20){
    $('#star2').addClass("star-grey");
  }
  if(moveCounter === 10){
    $('#star3').addClass("star-grey");
  }
}

/**
* @description time player
*/
function timer(){
  if(running == true){
    setTimeout(function(){
      timecounter++;
      let second = Math.floor((timecounter/10 )% 60);
      let min = Math.floor(timecounter / 600);
      $('#time').html(`${min}m:${second}s`);
      timer();
    },100);
  }
}

/**
* @description reset timer
*/
function resetTimer(){
  running =false;
  timerStart = false;
  timecounter = 0;
  $('#time').html('0m:0s');
}

/**
* @description reset the deck
*/
function resetDeck(){
  $('.deck li').remove();
  cardGen(cardlist);
  moveCounter = 0;
  $('.moves').html(moveCounter);
  cardclick.prevCard = null;
  cardclick.checker = true;
  $('.fa').removeClass("star-grey");
  if(level === 'epic'){
    $('.card').addClass('relative');
  }

}

/**
* @description swap the cards for epic mode
*/
function swapCard(){
  let card = $(".card");
  let cardlist = [...card]
  let id =[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  id = shuffle(id);
  $('.card').css( "transition", "none" );
  $('.card').css( "animation", "none" );
  for(let i=0;i<id.length;i =i+2){
    let firstCard = $('#'+id[i]);
    let secondCard = $('#'+id[i+1]);
    let top = firstCard.offset().top - secondCard.offset().top;
    let left = firstCard.offset().left - secondCard.offset().left;
    firstCard.addClass("noevent").animate({
          top: "-="+ top,
          left: "-="+ left
        }, 2000, function() {
              // Animation complete.
        });
    secondCard.addClass("noevent").animate({
            top: "+="+ top,
            left: "+="+ left
          }, 2000, function() {
      // Animation complete.
    });
  }
}

/**
* @description swap background color on the level selector
*/
function changeToolColorBackground(level){
    $('#level li').css('background-color', '');
    level.css('background-color', '#7F8C8D');
}

/**
* @description card clicking event capture
*/
deck.on('click', 'li', cardclick);
$('#normal').click(function(){
  level = 'normal';
  $('.card').removeClass('relative');
  changeToolColorBackground($(this));
});

/**
* @description epic mode clicking event capture
*/
$('#epic').click(function(){
  level = 'epic';
  $('.card').addClass('relative');
  changeToolColorBackground($(this));
});

/**
* @description restart game clicking event capture
*/
$('.restart').click(function(){
  resetTimer();
  resetDeck();
  $('#level').removeClass("noevent");
});

/**
* @description click event when player close modal
*/
$('.modal .close').click(function(){
  $('#win-modal').css("display","none");
});

 cardGen(cardlist);
 $('#normal').css('background-color', '#7F8C8D');
