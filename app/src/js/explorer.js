const fs = require('fs')
const path = require('path')

//* Display folder/links
function displayFolders(color) {
    const explorer = document.getElementById('explorer-' + color)
    const json = _getOpeningFile()
    const folders = _getFolders(color, json)
    let folderButton = ''

    for (const folder of folders) {
        folderButton = '<button class="btn-icon explorer-action" onclick="openFolder(\'' + folder + '\')">' +
            '<img id="img-' + folder + '" src="assets/folder-close.png" alt="folder" width="24px" height="24px">' +
            '<span class="folder-text">' + folder + '</span></button>' + 
            '<div class="explorer" id="folder-' + folder + '" hidden></div>'  
        explorer.innerHTML += folderButton
        _displayOpeningsLinks(color, json, folder)
    }
}

function _displayOpeningsLinks(color, json, folder) {
    const explorer = document.getElementById('folder-' + folder)
    const openings = _getFolderOpenings(color, json, folder)
    let openingLink = ''

    for (const title of openings) {
        openingLink = '<a class="opening-link explorer-action"' +
            'onclick="setOpening(\'' + title + '\', \'' + color + '\')" ' +
            'href="#">' + title + '</a><br>'
        explorer.innerHTML += openingLink
    }
}

//* Opening file parsing
function _getOpeningFile() {
    return _openingFileExist() ? _readOpeningFile('openings.json') : _readOpeningFile('openings-exemple.json')
}

function _openingFileExist() {
    const filePath = path.resolve(__dirname, 'openings.json')
    return fs.existsSync(filePath)
}

function _readOpeningFile(fileName) {
    const rawdata = fs.readFileSync(path.resolve(__dirname, fileName))
    return JSON.parse(rawdata)
}

function _getFolderOpenings(color, json, folder) {
    const openings = []
    for (const opening of json[color]) {
        if (opening.folder === folder) openings.push(opening.title)
    }
    return openings
}

function _getFolders(color, json) {
    const folders = []
    for (const opening of json[color]) {
        if (!folders.includes(opening.folder)) folders.push(opening.folder)
    }
    return folders
}

//* Actions
function setOpening(title, color) {
    localStorage.setItem('title', title)
    localStorage.setItem('color', color)
}

function openFolder(folderId) {
    _toggleImage(folderId)
    _toggleHidden(folderId)
}

function _toggleImage(folderId) {
    const image = document.getElementById('img-' + folderId)
    const src = image.getAttribute('src')
    src === 'assets/folder-close.png' ? image.setAttribute('src', 'assets/folder-open.png') : image.setAttribute('src', 'assets/folder-close.png')
}

function _toggleHidden(folderId) {
    const container = document.getElementById('folder-' + folderId)
    const condition = container.style.display === 'none' || container.style.display === ''
    condition ? container.style.display = 'block' : container.style.display = 'none'
}

displayFolders('white')
displayFolders('black')
