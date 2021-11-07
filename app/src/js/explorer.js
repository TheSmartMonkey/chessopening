const fs = require('fs')
const path = require('path')

function addOpenings(color) {
    const explorer = document.getElementById('explorer-' + color)
    const openings = _getOpenings(color)
    let openingLink = ''

    for (const opening of openings) {
        openingLink = '<a class="opening-link"' + 
            'onclick="localStorage.setItem(\'title\', \'' + opening + '\');' +
            'localStorage.setItem(\'color\', \'' + color + '\')"' +
            ' href="#">' + opening + '</a><br>'
        explorer.innerHTML += openingLink
    }
}

function _getOpenings(color) {
    const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'))
    const json = JSON.parse(rawdata)
    let openings = []

    for (const opening of json[color]) {
        openings.push(opening.title)
    }

    return openings
}

addOpenings('white')
addOpenings('black')
