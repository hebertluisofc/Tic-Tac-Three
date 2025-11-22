/* ===================================
   assets/js/velha3.js - Jogo da Velha 3 (Ultimate Tic Tac Toe)
   Versão com popups de confirmação para reinício e home
=================================== */

/* ========================
   0. QUERY SELECTORS
======================== */
const bigCells = Array.from(document.querySelectorAll(".cell"));
const homeBtn = document.getElementById("homeBtn");
const restartBtn = document.getElementById("restartBtn");
const helpBtn = document.getElementById("helpBtn");
const helpPopup = document.getElementById("helpPopup");
const closeHelp = document.getElementById("closeHelp");
const statusText = document.getElementById("gameStatus");

// Popups de confirmação
const confirmRestartPopup = document.getElementById("confirmRestartPopup");
const confirmRestartYes = document.getElementById("confirmRestartYes");
const confirmRestartNo = document.getElementById("confirmRestartNo");

const confirmHomePopup = document.getElementById("confirmHomePopup");
const confirmHomeYes = document.getElementById("confirmHomeYes");
const confirmHomeNo = document.getElementById("confirmHomeNo");

/* ========================
   1. ESTADO DO JOGO
======================== */
let currentPlayer = "X";
let running = true;
let activeBigIndex = null;

let bigBoards = [];
let finishedBoards = Array(9).fill(null);

const stateStack = [];
const MAX_HISTORY = 4;

/* ========================
   2. INICIALIZAÇÃO
======================== */
function init() {
    createSmallBoards();
    bindUI();
    bindBoardEvents();
    pushSnapshot();
    updateUndoButton();
    updateActiveBoard();

    if (helpPopup) helpPopup.style.display = "flex";
}

/* ========================
   3. CRIAÇÃO DOS TABULEIROS PEQUENOS
======================== */
function createSmallBoards() {
    bigBoards = bigCells.map((bigCell, bigIndex) => {
        const existing = bigCell.querySelector(".small-board");
        if (existing) existing.remove();

        const smallBoard = document.createElement("div");
        smallBoard.classList.add("small-board");

        for (let i = 0; i < 9; i++) {
            const sc = document.createElement("div");
            sc.classList.add("small-cell");
            sc.dataset.index = i;
            sc.dataset.bigIndex = bigIndex;
            smallBoard.appendChild(sc);
        }

        bigCell.appendChild(smallBoard);
        return smallBoard;
    });
}

/* ========================
   4. BIND UI E BOTÃO UNDO
======================== */
function bindUI() {
    window.addEventListener("load", () => { if (helpPopup) helpPopup.style.display = "flex"; });

    helpBtn?.addEventListener("click", () => { if (helpPopup) helpPopup.style.display = "flex"; });
    closeHelp?.addEventListener("click", () => { if (helpPopup) helpPopup.style.display = "none"; });
    helpPopup?.addEventListener("click", e => { if (e.target === helpPopup) helpPopup.style.display = "none"; });

    // Home com popup de confirmação
    homeBtn?.addEventListener("click", () => {
        if (!running) {
            window.location.href = "../../index.html";
        } else if (confirmHomePopup) {
            confirmHomePopup.style.display = "flex";
        }
    });

    confirmHomeYes?.addEventListener("click", () => {
        window.location.href = "../../index.html";
        if (confirmHomePopup) confirmHomePopup.style.display = "none";
    });

    confirmHomeNo?.addEventListener("click", () => {
        if (confirmHomePopup) confirmHomePopup.style.display = "none";
    });

    confirmHomePopup?.addEventListener("click", e => {
        if (e.target === confirmHomePopup) confirmHomePopup.style.display = "none";
    });

    // Restart com popup de confirmação
    restartBtn?.addEventListener("click", () => {
        if (!running) {
            restartGame();
        } else if (confirmRestartPopup) {
            confirmRestartPopup.style.display = "flex";
        }
    });

    confirmRestartYes?.addEventListener("click", () => {
        restartGame();
        if (confirmRestartPopup) confirmRestartPopup.style.display = "none";
    });

    confirmRestartNo?.addEventListener("click", () => {
        if (confirmRestartPopup) confirmRestartPopup.style.display = "none";
    });

    confirmRestartPopup?.addEventListener("click", e => {
        if (e.target === confirmRestartPopup) confirmRestartPopup.style.display = "none";
    });

    let undoBtn = document.getElementById("undoBtn");
    if (!undoBtn) {
        const controls = document.querySelector(".controls");
        if (controls) {
            undoBtn = document.createElement("button");
            undoBtn.id = "undoBtn";
            undoBtn.className = "btn velha3";
            undoBtn.textContent = "Desfazer";
            const restartEl = document.getElementById("restartBtn");
            const homeEl = document.getElementById("homeBtn");
            if (restartEl && homeEl && restartEl.parentNode === homeEl.parentNode) {
                restartEl.parentNode.insertBefore(undoBtn, homeEl);
            } else {
                controls.appendChild(undoBtn);
            }
        }
    }

    if (undoBtn) {
        undoBtn.disabled = true;
        undoBtn.addEventListener("click", undoSnapshot);
    }
}

