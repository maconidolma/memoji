function initGame() {

    //Constructor object DOM element - item
    function Card (domCard, content) {
        this._card = domCard;
        this.content = content;
        this.isRotated = false;
        var children = this._card.childNodes;
        for (let i = 0; i < children.length; i++) {
            if ('classList' in children[i]) {
                if (children[i].classList.contains('front')) {
                    children[i].innerHTML = content;
                    this.front = children[i];
                }
            }
        }
        this.isRed = false;
        this.isGreen = false;
        this.rotate = function () {
            if (this._card.classList.contains('rotated')) {
                this._card.classList.remove('rotated');
                this.isRotated = false;
            } else {
                this._card.classList.add('rotated');
                this.isRotated = true;
            }
        }
        this.setGreen = function () {
            this.front.classList.add('green');
            this.isGreen = true;
        }
        this.setRed = function () {
            this.front.classList.add('red');
            this.isRed = true;
        }
        this.removeRed = function () {
            this.front.classList.remove('red');
            this.isRed = false;
        } 
    };

    var cards = document.querySelectorAll('.card');
    //array of items
    var cardsArray = [];
    var contents = ['🐓', '🐱', '🐿', '🐹', '🐨', '🐞', '🐓', '🐱', '🐿', '🐹', '🐨', '🐞'];
    
    //create by constructor item elemnts ans add them to array itemsArray
    for (let i = 0; i < cards.length; i++) {
        var count = parseInt(Math.random() * (contents.length - 1));
        cardsArray.push(new Card(cards[i], contents[count]));
        contents.splice(count, 1);
    }  

    function findCardByDOMCard (DOMCard) {
        for (let i = 0; i < cardsArray.length; i++) {
            if (cardsArray[i]._card == DOMCard) {
                return cardsArray[i];
            }
        }
        throw "Bad DOWCard";
    }

    var game = document.getElementById('game');

    //state when nothing is rotated or two red cards rotated;
    var state1 = 1; 

    //state when one card is rotated;
    var state2 = 2;

    //currentState
    var currenState = state1;

    //last target in state 1
    var lastTarget = null;

    //event handler for game
    game.addEventListener('click', function(event) {
        if (! event.target.parentNode.classList.contains('card')) {
            return;
        }
        var card = findCardByDOMCard(event.target.parentNode);
        if (card.isRotated) {
            return;
        } else {
            card.rotate();
        }

        //if current state is 'nothing is rotated' or 'two red cards rotated';
        if (currenState == state1) {
            for (let i = 0; i < cardsArray.length; i++) {
                if (cardsArray[i].isRed) {
                    cardsArray[i].removeRed();
                    cardsArray[i].rotate();
                }
            }
            lastTarget = card;
            currenState = state2;
        } 

        //if current state is 'one card is rotated';
        else if (currenState == state2) {
            if (lastTarget.content == card.content) {
                lastTarget.setGreen();
                card.setGreen();
            } else {
                lastTarget.setRed();
                card.setRed();
            }
            currenState = state1;
            lastTarget = null;
        }
    });

    

}