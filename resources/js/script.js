
/*
TODO CONSEGNA GIORNO 1
TODO L'utente clicca su un bottone che genererà una griglia di gioco quadrata.
TODO Ogni cella ha un numero progressivo, da 1 a 100.
TODO Ci saranno quindi 10 caselle per ognuna delle 10 righe.
TODO Quando l'utente clicca su ogni cella, la cella cliccata si colora di azzurro ed emetto un messaggio in console con il numero della cella cliccata.
TODO Bonus
TODO Aggiungere una select accanto al bottone di generazione, che fornisca una scelta tra tre diversi livelli di difficoltà:
TODO con difficoltà 1 => 100 caselle, con un numero compreso tra 1 e 100, divise in 10 caselle per 10 righe;
TODO con difficoltà 2 => 81 caselle, con un numero compreso tra 1 e 81, divise in 9 caselle per 9 righe;
TODO con difficoltà 3 => 49 caselle, con un numero compreso tra 1 e 49, divise in 7 caselle per 7 righe 

TODO CONSEGNA GIORNO 2
TODO Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe. Attenzione: **nella stessa cella può essere posizionata al massimo una bomba, perciò nell’array delle bombe non potranno esserci due numeri uguali.
TODO In seguito l'utente clicca su una cella: se il numero è presente nella lista dei numeri generati - abbiamo TODO calpestato una bomba - la cella si colora di rosso e la partita termina. Altrimenti la cella cliccata si colora  di azzurro e l'utente può continuare a cliccare sulle altre celle.
TODO La partita termina quando il giocatore clicca su una bomba o quando raggiunge il numero massimo possibile di TODO numeri consentiti (ovvero quando ha rivelato tutte le celle che non sono bombe).
TODO Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha TODO cliccato su una cella che non era una bomba.
*/



//& INUPUT

//& BUTTON
const sendButton = document.getElementById("send-button");
//& OUTPUT
const response = document.getElementById("response");
const title = document.getElementById('title');

//& VARIABLES
let difficulty;
let bombs = 16;
let score = 0;
let gameIsInProgress = true;


sendButton.addEventListener('click', play)

//^ FUNCTION: play
function play() {
    gameIsInProgress = true;
    score = 0;
    if (document.getElementById("wrapper")) {
        document.getElementById("wrapper").remove();
        document.getElementById("tip").remove()
    }//remove the already existing wrapper
    title.classList.contains('reduction-done') ? '' : reduction(title, 75, 30); //! My Bonus: animation of title
    let message = document.createElement('h3')
    message.id = "tip"
    message.innerHTML = "TIP: If you think you've found a bomb, use the right mouse button to mark it"
    response.append(createZones(), message)

}

//^FUNCTION: CreateZones
/**
 * Function for create a wrapper and Zones, each zones has 2 cells. one for Back and one for Front
 *
 */
function createZones() {

    const Wrapper = document.createElement('div'); //Create wrapper, attributes and class
    Wrapper.setAttribute("id", "wrapper");
    Wrapper.classList = "d-flex flex-wrap";
    const arrayBomb = getRandomUniqueInteger(bombs, 1, difficulty) //Create the bomb array
    for (let i = 0; i < difficulty; i++) {
        const Zone = document.createElement('div'); //Create a single zone, set attributes and class
        Zone.setAttribute('id', `zone-${i + 1}`);
        Zone.className = `box-${difficulty} box zone is-flipped`;
        Zone.style = `width: calc(${difficulty}%^0.5)`
        const backCell = createCell(i + 1, cellContent(i + 1, arrayBomb), difficulty, "back"); //crate cell "back" and relative classes
        backCell.classList.add('back');
        const frontCell = createCell(i + 1, cellContent(i + 1, arrayBomb), difficulty, "front"); //crate cell "front" and relative classes
        frontCell.classList.add('front')
        population(frontCell, arrayBomb) //assign bombs to random cells
        Zone.appendChild(backCell);
        Zone.appendChild(frontCell)
        Zone.addEventListener('contextmenu', (event) => { //!-----MY BONUS---- put a red cross when right-click on a cell
            event.preventDefault();
            createCross(Zone)
        })
        Wrapper.appendChild(Zone)
    }
    return Wrapper
}
/**
 * this function is used to generate a red cross when i right click on a cell. That cell is disabled untill right-click again
 * @param {*} zone 
 */