/* ========================
   5. VITÓRIA NO TABULEIRO PEQUENO
======================== */
function determineSmallWinner(bigIndex) {
    const board = bigBoards[bigIndex];
    const cells = Array.from(board.querySelectorAll(".small-cell")).map(c => c.textContent);

    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (const [a,b,c] of wins) {
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return cells[a];
    }
    return null;
}

/* ========================
   6. MARCAR TABULEIRO GRANDE
======================== */
function markBigBoardWinner(bigIndex, winner) {
    const bigCell = bigCells[bigIndex];
    if (!bigCell) return;
    if (bigCell.querySelector(".winner-overlay")) return;

    const overlay = document.createElement("div");
    overlay.classList.add("winner-overlay");
    overlay.textContent = winner;
    overlay.style.color = winner === "X" ? "var(--playerX)" : "var(--playerY)";
    bigCell.appendChild(overlay);

    bigCell.classList.add("board-finished");
    finishedBoards[bigIndex] = winner;
}

/* ========================
   7. SNAPSHOT / UNDO
======================== */
function pushSnapshot() {
    const smallCellsState = bigBoards.map(board =>
        Array.from(board.querySelectorAll(".small-cell")).map(c => c.textContent)
    );

    const snapshot = {
        smallCellsState,
        finishedBoards: finishedBoards.slice(),
        currentPlayer,
        running,
        activeBigIndex
    };

    stateStack.push(snapshot);
    if (stateStack.length > MAX_HISTORY) stateStack.shift();
    updateUndoButton();
}

function applySnapshot(snapshot) {
    if (!snapshot) return;
    snapshot.smallCellsState.forEach((boardState, bigIndex) => {
        const board = bigBoards[bigIndex];
        const cells = Array.from(board.querySelectorAll(".small-cell"));
        cells.forEach((cell, idx) => {
            cell.textContent = boardState[idx] || "";
            if (cell.textContent === "X") cell.style.color = "var(--playerX)";
            else if (cell.textContent === "O") cell.style.color = "var(--playerY)";
            else cell.style.color = "";
            cell.style.background = "";
            cell.style.transform = "";
        });
    });

    finishedBoards = snapshot.finishedBoards.slice();
    bigCells.forEach((bigCell, idx) => {
        const overlay = bigCell.querySelector(".winner-overlay");
        if (overlay) overlay.remove();
        bigCell.classList.remove("board-finished", "win");
        if (finishedBoards[idx]) {
            const ov = document.createElement("div");
            ov.classList.add("winner-overlay");
            ov.textContent = finishedBoards[idx];
            ov.style.color = finishedBoards[idx] === "X" ? "var(--playerX)" : "var(--playerY)";
            bigCell.appendChild(ov);
            bigCell.classList.add("board-finished");
        }
    });

    currentPlayer = snapshot.currentPlayer;
    running = snapshot.running;
    activeBigIndex = snapshot.activeBigIndex;

    clearBigWinHighlights();
    updateActiveBoard();
}

function undoSnapshot() {
    if (stateStack.length <= 1) return;
    stateStack.pop();
    const previous = stateStack[stateStack.length - 1];
    applySnapshot(previous);
    updateUndoButton();
}

/* ========================
   10. MANIPULADOR DE CLIQUE CELULAS
======================== */
function handleSmallCellClick(evt) {
    if (!running) return;
    const cell = evt.currentTarget;
    const bigIndex = Number(cell.dataset.bigIndex);
    const smallIndex = Number(cell.dataset.index);

    if (finishedBoards[bigIndex] !== null) return;
    if (activeBigIndex !== null && activeBigIndex !== bigIndex) return;
    if (cell.textContent !== "") return;

    const playerWhoPlayed = currentPlayer;
    cell.textContent = playerWhoPlayed;
    cell.style.color = playerWhoPlayed === "X" ? "var(--playerX)" : "var(--playerY)";

    const smallWin = determineSmallWinner(bigIndex);
    let winner = null;
    if (smallWin) winner = smallWin;
    else {
        const cellsNow = Array.from(bigBoards[bigIndex].querySelectorAll(".small-cell"));
        const full = cellsNow.every(c => c.textContent !== "");
        if (full) winner = playerWhoPlayed === "X" ? "O" : "X";
    }

    if (winner && finishedBoards[bigIndex] === null) {
        markBigBoardWinner(bigIndex, winner);
        checkBigBoardVictory();
    }

    const nextBoard = smallIndex;
    activeBigIndex = (finishedBoards[nextBoard] !== null) ? null : nextBoard;

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    pushSnapshot();
    updateActiveBoard();
}

