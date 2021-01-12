import { addMove, addAllMoves, clearMove, logMove } from "./js/moves.js";

//* Init variables
var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var moves = []
var currentMoveID = 0

//* Chess board logic
function onDragStart(source, piece, position, orientation) {
    // Do not pick up pieces if the game is over
    if (game.game_over()) return false

    // Only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
}

function onDrop(source, target) {
    // See if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: Always promote to a queen for example simplicity
    })

    // Illegal move
    if (move === null) return 'snapback'

    // Moves positions
    moves = logMove(game, move, moves)
    addMove(move)
    currentMoveID = moves.length - 1

    updateStatus()
}

// Update the board position after the piece snap
// For castling, en passant, pawn promotion
function onSnapEnd() {
    board.position(game.fen())
}

function updateStatus() {
    var status = ''

    var moveColor = 'White'
    if (game.turn() === 'b') {
        moveColor = 'Black'
    }

    // Checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // Draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position'
    }

    // Game still on
    else {
        status = moveColor + ' to move'

        // Check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check'
        }
    }

    $status.html(status)
    $fen.html(game.fen())
    $pgn.html(game.pgn())
}

//* Set chess board
var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}

board = Chessboard('board', config)
updateStatus()

//* On click
function resetVariables() {
    board = null
    game = new Chess()
    $status = $('#status')
    $fen = $('#fen')
    $pgn = $('#pgn')
    moves = []
    currentMoveID = 0
}

$('#start-position').on("click", function () {
    resetVariables()
    board = Chessboard('board', config)
    updateStatus()
    clearMove()
});

$('#back').on("click", function () {
    // Store moves
    const m = moves
    const id = currentMoveID
    resetVariables()

    if (id < 1) {
        currentMoveID = id
        config.position = 'start'
    } else {
        m.pop()
        moves = m
        currentMoveID = id - 1
        config.position = m[currentMoveID].fen
        game.load(config.position)
    }

    board = Chessboard('board', config)
    updateStatus()
    clearMove()
    addAllMoves(moves)
});
