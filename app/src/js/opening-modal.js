const fs = require('fs')
const path = require('path')

export class OpeningModal {
    getFormFields() {
        const titleInput = document.getElementById('title-input').value
        const pieceColor = document.getElementById('piece-color').checked
        const folderInput = document.getElementById('folder-input').value
        const pgnInput = document.getElementById('pgn-input').value
        return { titleInput, pieceColor, folderInput, pgnInput }
    }

    setColor(pieceColor) {
        if (pieceColor) {
            return 'black'
        }
        return 'white'
    }

    createOpening(title, folder, pgn, color) {
        try {
            this._verifyFormTitle(title)
            this._dumpOpening(title, folder, pgn, color)
            this._formOk()
        } catch (error) {
            console.error(error);
        }
    }

    _dumpOpening(title, folder, pgn, color) {
        const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'))
        let json = JSON.parse(rawdata)
        json[color].push({title, folder, pgn})
    
        fs.writeFile(path.resolve(__dirname, 'openings.json'), JSON.stringify(json), 'utf8', function readFileCallback(err){
            if (err) this._formError('error-pgn', 'PGN wrong format')
        })
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
        throw Error(errorText);
    }
}
