

// console.log(Document.prototype); show all document properties and method
/*
& Purple Comment
! Red Comment
^ Yellow Comment
? Blue Comment
* Green Comment
~ Violet Comment
TODO Orange Comment
*/

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getRandomUniqueInteger(numberOfElements, min, max, startingArray) {

    let array = Array.isArray(startingArray) ? startingArray : [];
    let duplicateCount = 0;
    array.forEach(element => {
        element <= max && element >= min ? duplicateCount++ : ""
    });

    numberOfElements = parseInt(numberOfElements)
    if (numberOfElements > max - min + 1 || isNaN(numberOfElements)) {
        console.error(`Number of elements(${numberOfElements}) in the function getRandomUniqueInteger must be equal or lower than difference before max value and min value +1 (${max - min + 1}) or must be a valid Number`);
        return [];
    } else if (numberOfElements > max - min + 1 - duplicateCount) {
        console.error(`The array [${startingArray}] already has some elements in your field between max(${max}) and min(${min}). The number of elements must be adjusted to compensate that. (number of elements(${numberOfElements}) must be smaller than ${max - min + 1 - duplicateCount})`);
        return [];
    }

    for (let i = 0; i < numberOfElements; i++) {
        let newNumber;
        do {
            newNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (array.includes(newNumber)) {
            array.push(newNumber)
        }
    }
    return array;
}

function isaN(value) {
    return !isNaN(value)
}

function addClass(element, value) {
    value = String(value);
    if (Array.isArray(element)) {
        for (let i = 0; i < element.length; i++) {
            element[i].classList.add(value)
        }
    } else {
        element.classList.add(value)
    }
}