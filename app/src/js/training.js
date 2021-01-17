import { Chessgame } from "./chessgame.js";

const fs = require('fs');
const path = require('path');

class Training extends Chessgame {
    constructor(boardID) {
        super(boardID)
        this.openingPgn = ''
        this.training = []
        this.title = 'opening'
        this.getOpening('white', '')
    }

    getOpening(color, title) {
        const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'))
        let json = JSON.parse(rawdata)

        if (title === '') {
            this.training = json.white[0].moves
            this.title = json.white[0].title
            this.openingPgn = json.white[0].pgn
        } else {
            for (const opening of json[color]) {
                if (opening.title === title) {
                    this.training = opening.moves
                    this.title = opening.title
                    this.openingPgn = opening.pgn
                }
            }
        }
        localStorage.setItem('color', color)
        this.setOpeningTitle(this.title)
        this.setPngArea(this.openingPgn)
    }

    setOpeningTitle(title) {
        const opeingTitle = document.getElementById('opening-title')
        localStorage.setItem('title', title)
        opeingTitle.innerHTML = title
    }

    setPngArea(pgn) {
        const pngArea = document.getElementById('png-area')
        pngArea.innerText = pgn
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
        } else if (playedMove == correctMove) {
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
                this.config.position = nextMove
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

    resetAll() {
        const moveStatus = document.getElementById('move-status')
        this.resetGame()

        // Reset Moves
        this.moves = []
        this.currentMoveID = -1

        // Reset training message
        moveStatus.innerHTML = ''

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
