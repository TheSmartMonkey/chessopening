//* Position list
export function addAllMoves(moves) {
    const movesDiv = document.getElementById('moves')
    for (const move of moves) {
        movesDiv.innerHTML += '<button class="btn btn-grey">' + move.san +'</button>'
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

//* Go to next move buttons
export function nextMove(game, currentMoveID, moves) {
    game.load(moves[currentMoveID + 1])
}

export function previousMove(game, currentMoveID, moves) {
    game.load(moves[currentMoveID - 1])
    console.log('moves: ', moves);
    console.log('TEST: ', moves[currentMoveID - 1]);
}

// export function fistrMove(game) {
//     game.start
// }

// export function lastMove() {
    
// }
