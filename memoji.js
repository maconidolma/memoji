function initGame() {

    // State when 'nothing is rotated' or 'two red cards rotated'
    var state1 = 1; 
    // State when 'one card is rotated'
    var state2 = 2;
    // CurrentState
    var currenState = state1;
    // Last target from state1
    var lastTarget = null;
    var isFirstClick = true;

    var setTimer = null;

    // Constructor object DOM element - card
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
        this.removeGreen = function() {
            this.front.classList.remove('green');
            this.isGreen = false;
        } 
    };

    function findCardByDOMCard (DOMCard) {
        for (let i = 0; i < cardsArray.length; i++) {
            if (cardsArray[i]._card == DOMCard) {
                return cardsArray[i];
            }
        }
        throw "Bad DOWCard";
    }

    var cards = document.querySelectorAll('.card');

    var contents = ['🐓', '🐱', '🐿', '🐹', '🐨', '🐞', '🐓', '🐱', '🐿', '🐹', '🐨', '🐞'];
    var cardsArray = getRandomNewCardsArray(contents);
    
    // Create cards with consrtuctor and store them to cadsArray
    function getRandomNewCardsArray (contents) {
        var cardsArray = [];
        var contentsCopy = contents.slice();
        for (let i = 0; i < cards.length; i++) {
            var count = parseInt(Math.random() * (contentsCopy.length - 1));
            cardsArray.push(new Card(cards[i], contentsCopy[count]));
            contentsCopy.splice(count, 1);
        } 
        return cardsArray;
    }
    // Function refresh game
    function resetGame() {
        // If cards are rotated, red || green, remove this      
        for (let i = 0; i < cardsArray.length; i++) {
            if (cardsArray[i].isRotated) {
                cardsArray[i].rotate();
            }
            if (cardsArray[i].isGreen) {
                cardsArray[i].removeGreen();
            }
            if (cardsArray[i].isRed) {
                cards[i].removeRed();
            }
        }
        // Shuffle contents imoji
        cardsArray = getRandomNewCardsArray(contents);
        console.info(cardsArray);
        // Reset the timer counter
        var counterDOM = document.getElementById('count');
        counterDOM.innerHTML = '01:00';
        // Disappearance pop-up window
        DisappearanceResult();

        
        state1 = 1; 
        state2 = 2;
        currenState = state1;
        lastTarget = null;
        isFirstClick = true;
        setTimer = null;
        counter = 60;
    }

    //  Appearance pop-up window
    function appearanceResult(str1, str2) {
        var popWindow = document.getElementById('invisible');
        var resultMessage = document.getElementById('resultMessage');
        var resultButton = document.getElementById('resultButton');
        popWindow.classList.add('appearance');
        resultMessage.innerHTML = str1;
        resultButton.innerHTML = str2;
    }
    // Disappearance pop-up window
    function DisappearanceResult() {
        var popWindow = document.getElementById('invisible');
        popWindow.classList.remove('appearance');
    }

    // Check is all cards are green
    var isAllCardsGreen = function() {
        for (let i = 0; i < cardsArray.length; i++) {
            if (!cardsArray[i].isGreen) {
                return false;
            }
        }
        return true;
    }

    
    var counter = 60;
    // Create timer finction
    var timer = function() {
        counter --;
        if (counter >= 0) {
            span = document.getElementById('count');
            var time = new Date(counter * 1000);
            var m = time.getMinutes();
            var s = time.getSeconds();
            if (s < 10) {
                s = '0' + s;
            }
            span.innerHTML = m + ':' + s;
        }
        if (counter === 0) {
            appearanceResult('Lose', 'Try again');
            clearInterval(setTimer);
        }
    }

    // Event handler for game
    var game = document.getElementById('game');
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

        // Set timer for first click
        if (isFirstClick) {
            setTimer = setInterval(timer, 1000);
            isFirstClick = false;
        }

        // If current state is 'nothing is rotated' or 'two red cards rotated'
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

        // If current state is 'one card is rotated'
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

        // Check win condition
        if (isAllCardsGreen()) {
            appearanceResult('Win', 'Play again');
            clearInterval(setTimer);
        }
    });

    // Event handler for refresh game
    var button = document.getElementById('resultButton');
    button.addEventListener('click', resetGame);
}