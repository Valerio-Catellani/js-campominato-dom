
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


sendButton.addEventListener('click', function () {
    document.getElementById("wrapper") ? document.getElementById("wrapper").remove() : ""; //rimuovi il wrapper se esiste già
    title.classList.contains('reduction-done') ? '' : reduction(title, 75, 30);
    const wrapper = document.createElement('div'); //creo il wrapper
    wrapper.setAttribute("id", "wrapper");           // setto i suoi attributi
    wrapper.classList = "d-flex flex-wrap";  //e classi
    const arrayBomb = getRandomUniqueInteger(bombs, 1, difficulty) //creo l'array delle bombe
    // console.log(arrayBomb);
    for (let i = 0; i < difficulty; i++) {
        const zone = document.createElement('div'); //creo le zone
        zone.setAttribute('id', `zone-${i + 1}`); //setto l'id delle zone
        zone.className = `box-${difficulty} box zone is-flipped text-white`; //setto le classi delle zone
        //let backCell = createCell(`mistery-${i + 1}`, "?", difficulty); riferimento all'index
        const backCell = createCell(i + 1, cellContent(i + 1, arrayBomb), difficulty, "back"); //creo il retro delle cell
        backCell.classList.add('back'); //assegno la clsse "back" al retro delle cell"
        const frontCell = createCell(i + 1, cellContent(i + 1, arrayBomb), difficulty, "front"); //creo le celle passando un semplice funzione di comparazione.
        frontCell.classList.add('front')
        zone.appendChild(backCell);
        zone.appendChild(frontCell)
        zone.addEventListener('click', function () {
            this.classList.remove("is-flipped"); //gira la zona e rivela il cotenuto
            this.childNodes.forEach(element => {
                element.classList.add("selected")
            })
        })
        wrapper.appendChild(zone)
    }
    response.append(wrapper)
})


//^ FUNCTION: CREATECELL
function createCell(cardIndex, content, difficulty, cardClass) {
    let cell = document.createElement('div');
    //cell.setAttribute("id", `box-${cardIndex}`);
    cell.className = `box-${difficulty} box d-flex justify-content-center align-items-center`;
    cell.value = content.alt ?? true    //qui sto fornendo un value alle celle in modo che sia "bomb", valore che corrisponde all'alt del png delle immagini. se non c'è utilizzo un opratore di coalescenza nullo che mi restituisce true. NB il content è attulamente un elemento dom img
    cardClass === "back" ? cell.innerHTML = "?" : cell.append(content) //qui invece faccio in modo che il contenuto delle celle vari a seconda che siano il fronte o il retro. Inoltre se il retro è una bomba abbiamo una img, altrimenti un semplice contenitore vuoto
    cell.addEventListener('click', () => {
        cardClass === "back" ? updateResults(cell) : ""  //solo le celle non acora girate possono girare e aggiunrare il punteggio
    });

    return cell
}



//^ FUNCTION: CREATE RANDOM ARRAY OF UNIQUE NUMBERS 
function getRandomUniqueInteger(numberOfElements, min, max, startingArray) {

    let array = Array.isArray(startingArray) ? startingArray : []; //Controllo se l'array è stato inserito oppure nom in tal caso lo imposto a vuoto

    let duplicateCount = 0;
    array.forEach(element => {
        element <= max && element >= min ? duplicateCount++ : ""
    }); //nel caso in cui abbia passato un array con degli elementi, controllo quanti di questi elementi siano già inclusi tra i valori min e max

    numberOfElements = parseInt(numberOfElements)
    if (numberOfElements > max - min + 1 || isNaN(numberOfElements)) {
        console.error(`Number of elements(${numberOfElements}) in the function getRandomUniqueInteger must be equal or lower than difference before max value and min value +1 (${max - min + 1}) or must be a valid Number`);
        return []; //se ho passato troppi elementi richiesti rispetto al campo (max - min +1) entrerei in un loop quindi blocco subito la funzione
    } else if (numberOfElements > max - min + 1 - duplicateCount) {
        console.error(`The array [${startingArray}] already has some elements in your field between max(${max}) and min(${min}). The number of elements must be adjusted to compensate that. (number of elements(${numberOfElements}) must be smaller than ${max - min + 1 - duplicateCount})`);
        return []; //se ho passato troppi elementi rispetto al campo e a quelli eventualmente già contenuti nel mio array blocco subito la funzione
    }

    for (let i = 0; i < numberOfElements; i++) {
        let newNumber;
        do {
            newNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (array.includes(newNumber)) {
            array.push(newNumber)
        } //semplice ciclo do while che prima ci genera un numero, poi controlla che esso sia presente o meno nell'array. Se non è presento pusha, altrimenti ricomincia il ciclo con un nuovo numero (riprendendo il do) finchè non trova un numero che soddisfi il while. Quando lo trovo procedo con un nuovo ciclo for. 
    }
    return array;
}


//^ FUNCTION: PASSED CONTENT
function cellContent(value, arrayToCheck) {
    if (arrayToCheck.includes(value)) {
        const BombImg = document.createElement('img')
        BombImg.src = "resources/img/Bomba.png";
        BombImg.className = "img-fluid "
        BombImg.alt = "bomb"
        return BombImg
    } else {
        const emptyDiv = document.createElement('div')
        return emptyDiv
    }
}


//^ FUNCTION AGGIORNA PUNTEGGIO

function updateResults(element) {
    if (element.value === "bomb") {
        document.querySelectorAll("div[id^='zone']").forEach(element => {
            element.classList.remove("is-flipped")
        })
        alert(`Hai perso con un punteggio di ${score}`)
    } else if (score === difficulty - bombs) {
        alert("HAI VINTO!!!!")
    }
    else {
        score++;
        console.log(`+1 punto! Hai clikkato su una casella sicura. (punteggio attuale ${score})`);
    }
}



//! -----------------BONUS-----------------------
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




