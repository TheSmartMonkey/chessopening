import { Chessgame } from "./chessgame.js"

const fs = require('fs')
const path = require('path')

export class Training extends Chessgame {
    constructor(boardID) {
        super(boardID)
        this.openingPgn = ''
        this.training = []
        this.title = 'opening'
        this.color = 'white'
        this.getOpening(this.color, '')
    }

    //* Overloaded Chessboard methodes
    onDropEvent() {
        this.updateStatus()
        this._trainOpening()
        this.updateStatus()
    }

    //* Opening
    getOpening(color, title) {
        const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'))
        const json = JSON.parse(rawdata)

        if (title === '') {
            this._setOpening(json.white[0])
        } else {
            this._findOpening(json[color], title)
        }
        this._setOpeningTitle(this.title)
        this._setOpeningColor(color)
        this._setPngArea(this.openingPgn)
        this.updateOpeningColor()
    }

    _setOpening(opening) {
        const moves = this._getMovesFromPgn(opening.pgn)
        this.training = moves.map( ({ fen }) => fen)
        this.allMoves = moves.map( ({ move }) => move)
        this.title = opening.title
        this.openingPgn = opening.pgn
    }

    _findOpening(jsonColor, title) {
        for (const opening of jsonColor) {
            if (opening.title === title) {
                this._setOpening(opening)
            }
        }
    }

    _getMovesFromPgn(pgn) {
        const chess1 = new Chess()
        const chess2 = new Chess()
    
        chess1.load_pgn(pgn)
        const moves = chess1.history().map(move => {
            chess2.move(move)
            const fen = chess2.fen()
            return { fen, move }
        })
    
        return moves
    }

    _setOpeningTitle(title) {
        const opeingTitle = document.getElementById('opening-title')
        localStorage.setItem('title', title)
        opeingTitle.innerHTML = title
    }

    _setOpeningColor(color) {
        this.color = color
        localStorage.setItem('color', color)
    }

    _setPngArea(pgn) {
        const pngArea = document.getElementById('png-area')
        pngArea.innerText = pgn
    }

    //* Training
    updateOpeningColor() {
        if (this.color === 'black') {
            this.updateOrientation('black')
            this._computerMove()
        } else {
            this.updateOrientation('white')
        }
    }

    _trainOpening() {
        const playedMove = this.moves[this.currentMoveID - 1]
        const correctMove = this.training[this.currentMoveID - 1]
        const continu = this._continueTraining()

        if (continu) {
            const correct = this._verifyMove(playedMove, correctMove)

            if (correct) {
                this.resetGame()
                this._computerMove()
            } else {
                this.resetAll()
                this.updatePosition('start')
                this.updateOpeningColor()
            }

        } else {
            this.resetAll()
            this.updatePosition('start')
            this.updateOpeningColor()
        }

        this._displayCorrectMessage(playedMove, correctMove, continu)
    }

    _verifyMove(playedMove, correctMove) {
        if (playedMove === correctMove) {
            return true
        } else {
            return false
        }
    }

    _computerMove() {
        const computerMove = this.training[this.currentMoveID]
        this.moves.push(computerMove)
        this.currentMoveID++
        this.updatePosition(computerMove)
    }

    _continueTraining() {
        let movesLength = this.moves.length
        let trainingLength = this.training.length
        const endNumber = this.training.length % 2 == 0
        if (this.color === 'black' && !endNumber) {
            trainingLength--
        }

        if (this.color === 'white' && endNumber) {
            trainingLength--
        }

        if (movesLength === trainingLength) {
            return false
        } else {
            return true
        }
    }

    _displayCorrectMessage(playedMove, correctMove, continu) {
        const moveStatus = document.getElementById('move-status')

        if (!continu) {
            console.log('CONGRATULATION')
            moveStatus.className = 'action correct'
            moveStatus.innerHTML = 'CONGRATULATION'
        } else if (playedMove === correctMove) {
            moveStatus.className = 'action correct'
            moveStatus.innerHTML = 'CORRECT'
        } else {
            moveStatus.className = 'action not-correct'
            moveStatus.innerHTML = 'NOT CORRECT'
        }
    }

    //* Board Status
    resetAll() {
        const moveStatus = document.getElementById('move-status')
        this.resetGame()
        this.removeAllHighlightMoves()

        // Reset Moves
        this.allMoves = []
        this.moves = []
        this.currentMoveID = 0

        // Reset training message
        moveStatus.className = 'action'
        moveStatus.innerHTML = 'PLAY A MOVE'

        // Reset config
        this.config.position = 'start'
        this.updateBoard()
    }
}
