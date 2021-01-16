$('#submit-form').on("click", function () {
    const inputTitle = document.getElementById('title-input').value
    const pieceColor = document.getElementById('piece-color').checked
    console.log('TEST: ', inputTitle)
    console.log('TEST: ', pieceColor)
});
