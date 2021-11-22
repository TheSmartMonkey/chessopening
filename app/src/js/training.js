import { Chessgame } from "./chessgame.js"

export class Training extends Chessgame {
    constructor(boardID) {
        super(boardID)
        this.openingPgn = ''
        this.mode = 'training'
        this.selectTrainingMode(this.mode)
        this.initTraining()
        this.training = []
        this.previousPuzzle = 0
        this.title = 'opening'
        this.color = 'white'
    }

    initTraining() {
        this.resetAll()
        switch (this.mode) {
            case 'training':
                this._setupTrainingOrientation()
                break;
            case 'puzzle':
                if (this.training.length < 8) {
                    this._displayMessage('action not-correct flex-center', 'OPENING IS TO SMALL TO PLAY PUZZLE')
                } else {
                    this.updateOrientation(this.color)
                    this._computerRandomMove()
                }
                break;
            default:
                this._setupTrainingOrientation()
                break;
        }
    }

    //* Overloaded Chessboard methodes
    onDropEvent() {
        this._setDropEventTraining()
        this.updateStatus()
    }

    _setDropEventTraining() {
        switch (this.mode) {
            case 'training':
                this._trainOpening()
                break;
            case 'puzzle':
                if (this.training.length < 8) {
                    this._displayMessage('action not-correct flex-center', 'OPENING IS TO SMALL TO PLAY PUZZLE')
                } else {
                    this._puzzleOpening()
                }
                break;
            default:
                this._trainOpening()
                break;
        }
    }

    //* Opening
    getOpening(json, color, title) {
        title === '' ? this._setOpening(json.white[0]) : this._findOpening(json[color], title)
        this._setOpeningTitle(this.title)
        this._setOpeningColor(color)
        this._setPngArea(this.openingPgn)
        this._setupTrainingOrientation()
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
    _setupTrainingOrientation() {
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
            this._setupTrainingOrientation()
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
            this._displayMessage('action correct flex-center', 'CONGRATULATION')
        } else if (moveCorrect) {
            this._displayMessage('action correct flex-center', 'CORRECT')
        } else {
            this._displayMessage('action not-correct flex-center', 'NOT CORRECT')
        }
    }

    //* Puzzle
    _puzzleOpening() {
        const moveCorrect = this.moves[0] === this.training[this.currentMoveID - 1]
        const continu = this._continueTraining()

        if (continu && moveCorrect) {
            this.previousPuzzle = this.currentMoveID
            this._computerRandomMove()
        } else {
            this._stayAtCurrentPosition()
        }

        this._displayCorrectMessage(moveCorrect, continu)
    }

    _computerRandomMove() {
        this.resetAll()
        this.currentMoveID = this._randomNumberByColor()
        this._setPlayableMoves()
        this.updatePosition(this.training[this.currentMoveID])
        this.currentMoveID++
    }

    _setPlayableMoves() {
        while (this.currentMoveID === this.training.length - 1
            || this.currentMoveID === this.training.length - 2 
            || this.currentMoveID === 0 
            || this.currentMoveID === 1
            || this.currentMoveID === this.previousPuzzle
        ) this.currentMoveID = this._randomNumberByColor()
    }

    _randomNumberByColor() {
        const colorCondition = this.color === 'black' ? 1 : 0;
        let random = Math.floor(Math.random() * this.training.length)
        while (random % 2 === colorCondition) {
            random = Math.floor(Math.random() * this.training.length)
        }
        return random
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

    selectTrainingMode(mode) {
        this.resetAll()
        this.mode = mode
        const trainingButton = document.getElementById('training-mode')
        const puzzleButton = document.getElementById('puzzle-mode')

        switch (mode) {
            case 'training':
                trainingButton.className = 'btn2 btn2-green'
                puzzleButton.className = 'btn2 btn2-grey'
                break;
            case 'puzzle':
                trainingButton.className = 'btn2 btn2-grey'
                puzzleButton.className = 'btn2 btn2-green'
                break;
            default:
                trainingButton.className = 'btn2 btn2-green'
                puzzleButton.className = 'btn2 btn2-grey'
                break;
        }
    }

    _displayMessage(className, message) {
        const moveStatus = document.getElementById('move-status')
        moveStatus.className = className
        moveStatus.innerHTML = message
    }
}
