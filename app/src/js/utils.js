const fs = require('fs')
const { promises: Fs } = require('fs')
const path = require('path')

export async function createOpeningFile() {
    const filePath = path.resolve(__dirname, 'openings.json')
    const exist = fs.existsSync(filePath)

    if (!exist) {
        const exemplePath = path.resolve(__dirname, 'openings-exemple.json')
        fs.copyFile(exemplePath, filePath, (err) => {
            if (err) throw err
        });
        await Fs.access(filePath)
    }

    const rawdata = fs.readFileSync(filePath)
    return JSON.parse(rawdata)
}
