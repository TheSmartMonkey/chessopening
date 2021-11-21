import { Training } from "./training.js"
import { OpeningModal } from "./opening-modal.js"
import { createOpeningFile } from "./utils.js"

const fs = require('fs')
const path = require('path')

//* Init
const modal = new OpeningModal()
const train = new Training('board')

let json
(async function () {
    json = await createOpeningFile()
    train.getOpening(json, train.color, '')
    train.updateStatus()
})()

//* Training
$('#tip').on("click", () => {
    train.giveTip()
})

$('#reset').on("click", function () {
    train.resetAll()
    train.updateOpeningColor()
})

$('#png-area').on("click", () => {
    const copyPgn = document.getElementById("png-area")
    copyPgn.select()
    document.execCommand("copy")
})

//* Opening
$('#submit-form').on("click", () => {
    const { titleInput, pieceColor, folderInput, pgnInput } = modal.getFormFields()
    const color = modal.setColor(pieceColor)
    modal.createOpening(titleInput, folderInput, pgnInput, color)
})

$('.explorer').on("click", event => {
    train.resetAll()
    train.getOpening(json, localStorage.getItem('color'), localStorage.getItem('title'))
    train.updateStatus()
    event.stopPropagation()
    event.stopImmediatePropagation()
})

$('#delete').on("click", () => {
    train.resetAll()

    // Delete opening
    const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'))
    let json = JSON.parse(rawdata)
    const color = localStorage.getItem('color')
    let inc = 0

    for (const opening of json[color]) {
        if (opening.title === train.title) {
            json[color].splice(inc, 1)
        }
        inc++
    }

    fs.writeFile(path.resolve(__dirname, 'openings.json'), JSON.stringify(json), 'utf8', function readFileCallback(err) {
        if (err) throw err
    })
    document.location.reload()
})
