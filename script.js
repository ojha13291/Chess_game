// Import chessboard.js and chess.js libraries
let board = null;
const game = new Chess();
const stockfish = new Worker("https://raw.githubusercontent.com/nmrugg/stockfish.js/main/src/stockfish.asm.js");

function makeBestMove() {
  if (game.game_over()) {
    alert("Game Over!");
    return;
  }

  stockfish.postMessage(position fen ${game.fen()});
  stockfish.postMessage("go depth 15");

  stockfish.onmessage = function (event) {
    if (event.data.includes("bestmove")) {
      const move = event.data.split(" ")[1];
      game.move({ from: move.slice(0, 2), to: move.slice(2, 4) });
      board.position(game.fen());
    }
  };
}

function onDragStart(source, piece) {
  if (game.turn() === "b" || game.game_over() || piece.startsWith("b")) {
    return false;
  }
}

function onDrop(source, target) {
  const move = game.move({ from: source, to: target, promotion: "q" });

  if (move === null) {
    return "snapback";
  }

  board.position(game.fen());
  window.setTimeout(makeBestMove, 250);
}

function onSnapEnd() {
  board.position(game.fen());
}

const config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
};

board = Chessboard("board", config);