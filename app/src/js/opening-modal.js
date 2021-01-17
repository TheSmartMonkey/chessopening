const fs = require('fs');
const path = require('path');

function dumpOpening(title, color, moves) {
    const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'));
    let json = JSON.parse(rawdata)
    json[color].push({
        'title': title,
        'moves': moves
    })

    fs.writeFile(path.resolve(__dirname, 'openings.json'), JSON.stringify(json), 'utf8', function readFileCallback(err){
        if (err){
            const errorPgn = document.getElementById('error-pgn')
            errorPgn.innerHTML = 'PGN wrong format'
            console.log(err)
        }
    })
}

function getFenFromPgn(pgn) {
    const chess1 = new Chess();
    const chess2 = new Chess();

    chess1.load_pgn(pgn);
    let moves = chess1.history().map(move => {
        chess2.move(move);
        return chess2.fen();
    });

    return moves
}

function verifyFormTitle(title) {
    const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'))
    const json = JSON.parse(rawdata)
    for (const opening of json.white) {
        if (opening.title === title) {
            return false
        }
    }
    for (const opening of json.black) {
        if (opening.title === title) {
            return false
        }
    }
    return true
}

$('#submit-form').on("click", function () {
    // Get form fields
    const titleInput = document.getElementById('title-input').value
    const pieceColor = document.getElementById('piece-color').checked
    const pgnInput = document.getElementById('pgn-input').value
    let color = 'white'
    if (pieceColor) {
        color = 'black'
    }

    // Verify fields before dumping
    const errorTitle = document.getElementById('error-title')
    const errorPgn = document.getElementById('error-pgn')
    if (verifyFormTitle(titleInput)) {
        dumpOpening(titleInput, color, getFenFromPgn(pgnInput))
        errorTitle.innerHTML = ''
        errorPgn.innerHTML = ''
        document.getElementById('opening-modal').style.display = 'none'
    } else {
        errorTitle.innerHTML = 'Title already exist'
    }
});
