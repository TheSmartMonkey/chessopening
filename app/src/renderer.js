import { addMove, clearMove, logMove } from "./js/moves.js";

//* Init variables
var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var moves = []

//* Chess board logic
export function onDragStart(source, piece, position, orientation) {
    // Do not pick up pieces if the game is over
    if (game.game_over()) return false

    // Only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
}

export function onDrop(source, target) {
    // See if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: Always promote to a queen for example simplicity
    })

    // Illegal move
    if (move === null) return 'snapback'

    // Moves positions
    moves = logMove(move, moves)
    addMove(move.san)

    updateStatus()
}

// Update the board position after the piece snap
// For castling, en passant, pawn promotion
export function onSnapEnd() {
    board.position(game.fen())
}

export function updateStatus() {
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

//* On click
$('#start-position').on("click", function () {
    board = null
    game = new Chess()
    $status = $('#status')
    $fen = $('#fen')
    $pgn = $('#pgn')
    board = Chessboard('board', config)
    updateStatus()
    clearMove()
});

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
