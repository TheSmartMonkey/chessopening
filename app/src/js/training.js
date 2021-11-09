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

    _createOpeningFile() {
        
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
        const moveCorrect = this._isMoveCorrect()
        const continu = this._continueTraining()

        if (continu && moveCorrect) {
            this._computerMove()
        } else if (!moveCorrect) {
            this._stayAtCurrentPosition()
        } else {
            this.resetAll()
            this.updatePosition('start')
            this.updateOpeningColor()
        }

        this._displayCorrectMessage(moveCorrect, continu)
    }

    _isMoveCorrect() {
        return this.moves[this.currentMoveID - 1] === this.training[this.currentMoveID - 1]
    }

    _computerMove() {
        const computerMove = this.training[this.currentMoveID]
        this.moves.push(computerMove)
        this.currentMoveID++
        this.updatePosition(computerMove)
    }

    _stayAtCurrentPosition() {
        this.moves.pop()
        this.currentMoveID--
        const previousMove = this.training[this.currentMoveID - 1]
        this.updatePosition(previousMove)
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

        return movesLength === trainingLength ? false : true
    }

    _displayCorrectMessage(moveCorrect, continu) {
        if (moveCorrect && !continu) {
            this._displayMessage('action correct', 'CONGRATULATION')
        } else if (moveCorrect) {
            this._displayMessage('action correct', 'CORRECT')
        } else {
            this._displayMessage('action not-correct', 'NOT CORRECT')
        }
    }

    //* Board Status
    resetAll() {
        this.resetGame()
        this._removeAllHighlightMoves()

        // Reset Moves
        this.moves = []
        this.currentMoveID = 0

        // Reset training message
        this._displayMessage('action', 'PLAY A MOVE')

        // Reset config
        this.config.position = 'start'
        this.updateBoard()
    }

    _displayMessage(className, message) {
        const moveStatus = document.getElementById('move-status')
        moveStatus.className = className
        moveStatus.innerHTML = message
    }
}
