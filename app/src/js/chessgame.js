// Chessgame creates a board of chess
export class Chessgame {
    constructor(boardID) {
        this.config = {
            draggable: true,
            position: 'start',
            onDragStart: this.onDragStart.bind(this),
            onDrop: this.onDrop.bind(this),
            onSnapEnd: this.onSnapEnd.bind(this)
        }
        this.board = Chessboard(boardID, this.config)
        this.game = new Chess()
        this.$status = $('#status')
        this.$fen = $('#fen')
        this.$pgn = $('#pgn')
        this.moves = []
        this.currentMoveID = -1
    }

    //* Chess board logic
    onDragStart(source, piece, position, orientation) {
        // Do not pick up pieces if the game is over
        if (this.game.game_over()) return false

        // Only pick up pieces for the side to move
        if ((this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false
        }
    }

    onDrop(source, target) {
        // See if the move is legal
        var move = this.game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: Always promote to a queen for example simplicity
        })

        // Illegal move
        if (move === null) return 'snapback'

        // Moves positions
        this.logMove(move)
        this.clearMove()
        this.addAllMoves()
        this.currentMoveID = this.currentMoveID + 1

        // Call this function to add logic onDrop
        this.onDropEvent()
    }

    onDropEvent() {
        this.updateStatus()
    }

    // Update the board position after the piece snap
    // For castling, en passant, pawn promotion
    onSnapEnd() {
        this.board.position(this.game.fen())
    }

    updateStatus() {
        var status = ''

        var moveColor = 'White'
        if (this.game.turn() === 'b') {
            moveColor = 'Black'
        }

        // Checkmate?
        if (this.game.in_checkmate()) {
            status = 'Game over, ' + moveColor + ' is in checkmate.'
        }

        // Draw?
        else if (this.game.in_draw()) {
            status = 'Game over, drawn position'
        }

        // Game still on
        else {
            status = moveColor + ' to move'

            // Check?
            if (this.game.in_check()) {
                status += ', ' + moveColor + ' is in check'
            }
        }

        this.$status.html(status)
        this.$fen.html(this.game.fen())
        this.$pgn.html(this.game.pgn())
    }

    //* Moves
    addAllMoves() {
        const movesDiv = document.getElementById('moves')
        for (const move of this.moves) {
            movesDiv.innerHTML += '<button class="btn1 btn1-grey">' + move.san +'</button>'
        }
    }

    clearMove() {
        const movesDiv = document.getElementById('moves')
        movesDiv.innerHTML = ''
    }

    logMove(move) {
        if (move !== null) {
            const moveFen = this.game.fen()
            this.moves.push(moveFen)
        }
    }

    //* Reset Board
    resetGame() {
        this.board = null
        this.game = new Chess()
        this.$status = $('#status')
        this.$fen = $('#fen')
        this.$pgn = $('#pgn')
    }

    updateBoard() {
        this.game.load(this.config.position)
        this.board = Chessboard('board', this.config)
        this.updateStatus()
        this.clearMove()
        this.addAllMoves()
    }
}