//^ FUNCTION: CreateCross
function createCross(zone) {
    if (gameIsInProgress === true && zone.classList.contains("is-flipped")) { //check that zone is NOT flipped
        zone.childNodes.forEach(element => {
            if (element.classList.contains("back") && !element.classList.contains("red-cross")) {
                element.classList.add("red-cross");
                element.innerHTML = "X";
                zone.disabled = true;
            } else if (element.classList.contains("back") && element.classList.contains("red-cross")) {
                element.classList.remove("red-cross");
                element.innerHTML = "?";
                zone.disabled = false;
            }
        })
    }
}


//^ FUNCTION: CreateCells
/**
 * Function to create cells. arguments are
 * @param {*} cardIndex  //used to assign a value on a particular cell
 * @param {*} content    //content of the cell
 * @param {*} difficulty //difficulty of the game
 * @param {*} cardClass  // an eventual class 
 * @returns 
 */
function createCell(cardIndex, content, difficulty, cardClass) {
    let cell = document.createElement('div');
    cell.className = `box-${difficulty} box d-flex justify-content-center align-items-center`;
    cell.value = content.alt ?? cardIndex    //Here I am providing a value to the cells so that it is "bomb", a value that corresponds to the alt of the PNG images. If it is not available, I am using a nullish coalescing operator that returns true. Note that the content is currently a DOM img element.
    cardClass === "back" ? cell.innerHTML = "?" : cell.append(content) //Here, I am ensuring that the content of the cells varies depending on whether they are the front or the back. Additionally, if the back is a bomb, we have an image, otherwise, a simple empty container.
    cell.addEventListener('click', () => {
        if (cardClass === "back") {
            updateResults(cell)
        }  //Only the cell not pflipped can update scores
    });
    return cell
}


//^ FUNCTION: CellContent
/**
 * Check if the cell has the same value of an passed array
 * @param {*} value 
 * @param {*} arrayToCheck 
 * @returns 
 */
function cellContent(value, arrayToCheck) {
    if (arrayToCheck.includes(value)) {
        const BombImg = document.createElement('img')
        BombImg.src = "resources/img/Bomba.png";
        BombImg.className = "img-fluid "
        BombImg.alt = "bomb"
        return BombImg
    } else {
        let numberDiv = document.createElement('div')
        numberDiv.className = "number-container"
        return numberDiv
    }
}


//^ FUNCTION UpdateResults
function updateResults(element) {
    if (!element.parentNode.disabled === true) { //check if the user has put a cross on the cell ("is disabled")

        flipSuccess(element)
        if (element.value === "bomb") {
            document.querySelectorAll("div[id^='zone']").forEach(element => {
                element.classList.remove("is-flipped")
            }) //flip all cells
            document.body.prepend(modalLose(score, "lose"))
            gameIsInProgress = false;

        }
        else {
            let newScore = document.querySelectorAll(".selected").length;
            console.log(`+${newScore - score} point! (Actual Points: ${newScore})`);
            score = newScore;

        }
        if (score === (difficulty - bombs)) {
            document.querySelectorAll("div[id^='zone']").forEach(element => {
                element.classList.remove("is-flipped")
            })//flip all cells
            document.body.prepend(modalLose(score, "win"))
        }
    };

}

//^FUNCTION: flip success 
function flipSuccess(cell) {
    cell.parentElement.classList.remove("is-flipped");
    if ((cell.parentNode.lastElementChild.lastElementChild.classList.contains("warning-0")) && (!cell.parentNode.lastElementChild.classList.contains("selected"))) {
        cell.parentNode.lastElementChild.classList.add("selected");
        let adiacent = adiacentCells(cell);
        adiacent.forEach(element => {
            flipSuccess(document.getElementById(`zone-${element}`).firstElementChild);

        })
    } else {
        cell.parentNode.lastElementChild.classList.add("selected");
    }
}


//^ FUNCTION: Population
/**
 * Assign the risky level (number) in each cell adiacent at a bomb, based on the number of bombs.
 * @param {*} cell 
 * @param {*} array 
 */
function population(cell, array) {
    let cardRiskValue = 0;  //definisce il rischio di una cella, ovvero quante bombe ci sono in quelle adiacenti
    if (cell.value !== "bomb") { //vado ad incrimentare il rischio ogni volta che ritrovo una cella con una bomba vicina a quella che sto valutando e che non ha il valore di "bomb"
        adiacentCells(cell).forEach(element => {  //adiacentCell return an array filtered
            array.includes(element) ? cardRiskValue++ : ""; //if the arraybomb includes element in the adiacentcells array add a riskvalue
        })
        cell.childNodes.forEach(element => {
            element.innerHTML = cardRiskValue === 0 ? "" : cardRiskValue;
            element.classList.add(`warning-${cardRiskValue}`)
        })
    }
}

