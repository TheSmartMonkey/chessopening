function getFenFromPgn(pgn) {
    const chess1 = new Chess();
    const chess2 = new Chess();

    chess1.load_pgn(pgn);
    let moves = chess1.history().map(move => {
        chess2.move(move);
        return {'fen': chess2.fen()};
    });

    return moves
}

$('#submit-form').on("click", function () {
    const titleInput = document.getElementById('title-input').value
    const pieceColor = document.getElementById('piece-color').checked
    const pgnInput = document.getElementById('pgn-input').value
    console.log('TEST: ', titleInput)
    console.log('TEST: ', pieceColor)
    console.log('TEST: ', getFenFromPgn(pgnInput));
});
