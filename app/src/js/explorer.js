const fs = require('fs');
const path = require('path');

function getOpenings(color) {
    const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'))
    const json = JSON.parse(rawdata)
    let openings = []

    for (const opening of json[color]) {
        openings.push(opening.title)
    }

    return openings
}

function addOpenings(color) {
    const explorer = document.getElementById('explorer-' + color)
    const openings = getOpenings(color)
    for (const opening of openings) {
        explorer.innerHTML += '<a class="opening-link" href="#">' + opening + '</a><br>'
    }
}

addOpenings('white')
addOpenings('black')
