/* ===================================
   assets/js/velha3.js - Jogo da Velha 3 (Ultimate Tic Tac Toe)
   Versão atualizada — regras completas do jogo
=================================== */

/* ========================
   1. ELEMENTOS DA INTERFACE
======================== */
const bigCells = document.querySelectorAll(".cell"); // 9 células grandes
const homeBtn = document.getElementById("homeBtn");
const restartBtn = document.getElementById("restartBtn");
const helpBtn = document.getElementById("helpBtn");
const helpPopup = document.getElementById("helpPopup");
const closeHelp = document.getElementById("closeHelp");
const statusText = document.getElementById("gameStatus");

/* ========================
   2. EVENTOS (UI)
======================== */
window.addEventListener("load", () => { helpPopup?.style && (helpPopup.style.display = "flex"); });

helpBtn?.addEventListener("click", () => { if (helpPopup) helpPopup.style.display = "flex"; });
closeHelp?.addEventListener("click", () => { if (helpPopup) helpPopup.style.display = "none"; });
helpPopup?.addEventListener("click", e => { if (e.target === helpPopup) helpPopup.style.display = "none"; });

if (homeBtn) {
    homeBtn.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
}

if (restartBtn) {
    restartBtn.addEventListener("click", restartGame);
}

/* ========================
   3. CRIAÇÃO DINÂMICA DOS TABULEIROS MENORES
======================== */
bigCells.forEach((bigCell, bigIndex) => {
    const smallBoard = document.createElement("div");
    smallBoard.classList.add("small-board");

    for (let i = 0; i < 9; i++) {
        const smallCell = document.createElement("div");
        smallCell.classList.add("small-cell");

        smallCell.dataset.index = i;      // índice dentro do tabuleiro pequeno
        smallCell.dataset.bigIndex = bigIndex; // índice do tabuleiro grande

        smallBoard.appendChild(smallCell);
    }

    bigCell.appendChild(smallBoard);
});

/* ========================
   4. VARIÁVEIS DO JOGO
======================== */
let currentPlayer = "X";
let running = true;
let activeBigIndex = null; // null = qualquer tabuleiro no início
const bigBoards = Array.from(bigCells).map(cell => cell.querySelector(".small-board"));

// Controle de tabuleiros finalizados:
// null = jogável | "X" ou "O" = vencedor
let finishedBoards = Array(9).fill(null);

/* ========================
   5. ATUALIZAÇÃO DO DESTAQUE (TABULEIRO ATIVO)
======================== */
function updateActiveBoard() {
    bigCells.forEach((bigCell, index) => {
        bigCell.classList.remove("active-board-x", "active-board-o");

        if (!running) return;
        if (finishedBoards[index] !== null) return; // tabuleiro finalizado não pisca

        if (activeBigIndex === null || activeBigIndex === index) {
            bigCell.classList.add(currentPlayer === "X" ? "active-board-x" : "active-board-o");
        }
    });

    if (statusText) {
        statusText.innerHTML = `Vez do jogador: <span class="${currentPlayer === "X" ? "x-turn" : "o-turn"}">${currentPlayer}</span>`;
    }
}

/* ========================
   6. VERIFICAÇÃO DE VITÓRIA DO TABULEIRO MENOR
   -> Retorna "X", "O" ou null
======================== */
function checkSmallBoardWinner(bigIndex) {
    const board = bigBoards[bigIndex];
    const cells = Array.from(board.querySelectorAll(".small-cell")).map(c => c.textContent);

    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of wins) {
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            return cells[a];
        }
    }

    return null; // tabuleiro cheio será tratado no clique
}

/* ========================
   7. MARCAR TABULEIRO GRANDE COM OVERLAY
======================== */
function markBigBoard(bigCell, winner) {
    if (!bigCell || bigCell.querySelector(".winner-overlay")) return;

    const overlay = document.createElement("div");
    overlay.classList.add("winner-overlay");
    overlay.textContent = winner;

    overlay.style.color = winner === "X" ? "var(--playerX)" : "var(--playerY)";

    bigCell.appendChild(overlay);
    bigCell.classList.add("board-finished");
}

