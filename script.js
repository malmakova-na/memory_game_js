'use strict';
var emoji = ['🐶', '🐱','🐨','🐯', '🐸', '🐻'];

function shuffle(arr){
	var j, temp;
	for(var i = arr.length - 1; i > 0; i--){
		j = Math.floor(Math.random()*(i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
}
function statusModal(modal){
    modal.classList.toggle("inactive");
    modal.classList.toggle("active");
}
function deleteChildren(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}

function Game(){
    this.field = document.getElementById("field");
    this.modalWindow = document.getElementById("mod");
    this.timer = document.getElementById("timer");
    this.memoji = shuffle(emoji.concat(emoji));
    this.cards = [];
    this.clicks = [];
    this.addCards();
}

function Card(id, sticker){
    this.card = document.createElement("div");
    this.card.id = id;
    this.card.classList.add("card");
    this.setSticker(sticker);
}
function Window(message){
    this.windowWrapper = document.createElement("div");
    this.windowWrapper.classList.add("window");
    this.windowWrapper.message = "<div id ='resMessage' class ='text'>"+ message + "</div>";
    this.windowWrapper.playButton = "<button id = 'playButton' class ='text'> Play again </button>"; 
    this.windowWrapper.innerHTML = this.windowWrapper.message + this.windowWrapper.playButton;
    return this.windowWrapper; 
}

Card.prototype.setSticker = function (sticker){
    this.card.sticker = sticker;
    this.card.innerHTML = "<div class = 'front'></div><div class = 'back'>" + this.card.sticker + "</div>";
}

Game.prototype.addCards = function (){
    for(var i = 0; i < this.memoji.length; i++){
        var card =  new Card(i, this.memoji[i]);
        this.cards.push(card);
        this.field.appendChild(this.cards[i].card);
    }
}
Game.prototype.stopTimer = function(timerId, message){
    clearInterval(timerId);
    this.endGame(message);
}

Game.prototype.endGame = function(message){
    var this_ = this;
    this.modalWindow.append(new Window(message));
    statusModal(this.modalWindow);
    var playButton = document.getElementById("playButton");
    playButton.classList.add("notPush");
    playButton.addEventListener("click", function(){
        playButton.classList.add("push");
        setTimeout(function(){
            statusModal(this_.modalWindow);
            deleteChildren(this_.modalWindow);
            this_.restart();
        }, 500);
        
    });
}

Game.prototype.restart = function(){
    deleteChildren(this.timer);
    this.field.childNodes.forEach(el => {
        el.classList.remove("flipped");
        el.classList.remove("matched");
        el.classList.remove("unmatched");
    });
    this.move = 0;
    this.clicks = [];
    this.memoji = shuffle(this.memoji);
    this.matchedCards = 0;
    for(var i = 0; i < this.cards.length; i++){
        setTimeout(this.cards[i].setSticker.bind(this.cards[i]), 1000, this.memoji[i]);
    }
}

Game.prototype.startTimer = function(){
    var duration = 60;
    var this_ = this;
    var timerId = setInterval(function() {
        var minutes = duration / 60 % 60;
        var seconds = duration % 60;
        if(duration < 0){
            this_.stopTimer(timerId, "<span>L</span><span>o</span><span>s</span><span>e</span>");
        }
        else{
            var strMin =  `${Math.trunc(minutes)}`;
            var strSec = `${seconds}`;
            if(minutes <  10){
                strMin = '0' + strMin;
            }
            if(seconds < 10){
                strSec = '0'+ strSec;
            }
            var clockDisplay = strMin + ':' + strSec;
            this_.timer.innerHTML ="<div class = 'clockDisplay text'>" + clockDisplay + "</div>";
        }
        --duration;

    }, 1000);
    return timerId;
    

}

Game.prototype.canClick = function(card){
    if(card.classList.contains("matched")){
        return false;
    }
    if(this.clicks.length == 1){
        if(this.clicks[0].id == card.id)
            return false;
    }
    if((this.clicks.length == 2)){
        if(this.clicks[0].id == card.id || this.clicks[1].id == card.id)
            return false;
    }
    return true;    
    

}
Game.prototype.flipCard = function (card){
    card.classList.add("flipped");
    if(this.clicks.length == 1){
        if(this.clicks[0].sticker == card.sticker){
            this.clicks[0].classList.add("matched");
            card.classList.add("matched");
            this.matchedCards += 2;
        } else {
            this.clicks[0].classList.add("unmatched");
            card.classList.add("unmatched");
        }
    }else if(this.clicks.length == 2){
        this.clicks.forEach(el =>{
            if(el.classList.contains("unmatched")){
                el.classList.remove("flipped");
                el.classList.remove("unmatched");
            }
            this.clicks = [];
        })
    }
    this.clicks.push(card);
}
Game.prototype.processGame = function (){
    this.move = 0;
    this.matchedCards = 0;
    this.modalWindow.classList.add("inactive");
    this.addCards();
    var this_ = this;
    var timerId;
    this.field.addEventListener("click", function (event){
        this_.move += 1;
        var id = event.target.parentNode.id;
        if(this_.move == 1){
            timerId = this_.startTimer();
        }
        if(this_.canClick(this.childNodes[id])){
            this_.flipCard(this.childNodes[id]);
            if(this_.matchedCards == this_.memoji.length){
                this_.stopTimer(timerId, "<span>W</span><span>i</span><span>n</span>");
            }
        }    
    });
    //alert(0);
}



var game = new Game();
game.processGame();

