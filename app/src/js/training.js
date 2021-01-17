import { Chessgame } from "./chessgame.js";

const fs = require('fs');
const path = require('path');

class Training extends Chessgame {
    constructor(boardID) {
        super(boardID)
        this.openingPgn = ''
        this.training = []
        this.title = 'opening'
        this.color = 'white'
        this.getOpening(this.color, '')
    }

    getOpening(color, title) {
        const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'))
        let json = JSON.parse(rawdata)

        if (title === '') {
            // Take 1st white opening by default
            this.setOpening(json.white[0])
        } else {
            // Find opening
            for (const opening of json[color]) {
                if (opening.title === title) {
                    this.setOpening(opening)
                }
            }
        }
        this.setOpeningTitle(this.title)
        this.setOpeningColor(color)
        this.setPngArea(this.openingPgn)
        this.updateOpeningColor()
    }

    setOpening(opening) {
        this.training = opening.moves
        this.title = opening.title
        this.openingPgn = opening.pgn
    }

    setOpeningTitle(title) {
        const opeingTitle = document.getElementById('opening-title')
        localStorage.setItem('title', title)
        opeingTitle.innerHTML = title
    }

    setOpeningColor(color) {
        this.color = color
        localStorage.setItem('color', color)
    }

    setPngArea(pgn) {
        const pngArea = document.getElementById('png-area')
        pngArea.innerText = pgn
    }

    //* Training
    updateOpeningColor() {
        if (this.color === 'black') {
            this.updateOrientation('black')
            this.computerMove()
        }
    }

    // verifyStartingMove() {
    //     if (this.currentMoveID === 0) {
    //         playedMove = this.moves[this.currentMoveID]
    //     } else {
    //         playedMove = this.moves[this.currentMoveID - 2]
    //     }
    // }

    verifyMove(playedMove, correctMove) {
        if (playedMove === correctMove) {
            return true
        } else {
            return false
        }
    }

    continueTraining() {
        if (this.moves.length === this.training.length) {
            return false
        } else {
            return true
        }
    }

    displayCorrectMessage(playedMove, correctMove) {
        const moveStatus = document.getElementById('move-status')

        if (!this.continueTraining()) {
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

    computerMove() {
        const computerMove = this.training[this.currentMoveID]
        this.moves.push(computerMove)
        this.currentMoveID++
        this.updatePosition(computerMove)
    }

    trainOpening() {
        const playedMove = this.moves[this.currentMoveID - 1]
        const correctMove = this.training[this.currentMoveID - 1]
        console.log('playedMove: ', playedMove);
        console.log('correctMove: ', correctMove);

        if (this.continueTraining()) {
            const correct = this.verifyMove(playedMove, correctMove)
            console.log('correct: ', correct);
            this.resetGame()

            if (correct) {
                this.computerMove()
            } else {
                this.resetAll()
                this.updatePosition('start')
            }

        } else {
            this.resetAll()
            this.updatePosition('start')
        }

        this.displayCorrectMessage(playedMove, correctMove)
    }

    onDropEvent() {
        this.updateStatus()
        this.trainOpening()
        this.updateStatus()
    }

    //* Reset Board
    resetAll() {
        const moveStatus = document.getElementById('move-status')
        this.resetGame()

        // Reset Moves
        this.myMoves = []
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

var t = new Training('board')
t.updateStatus()


//* On click events
$('#reset').on("click", function () {
    t.resetAll()
});

$('#delete').on("click", function () {
    t.resetAll()
    
    // Delete opening
    const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'));
    let json = JSON.parse(rawdata)
    const color = localStorage.getItem('color')
    let inc = 0

    console.log('TEST: ', json[color]);
    for (const opening of json[color]) {
        if (opening.title === t.title) {
            json[color].splice(inc, 1)
        }
        inc++
    }

    fs.writeFile(path.resolve(__dirname, 'openings.json'), JSON.stringify(json), 'utf8', function readFileCallback(err){
        if (err){
            console.log(err)
        }
    })
    document.location.reload()
});

$('.explorer').on("click", function (event) {
    t.resetAll()
    t.getOpening(localStorage.getItem('color'), localStorage.getItem('title'))
    t.updateStatus()
    event.stopPropagation();
    event.stopImmediatePropagation();
});
