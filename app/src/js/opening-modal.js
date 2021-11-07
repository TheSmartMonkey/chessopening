const fs = require('fs')
const path = require('path')

export class OpeningModal {
    getFormFields() {
        const titleInput = document.getElementById('title-input').value
        const pieceColor = document.getElementById('piece-color').checked
        const pgnInput = document.getElementById('pgn-input').value
        return { titleInput, pieceColor, pgnInput }
    }

    setColor(pieceColor) {
        if (pieceColor) {
            return 'black'
        }
        return 'white'
    }

    createOpening(title, pgn, color) {
        try {
            this._verifyFormTitle(title)
            this._dumpOpening(title, pgn, color, this._getFenFromPgn(pgn))
            this._formOk()
        } catch (error) {
            console.error(error);
        }
    }

    _dumpOpening(title, pgn, color, moves) {
        const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'))
        let json = JSON.parse(rawdata)
        json[color].push({
            'title': title,
            'pgn': pgn,
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

    _getFenFromPgn(pgn) {
        const chess1 = new Chess()
        const chess2 = new Chess()
    
        chess1.load_pgn(pgn)
        let moves = chess1.history().map(move => {
            chess2.move(move)
            return chess2.fen()
        })
    
        return moves
    }

    _verifyFormTitle(title) {
        const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'))
        const json = JSON.parse(rawdata)
        this._checkTitleByColors(json.white, title)
        this._checkTitleByColors(json.black, title)
    }

    _checkTitleByColors(jsonColor, title) {
        for (const opening of jsonColor) {
            if (opening.title === title) {
                this._formError('error-title', 'Title already exist')
            }
        }
    }

    _formOk() {
        const errorTitle = document.getElementById('error-title')
        const errorPgn = document.getElementById('error-pgn')
        errorTitle.innerHTML = ''
        errorPgn.innerHTML = ''
        document.getElementById('opening-modal').style.display = 'none'
        document.location.reload()
    }

    _formError(element, errorText) {
        const errorPlaceholder = document.getElementById(element)
        errorPlaceholder.innerHTML = errorText
        throw errorText;
    }
}