//^ FUNCTION: adiacentCells
/**
 * Pass a cell and return an array content all adiacent cells (filtered to respect the assial compare)
 * @param {*} cell 
 * @returns 
 */
function adiacentCells(cell) {
    let isRightEdge = cell.value % Math.sqrt(difficulty) === 0; // Check if cells is in the last column
    let isLeftEdge = cell.value % Math.sqrt(difficulty) === 1; // Check if cells is in the first column
    let adiacent = [
        cell.value + 1,
        cell.value - 1,
        cell.value + Math.sqrt(difficulty),
        cell.value + Math.sqrt(difficulty) + 1,
        cell.value + Math.sqrt(difficulty) - 1,
        cell.value - Math.sqrt(difficulty),
        cell.value - Math.sqrt(difficulty) + 1,
        cell.value - Math.sqrt(difficulty) - 1,
    ];
    return adiacent.filter(value => {
        if (value < 1 || value > difficulty) return false; //exclude the value if it is out 1 or 100 (return false ina filter that return only the true)
        if (isRightEdge && [cell.value + 1, cell.value - Math.sqrt(difficulty) + 1, cell.value + Math.sqrt(difficulty) + 1].includes(value)) {
            return false; //if the cell is on the right (checked before filter), AND the value is included in the forbidden value (rappresebted by an array of 3 value), not consider it (retunr false)
        }
        if (isLeftEdge && [cell.value - 1, cell.value - Math.sqrt(difficulty) - 1, cell.value + Math.sqrt(difficulty) - 1].includes(value)) {
            return false;
        }
        return true; //return all true value
    });
}
/**
 * This function create a modal when the match is over
 * @param {*} score 
 * @param {*} condition 
 * @returns 
 */
//^ FUNCTION MODAL END
function modalLose(score, condition) {
    const BackGroundBlack = document.createElement('div');
    BackGroundBlack.id = "hype-modal"
    BackGroundBlack.className = "position-absolute w-100 h-100 overflow-auto d-flex align-items-center justify-conentent-center";
    BackGroundBlack.style = "z-index:100; left:0; top:0; background-color: rgba(0, 0, 0, 0.4);";
    const EndBanner = document.createElement('div');
    EndBanner.className = "mx-auto d-flex align-items-center justify-content-center flex-column";
    EndBanner.style = "width:700px; height:700px;";
    EndBanner.id = `${condition}-banner`
    const EndText = document.createElement('h2');
    EndText.className = "text-white text-center";
    EndText.style = "font-size:5rem; -webkit-text-stroke: 1px black; ";
    EndText.innerHTML = `You ${condition}! <p class='fs-1'>Total Points: ${score}</p>`;
    const EndButton = document.createElement('button')
    EndButton.id = "end"
    EndButton.className = `button-53 bg-${condition === "lose" ? "danger" : "success"}`
    EndButton.innerHTML = condition === "lose" ? "Retry!" : "Play Again!"
    EndButton.addEventListener('click', () => {
        document.getElementById("hype-modal").remove()
    })
    EndBanner.append(EndText, EndButton)
    BackGroundBlack.appendChild(EndBanner);
    return BackGroundBlack
}



//! -----------------BONUS-----------------------
//TODO Dropdown menù without bootstrap javascript
//& BUTTONS
//& dropdown
const difficultyMenu = document.getElementById("drop-down-difficulty");

difficultyMenu.addEventListener('click', function () {
    document.getElementById("difficulty").classList.toggle("d-none")
})

document.querySelectorAll("#difficulty li").forEach(element => {
    element.addEventListener('click', function () {
        difficulty = element.id === "easy" ? 100 : element.id === "normal" ? 81 : 49;
        difficultyMenu.innerHTML = element.innerHTML;
        document.getElementById("difficulty").classList.toggle("d-none");
        sendButton.disabled = false;
    })
})



//! ---------- MY BONUS ----------------
//TODO Creare un titolo che quando inizia il gioco fa una animazione di rimpicciolimento

//& TITLE
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function reduction(element, start, end) {
    while (start > end) {
        await delay(10); // Aspetta 100 millisecondi
        start -= 1; // Decrementa la larghezza
        element.style.width = `${start}%`; // Applica la nuova larghezza
    }
    element.classList.add('reduction-done')
}

//& CARDS

//! -------------------- MY BONUS --------------------
//TODO Inserire all'interno delle celle i numeri in modo che mi forniscano indicazioni sul le celle vuolte attorno.
//TODO se la cella contine un numero potremo intuire il livello di rischio delle celle adiacenti.