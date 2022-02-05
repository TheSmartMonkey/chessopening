const fs = require('fs')
const path = require('path')

export function getOpenings() {
    const filePath = path.resolve(__dirname, 'openings.json')
    const rawdata = fs.readFileSync(filePath)
    return JSON.parse(rawdata)
}
