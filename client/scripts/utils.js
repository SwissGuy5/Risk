const defaultHeaders = {
    'content-type': 'application/json'
};
async function fetchServer(path, bodyObj, headers = defaultHeaders) {
    const res = await fetch(path, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyObj)
    });
    const data = await res.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

/**
 * Returns a random number between 0 and specified number
 * @param {number} num Not included
 * @returns {number} Num between 0 and specified number
 */
function randInt(num) {
    return Math.floor(Math.random() * num);
}

// Shuffles an array
function shuffleArray(array) {
    let counter = 0;
    let newArray = [];
    for (let i = array.length; i > 0; i--) {
        let randNum = this.randInt(array.length);
        newArray.push(array[randNum]);
        array.splice(randNum, 1);
        counter++;
    }
    return newArray;
}

function promptInt(message) {
    return Math.floor(Number(prompt(message)));
}