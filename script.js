
let deck_Id;
localStorage.clear();
const cardsContainerEl = document.querySelector(".cards-container");
const winnerLabelEl = document.querySelector(".winner-label");
const cardsRemainingEl = document.querySelector(".cards-remaining");
const drawCardBtn = document.querySelector(".draw-card-btn");
const p1scoreEl = document.querySelector(".score1");
const p2scoreEl = document.querySelector(".score2");


resetGame();
if (!localStorage.getItem("deck_Id")) {
    drawCardBtn.style.display = "none";
}

function handleNewDeck(){
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/')
        .then(res => res.json())
        .then(data =>{
            deck_id = data.deck_id;
            localStorage.setItem("deck_Id", deck_id);
            cardsContainerEl.innerHTML = `
                                        <div class="card-placeholder"></div>
                                        <div class="card-placeholder"></div>`;
            winnerLabelEl.textContent = 'Now keep drawing cards!';
            drawCardBtn.style.display = "";
            resetGame();
            updateGameValues();

        })
}

function handleDrawCards(){
    fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('deck_Id')}/draw/?count=2`)
        .then(res => res.json())
        .then(data =>{
            cardsRemaining = data.remaining;            
            let view = '';
            
            for(let card of data.cards){
                 view += `
                    <img class="card" src="${card.image}" alt="${card.value + " of " + card.suit}">`;

            }
            cardsContainerEl.innerHTML = view;
            let winnerInfo = checkWhoScores(data.cards[0].value, data.cards[1].value);
            winnerLabelEl.textContent = winnerInfo; 
            updateGameValues();
            
            if(cardsRemaining === 0){
                drawCardBtn.style.display = "none";
                winnerLabelEl.textContent = (p1Score > p2Score) ? "Player 1 wins!" : "Player 2 wins!"
            }
        })
    
}

function checkWhoScores(card1, card2){
   const options = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]
   const card1ValueIndex = options.indexOf(card1);
   const card2ValueIndex = options.indexOf(card2);
   
   if(card1ValueIndex === card2ValueIndex) {
       return "It's WAR!"
    } else if (card1ValueIndex > card2ValueIndex) { 
       p1Score += 1;
       return "Player 1 scores!"
    } else{
        p2Score += 1;
        return "Player 2 scores!"
    }
}

function resetGame(){
    p1Score = 0;
    p2Score = 0;
    cardsRemaining = 52;
}

function updateGameValues(){
    cardsRemainingEl.textContent = `Cards remaining: ${cardsRemaining}`;
    p1scoreEl.textContent = p1Score;
    p2scoreEl.textContent = p2Score;
}

document.querySelector(".deck-btn").addEventListener("click", handleNewDeck)
document.querySelector(".draw-card-btn").addEventListener("click", handleDrawCards)
 