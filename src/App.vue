<template>
    <div id="app">
        <table>
            <tr>
                <td @click="turnClick" v-for="i in 3" :key="i-1" :class="className" :id="i-1"></td>
            </tr>
            <tr>
                <td @click="turnClick" v-for="i in 3" :key="i+2" :class="className" :id="i+2"></td>
            </tr>
            <tr>
                <td @click="turnClick" v-for="i in 3" :key="i+5" :class="className" :id="i+5"></td>
            </tr>
        </table>
        <div>
            <div v-if="gameover" class="endgame">
                <div class="text">{{endGameText}}</div>
            </div>
            <div class="selectSym">
                <p>Select symbol:</p>
                <button @click="selectSym('X')">X</button>
                <button @click="selectSym('O')">O</button>
            </div>
            <button style="display: flex;" @click="startGame">Replay</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            className: "cell",
            gameover: false,
            disabled: false,
            winner: false,
            cells: null,
            origBoard: [],
            huPlayer: "O",
            aiPlayer: "X",
            endGameText: "Gameover",
            winCombos: [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 4, 8],
                [6, 4, 2],
                [2, 5, 8],
                [1, 4, 7],
                [0, 3, 6]
            ]
        };
    },
    methods: {
        startGame() {
            this.origBoard = Array.from(Array(9).keys());
            this.disabled = false;
            this.cells.forEach(element => {
                element.innerText = "";
                element.style.removeProperty("background-color");
            });
        },
        selectSym(sym) {
            this.huPlayer = sym;
            this.aiPlayer = sym === "O" ? "X" : "O";
            this.origBoard = Array.from(Array(9).keys());
            if (this.aiPlayer === "X") {
                this.turn(this.bestSpot(), this.aiPlayer);
            }
            document.querySelector(".selectSym").style.display = "none";
        },
        turnClick(square) {
            if (
                typeof this.origBoard[square.target.id] == "number" &&
                !this.disabled
            ) {
                this.turn(square.target.id, this.huPlayer);
                if (!this.checkTie() && !this.winner) this.turn(this.bestSpot(), this.aiPlayer);
            }
        },
        turn(squareId, player) {
            this.origBoard[squareId] = player;
            document.getElementById(squareId).innerText = player;
            let gameWon = this.checkWin(player);
            console.log(player, gameWon, "gameOver");
            if (gameWon) this.gameOver(gameWon);
        },
        emptySquares() {
            return this.origBoard.filter(s => typeof s == "number");
        },
        bestSpot() {
            return this.emptySquares()[0];
        },
        checkTie() {
            if (this.emptySquares().length === 0 && !this.winner) {
                for (let cell of this.cells) {
                    cell.style.backgroundColor = "green";
                }
                this.declareWinner("Tie game");
                return true;
            }
            return false;
        },
        declareWinner(who) {
            this.gameover = true;
            this.endGameText = who;
        },
        checkWin(player) {
            let plays = this.origBoard.reduce(
                (a, e, i) => (e === player ? a.concat(i) : a),
                []
            );
            this.winner = null;
            for (let [index, win] of this.winCombos.entries()) {
                if (win.every(elem => plays.indexOf(elem) > -1)) {
                    this.winner = { index: index, player: player };
                    break;
                }
            }
            return this.winner;
        },
        gameOver(gameWon) {
            for (let index of this.winCombos[gameWon.index]) {
                document.getElementById(index).style.backgroundColor =
                    gameWon.player == this.huPlayer ? "blue" : "red";
            }

            this.disabled = true;
            this.declareWinner(
                gameWon.player === this.huPlayer ? "You win!" : "You lose"
            );
        }
    },
    mounted() {
        this.cells = document.querySelectorAll("." + this.className);
        this.startGame();
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
td {
    border: 2px solid #333;
    height: 100px;
    width: 100px;
    text-align: center;
    vertical-align: middle;
    font-family: "Comic Sans MS", cursive, sans-serif;
    font-size: 70px;
    cursor: pointer;
}

table {
    border-collapse: collapse;
    position: absolute;
    left: 50%;
    margin-left: -155px;
    top: 50px;
}

table tr:first-child td {
    border-top: 0;
}

table tr:last-child td {
    border-bottom: 0;
}

table tr td:first-child {
    border-left: 0;
}
table tr td:last-child {
    border-right: 0;
}

.endgame {
    display: none;
    width: 200px;
    top: 120px;
    background-color: rgba(205, 133, 63, 0.8);
    position: absolute;
    left: 50%;
    margin-left: -100px;
    padding-top: 50px;
    padding-bottom: 50px;
    text-align: center;
    border-radius: 5px;
    color: white;
    font-size: 2em;
}

.selectSym {
    display: none;
    width: 220px;
    top: 110px;
    background-color: rgba(205, 133, 63, 0.8);
    position: absolute;
    left: 50%;
    margin-left: -110px;
    padding-top: 10px;
    padding-bottom: 50px;
    text-align: center;
    border-radius: 5px;
    color: yellow;
    font-size: 2em;
}

.selectSym button {
    font-family: "Comic Sans MS", cursive, sans-serif;
    font-size: 50px;
    width: 70px;
}

.selectSym button:first-of-type {
    margin-right: 10px;
}
.selectSym button:last-of-type {
    margin-left: 10px;
}
</style>
