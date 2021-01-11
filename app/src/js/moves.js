export function addMove(move) {
    const moves = document.getElementById('moves')
    moves.innerHTML += '<button class="btn btn-grey">' + move +'</button>'
}

export function clearMove() {
    const moves = document.getElementById('moves')
    moves.innerHTML = ''
}
