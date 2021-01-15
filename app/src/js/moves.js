const fs = require('fs');
const path = require('path');

//* Position list
export function addAllMoves(moves) {
    const movesDiv = document.getElementById('moves')
    for (const move of moves) {
        movesDiv.innerHTML += '<button class="btn1 btn1-grey">' + move.san +'</button>'
    }
}

export function clearMove() {
    const moves = document.getElementById('moves')
    moves.innerHTML = ''
}

export function logMove(game, move, moves) {
    if (move !== null) {
        move['fen'] = game.fen()
        moves.push(move)
        return moves
    }
}

//* Training
export function getOpeningMoves() {
    const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'));
    const moves = JSON.parse(rawdata).white[0].moves;
    return moves
}
