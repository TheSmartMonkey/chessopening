// Chessgame creates a board of chess
export class Chessgame {
    constructor(boardID) {
        // Chessboard
        this.config = {
            orientation: 'white',
            draggable: true,
            position: 'start',
            onDragStart: this.onDragStart.bind(this),
            onDrop: this.onDrop.bind(this),
            onSnapEnd: this.onSnapEnd.bind(this)
        }
        this.board = Chessboard(boardID, this.config)
        this.game = new Chess()

        // get elements
        this.$status = $('#status')
        this.$fen = $('#fen')
        this.$pgn = $('#pgn')
        this.$board = $('#board')

        // Moves
        this.moves = []
        this.allMoves = []
        this.currentMoveID = 0
        
        // Opening
        this.openingPgn = ''
        this.training = []
        this.title = 'opening'
        this.color = 'white'
    }

    //* Chess board native logic
    // eslint-disable-next-line no-unused-vars
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
        this.addAllMoves()
        this.currentMoveID++

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

    updatePosition(fen) {
        if (fen) {
            this.config.position = fen
            this.game.load(this.config.position)
            this.board = Chessboard('board', this.config)
        } else {
            this.resetGame()
        }
        this.updateBoard()
    }

    updateOrientation(color) {
        this.config.orientation = color
        this.game.load(this.config.orientation)
        this.board = Chessboard('board', this.config)
        this.updateBoard()
    }

    //* Moves
    addAllMoves() {
        this.clearMove()
        const movesDiv = document.getElementById('moves')
        let moves = [...this.allMoves]
        moves = moves.splice(0, this.currentMoveID)
        for (const move of moves) {
            movesDiv.innerHTML += '<button class="btn1 btn1-grey">' + move + '</button>'
        }
    }   

    clearMove() {
        const movesDiv = document.getElementById('moves')
        movesDiv.innerHTML = ''
    }

    logMove(move) {
        if (move) {
            move['fen'] = this.game.fen()
            this.moves.push(move['fen'])
        }
    }

    giveTip() {
        const lastMoveID = this.currentMoveID ? this.currentMoveID : 0
        this._removeAllHighlightMoves()
        this._highlightMove(this._getMovesPosition(lastMoveID))
    }

    _highlightMove(position) {
        this.$board.find('.square-' + position).addClass('highlight-white')
    }

    _removeAllHighlightMoves() {
        this.$board.find('.square-55d63').removeClass('highlight-white')
    }

    _getMovesPosition(moveID) {
        const moves = []
        for (const move of this.allMoves) {
            if (move === 'O-O-O' || move === 'O-O') {
                moves.push(this.color === 'black' ? 'e8' : 'e1')
            } else {
                const newMove = move.substr(move.length - 2);
                moves.push(newMove)
            }
        }
        return moves[moveID]
    }

    //* Board Status
    resetGame() {
        this.board = null
        this.game = new Chess()
    }

    updateBoard() {
        this.game.load(this.config.position)
        this.board = Chessboard('board', this.config)
        this.updateStatus()
        this.clearMove()
        this.addAllMoves()
    }
}
