import { Training } from "./training.js"

const train = new Training('board')
train.updateStatus()

//* On click events
$('#tip').on("click", () => {
    train.highlightMove('c4')
    console.log('DEBUG: ', train.myMoves)
})

$('#reset').on("click", function () {
    train.resetAll()
    train.updateOpeningColor()
})

$('#delete').on("click", () => {
    train.resetAll()

    // Delete opening
    const rawdata = fs.readFileSync(path.resolve(__dirname, 'openings.json'))
    let json = JSON.parse(rawdata)
    const color = localStorage.getItem('color')
    let inc = 0

    for (const opening of json[color]) {
        if (opening.title === t.title) {
            json[color].splice(inc, 1)
        }
        inc++
    }

    fs.writeFile(path.resolve(__dirname, 'openings.json'), JSON.stringify(json), 'utf8', function readFileCallback(err) {
        if (err) {
            console.log(err)
        }
    })
    document.location.reload()
})

$('.explorer').on("click", event => {
    train.resetAll()
    train.getOpening(localStorage.getItem('color'), localStorage.getItem('title'))
    train.updateStatus()
    event.stopPropagation()
    event.stopImmediatePropagation()
})

$('#png-area').on("click", () => {
    const copyPgn = document.getElementById("png-area")
    copyPgn.select()
    document.execCommand("copy")
})