/* ========================
   8. VERIFICAÇÃO DE VITÓRIA DO TABULEIRO GRANDE
======================== */
function checkBigBoardVictory() {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // 1) Vitória clássica
    for (const [a, b, c] of wins) {
        if (
            finishedBoards[a] &&
            finishedBoards[a] === finishedBoards[b] &&
            finishedBoards[a] === finishedBoards[c]
        ) {
            endGame(finishedBoards[a]);
            return;
        }
    }

    // 2) A partida continua se houver tabuleiro não finalizado
    if (finishedBoards.includes(null)) return;

    // 3) Todos os tabuleiros resolvidos → placar decide
    const countX = finishedBoards.filter(v => v === "X").length;
    const countO = finishedBoards.filter(v => v === "O").length;

    if (countX > countO) {
        endGame("X");
    } else {
        endGame("O");
    }
}

/* ========================
   9. FINALIZAR PARTIDA
======================== */
function endGame(player) {
    running = false;

    bigCells.forEach(c => c.classList.remove("active-board-x", "active-board-o"));

    if (statusText) {
        statusText.innerHTML = `<span class="${player === "X" ? "x-turn" : "o-turn"}">${player}</span> venceu a partida!`;
    }
}

/* ========================
   10. CLIQUE NAS CÉLULAS (LÓGICA)
======================== */
bigBoards.forEach((smallBoard, bigIndex) => {
    const smallCells = smallBoard.querySelectorAll(".small-cell");

    smallCells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (!running) return;

            if (finishedBoards[bigIndex] !== null) return;
            if (activeBigIndex !== null && activeBigIndex !== bigIndex) return;
            if (cell.textContent !== "") return;

            const playerWhoPlayed = currentPlayer;
            cell.textContent = playerWhoPlayed;
            cell.style.color = playerWhoPlayed === "X" ? "var(--playerX)" : "var(--playerY)";

            // --- Verificar vitória no pequeno ---
            const winResult = checkSmallBoardWinner(bigIndex);
            let winner = null;

            if (winResult) {
                winner = winResult;
            } else {
                const isFull = Array.from(bigBoards[bigIndex].querySelectorAll(".small-cell"))
                    .every(c => c.textContent !== "");
                if (isFull) {
                    winner = playerWhoPlayed === "X" ? "O" : "X";
                }
            }

            if (winner && finishedBoards[bigIndex] === null) {
                finishedBoards[bigIndex] = winner;
                markBigBoard(bigCells[bigIndex], winner);
                checkBigBoardVictory(); // <<< IMPORTANTE
            }

            // Próximo tabuleiro
            const nextBoard = parseInt(cell.dataset.index);
            activeBigIndex = finishedBoards[nextBoard] !== null ? null : nextBoard;

            currentPlayer = currentPlayer === "X" ? "O" : "X";

            updateActiveBoard();
        });
    });
});

/* ========================
   11. HOVER DINÂMICO
======================== */
bigBoards.forEach((smallBoard, bigIndex) => {
    const smallCells = smallBoard.querySelectorAll(".small-cell");

    smallCells.forEach(cell => {
        cell.addEventListener("mouseenter", () => {
            if (!running) return;
            if (cell.textContent !== "") return;
            if (finishedBoards[bigIndex] !== null) return;
            if (activeBigIndex !== null && activeBigIndex !== bigIndex) return;

            cell.style.background = currentPlayer === "X"
                ? "rgba(0, 255, 255, 0.2)"
                : "rgba(255, 0, 255, 0.2)";
            cell.style.transform = "scale(1.05)";
        });

        cell.addEventListener("mouseleave", () => {
            cell.style.background = "rgba(255, 255, 255, 0.1)";
            cell.style.transform = "scale(1)";
        });
    });
});

/* ========================
   12. REINICIAR
======================== */
function restartGame() {
    bigBoards.forEach(smallBoard => {
        smallBoard.querySelectorAll(".small-cell").forEach(cell => {
            cell.textContent = "";
            cell.style.color = "";
            cell.style.background = "";
            cell.style.transform = "";
        });
    });

    bigCells.forEach(c => {
        c.classList.remove("board-finished");
        const overlay = c.querySelector(".winner-overlay");
        if (overlay) overlay.remove();

        c.style.animation = "none";
        void c.offsetWidth;
        c.style.animation = "";
    });

    currentPlayer = "X";
    running = true;
    activeBigIndex = null;
    finishedBoards = Array(9).fill(null);

    updateActiveBoard();
}

/* ========================
   13. INICIALIZAÇÃO
======================== */
window.addEventListener("load", () => {
    updateActiveBoard();
    if (helpPopup) helpPopup.style.display = "flex";
});
