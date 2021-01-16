import { addAllMoves, clearMove, logMove, getOpeningMoves, verifyMove } from "./moves.js";

//* Init variables
var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var moves = []
var training = getOpeningMoves()
var currentMoveID = -1

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
    clearMove()
    addAllMoves(moves)
    currentMoveID = currentMoveID + 1

    // Training
    updateStatus()
    trainOpening()

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

//* Reset Board
function resetGame() {
    board = null
    game = new Chess()
    $status = $('#status')
    $fen = $('#fen')
    $pgn = $('#pgn')
}

function updateBoard() {
    game.load(config.position)
    board = Chessboard('board', config)
    updateStatus()
    clearMove()
    addAllMoves(moves)
}

//* Training
function trainOpening() {
    if (training.length > moves.length + 2) {
        const correct = verifyMove(training[currentMoveID], training, moves, currentMoveID)
        resetGame()
        if (correct) {
            currentMoveID++
            const nextMove = training[currentMoveID]
            config.position = nextMove.fen
            game.load(config.position)
            board = Chessboard('board', config)
        } else {
            moves = []
            currentMoveID = -1
            config.position = 'start'
            updateBoard()
        }
    } else {
        const moveStatus = document.getElementById('move-status')
        moveStatus.className = 'action correct'
        moveStatus.innerHTML = 'CONGRATULATION'
        resetGame()
        moves = []
        currentMoveID = -1
        config.position = 'start'
        updateBoard()
    }
};

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
$('#reset').on("click", function () {
    const moveStatus = document.getElementById('move-status')
    resetGame()

    // Reset Moves
    moves = []
    currentMoveID = -1

    // Reset training message
    moveStatus.innerHTML = ''

    // Reset config
    config.position = 'start'
    updateBoard()
});