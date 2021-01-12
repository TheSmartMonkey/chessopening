export function addMove(move) {
    const moves = document.getElementById('moves')
    moves.innerHTML += '<button class="btn btn-grey">' + move +'</button>'
}

export function clearMove() {
    const moves = document.getElementById('moves')
    moves.innerHTML = ''
}

export function logMove(move, moves) {
    if (move !== null) {
        // move['fen'] = game.fen()
        moves.push(move)
        return moves
    }
}
