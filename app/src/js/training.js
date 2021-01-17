import { Chessgame } from "./chessgame.js";
const fs = require('fs');
const path = require('path');

class Training extends Chessgame {
    constructor(boardID) {
        super(boardID)
        this.training = this.getOpeningMoves()
    }

    getOpeningMoves() {
        const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'));
        const jsonMoves = JSON.parse(rawdata).white[0].moves;
        return jsonMoves
    }

    verifyMove(correctMove) {
        const moveStatus = document.getElementById('move-status')
        let playedMove = ''
        if (this.currentMoveID == 0) {
            playedMove = this.moves[this.currentMoveID].fen
        } else {
            playedMove = this.moves[this.currentMoveID - 1].fen
        }

        if (this.moves.length > this.training.length - 1) {
            moveStatus.className = 'action correct'
            moveStatus.innerHTML = 'CONGRATULATION'
        } else if (playedMove == correctMove.fen) {
            moveStatus.className = 'action correct'
            moveStatus.innerHTML = 'CORRECT'
            return true
        } else {
            moveStatus.className = 'action not-correct'
            moveStatus.innerHTML = 'NOT CORRECT'
        }
        return false
    }

    // TODO: refactor
    trainOpening() {
        if (this.training.length > this.moves.length + 2) {
            const correct = this.verifyMove(this.training[this.currentMoveID])
            this.resetGame()
            if (correct) {
                this.currentMoveID++
                const nextMove = this.training[this.currentMoveID]
                this.config.position = nextMove.fen
                this.game.load(this.config.position)
                this.board = Chessboard('board', this.config)
            } else {
                this.moves = []
                this.currentMoveID = -1
                this.config.position = 'start'
                this.updateBoard()
            }
        } else {
            const moveStatus = document.getElementById('move-status')
            moveStatus.className = 'action correct'
            moveStatus.innerHTML = 'CONGRATULATION'
            this.resetGame()
            this.moves = []
            this.currentMoveID = -1
            this.config.position = 'start'
            this.updateBoard()
        }
    }

    onDropEvent() {
        this.updateStatus()
        this.trainOpening()
        this.updateStatus()
    }
}

var t = new Training('board')
t.updateStatus()


// //* On click
// function resetAll() {
//     const moveStatus = document.getElementById('move-status')
//     resetGame()

//     // Reset Moves
//     moves = []
//     currentMoveID = -1

//     // Reset training message
//     moveStatus.innerHTML = ''

//     // Reset config
//     config.position = 'start'
//     updateBoard()
// }

// $('#reset').on("click", function () {
//     resetAll()
// });

// $('#opening-explorer').on("click", function () {
//     resetAll()
//     // TODO: localstorage onload opening
//     // config.position = localStorage
// });