/* ========================
   11. BIND EVENTOS NAS CELULAS
======================== */
function bindBoardEvents() {
    bigBoards.forEach((smallBoard, bigIndex) => {
        const smallCells = smallBoard.querySelectorAll(".small-cell");
        smallCells.forEach(cell => cell.replaceWith(cell.cloneNode(true)));

        const fresh = smallBoard.querySelectorAll(".small-cell");
        fresh.forEach(cell => {
            cell.addEventListener("click", handleSmallCellClick);

            cell.addEventListener("mouseenter", () => {
                if (!running) return;
                if (cell.textContent !== "") return;
                if (finishedBoards[bigIndex] !== null) return;
                if (activeBigIndex !== null && activeBigIndex !== bigIndex) return;

                cell.style.background = currentPlayer === "X"
                    ? "rgba(0,255,255,0.2)"
                    : "rgba(255,0,255,0.2)";
                cell.style.transform = "scale(1.05)";
            });

            cell.addEventListener("mouseleave", () => {
                cell.style.background = "rgba(255,255,255,0.1)";
                cell.style.transform = "scale(1)";
            });
        });
    });
}

/* ========================
   12. VITÓRIA NO TABULEIRO GRANDE
======================== */
function checkBigBoardVictory() {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (const [a,b,c] of wins) {
        if (finishedBoards[a] && finishedBoards[a] === finishedBoards[b] && finishedBoards[a] === finishedBoards[c]) {
            const winner = finishedBoards[a];
            clearBigWinHighlights();
            [a,b,c].forEach(i => bigCells[i].classList.add("win"));
            endGame(winner);
            return winner;
        }
    }

    if (finishedBoards.includes(null)) return null;

    const x = finishedBoards.filter(v => v === "X").length;
    const o = finishedBoards.filter(v => v === "O").length;

    const winner = x > o ? "X" : "O";
    clearBigWinHighlights();
    finishedBoards.forEach((v, i) => { if (v === winner) bigCells[i].classList.add("win"); });

    endGame(winner);
    return winner;
}

/* ========================
   13. LIMPAR DESTAQUES
======================== */
function clearBigWinHighlights() {
    bigCells.forEach(c => c.classList.remove("win"));
}

/* ========================
   14. FINALIZAÇÃO
======================== */
function endGame(winner) {
    running = false;
    activeBigIndex = null;
    bigCells.forEach(c => c.classList.remove("active-board-x", "active-board-o"));

    if (statusText) {
        statusText.innerHTML = `<span class="${winner === "X" ? "x-turn" : "o-turn"}">Jogador ${winner} venceu!</span>`;
    }
}

/* ========================
   15. ATUALIZAÇÃO DO TABULEIRO ATIVO
======================== */
function updateActiveBoard() {
    bigCells.forEach((bigCell, index) => {
        bigCell.classList.remove("active-board-x", "active-board-o");
        if (!running) return;
        if (finishedBoards[index] !== null) return;
        if (activeBigIndex === null || activeBigIndex === index) {
            bigCell.classList.add(currentPlayer === "X" ? "active-board-x" : "active-board-o");
        }
    });

    if (statusText && running) {
        statusText.innerHTML = `Vez do jogador: <span class="${currentPlayer === "X" ? "x-turn" : "o-turn"}">${currentPlayer}</span>`;
    }
}

/* ========================
   16. ATUALIZAR BOTÃO UNDO
======================== */
function updateUndoButton() {
    const undoBtn = document.getElementById("undoBtn");
    if (!undoBtn) return;
    undoBtn.disabled = stateStack.length <= 1;
}

/* ========================
   17. REINICIAR PARTIDA
======================== */
function restartGame() {
    bigBoards.forEach(board =>
        board.querySelectorAll(".small-cell").forEach(c => {
            c.textContent = "";
            c.style.color = "";
            c.style.background = "";
            c.style.transform = "";
        })
    );

    bigCells.forEach(c => {
        const overlay = c.querySelector(".winner-overlay");
        if (overlay) overlay.remove();
        c.classList.remove("board-finished", "win", "active-board-x", "active-board-o");
    });

    currentPlayer = "X";
    running = true;
    activeBigIndex = null;
    finishedBoards = Array(9).fill(null);

    stateStack.length = 0;
    pushSnapshot();

    createSmallBoards();
    bindBoardEvents();

    updateUndoButton();
    updateActiveBoard();
}

/* ========================
   18. START
======================== */
init();
