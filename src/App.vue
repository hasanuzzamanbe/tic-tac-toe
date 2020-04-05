<template>
    <span id="app">
        <el-container>
            <el-container style="height: 500px; border: 1px solid #eee">
                <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                    <h4 class="controller-head">Controllers:</h4>
                    <br />

                    <div style="margin:32px;">
                        <el-button @click="startGame" type="primary" plain>
                            <span v-if="winState==''">
                                <i class="el-icon-video-play"></i> Play
                            </span>
                            <span v-else-if="winState=='playing'">
                                <i class="el-icon-video-pause"></i> Playing...
                            </span>
                            <span v-else>
                                <i class="el-icon-refresh-right"></i> Play again
                            </span>
                        </el-button>

                        <el-divider></el-divider>
                        <div>
                            <p>Your symbol:</p>
                            <div class="choose-sign">{{huPlayer}}</div>
                        </div>
                    </div>
                </el-aside>

                <el-container>
                    <el-header class="container-header">
                        <i class="el-icon-setting" style="margin-right: 15px"></i>
                        <span v-if="winState == ''">Click the play button</span>
                        <span
                            v-else
                            :class="winState+'color'"
                        >You {{winState == 'playing' ? "are playing" : winState}} this game</span>
                    </el-header>

                    <el-main>
                        <table>
                            <tr>
                                <td
                                    @click="turnClick"
                                    v-for="i in 3"
                                    :key="i-1"
                                    class="cell"
                                    :class="winState"
                                    :id="i-1"
                                ></td>
                            </tr>
                            <tr>
                                <td
                                    @click="turnClick"
                                    v-for="i in 3"
                                    :key="i+2"
                                    class="cell"
                                    :class="winState"
                                    :id="i+2"
                                ></td>
                            </tr>
                            <tr>
                                <td
                                    @click="turnClick"
                                    v-for="i in 3"
                                    :key="i+5"
                                    class="cell"
                                    :class="winState"
                                    :id="i+5"
                                ></td>
                            </tr>
                        </table>
                        <el-dialog
                            title="Tips: Please choose a symbol, except you get random by default. "
                            :visible.sync="selectTag"
                            width="250px"
                        >
                            <div class="selectSym">
                                <p>Select symbol:</p>
                                <el-button @click="selectSym('X')">X</el-button>
                                <el-button @click="selectSym('O')">O</el-button>
                            </div>
                        </el-dialog>
                        <el-dialog title="Game Over" :visible.sync="gameover" width="250px" center>
                            <img
                                width="200"
                                v-if="winState=='lose'"
                                src="./assets/lose.png"
                                alt="Lose"
                            />
                            <img
                                width="200"
                                v-if="winState=='win'"
                                src="./assets/win.gif"
                                alt="Win"
                            />
                            <div v-if="winState=='tie'">
                                <h3 style="text-align:center;">Tie game</h3>
                                <img width="200" src="./assets/tie.png" alt="Tie" />
                            </div>

                            <span slot="footer" class="dialog-footer">
                                <el-button type="success" @click="startGame">Play Again</el-button>
                            </span>
                        </el-dialog>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </span>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            gameover: false,
            disabled: false,
            winner: false,
            winState: "",
            cells: null,
            selectTag: false,
            playingBoard: [],
            huPlayer: "O",
            aiPlayer: "X",
            winCases: [
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
            this.playingBoard = Array.from(Array(9).keys());
            this.disabled = false;
            this.selectTag = true;
            this.gameover = false;
            this.cells.forEach(element => {
                element.innerText = "";
                element.style.removeProperty("background-color");
            });
            this.winState = "playing";
        },
        selectSym(sym) {
            this.selectTag = false;
            this.huPlayer = sym;
            this.aiPlayer = sym === "O" ? "X" : "O";
            this.playingBoard = Array.from(Array(9).keys());
            if (this.aiPlayer === "X") {
                this.turn(this.bestSpot(), this.aiPlayer);
            }
        },
        turnClick(square) {
            if (
                typeof this.playingBoard[square.target.id] == "number" &&
                !this.disabled
            ) {
                this.turn(square.target.id, this.huPlayer);
                if (!this.checkTie() && !this.winner)
                    this.turn(this.bestSpot(), this.aiPlayer);
            }
        },
        turn(squareId, player) {
            this.playingBoard[squareId] = player;
            document.getElementById(squareId).innerText = player;
            let gameWon = this.checkWin(player);
            this.checkTie();
            if (gameWon) this.gameOver(gameWon);
        },
        emptySquares() {
            let pos = this.playingBoard.filter(s => typeof s == "number");
            return pos.sort(() => Math.random() - 0.5);
        },
        bestSpot() {
            return this.emptySquares()[0];
        },
        checkTie() {
            if (this.emptySquares().length === 0 && !this.winner) {
                this.declareWinner("tie");
                return true;
            }
            return false;
        },
        declareWinner(who) {
            this.gameover = true;
            this.winState = who;
            setTimeout(() => {
                this.gameover = false;
            }, 2000);
        },
        checkWin(player) {
            let plays = this.playingBoard.reduce(
                (a, e, i) => (e === player ? a.concat(i) : a),
                []
            );
            this.winner = null;
            for (let [index, win] of this.winCases.entries()) {
                if (win.every(elem => plays.indexOf(elem) > -1)) {
                    this.winner = { index: index, player: player };
                    break;
                }
            }
            return this.winner;
        },
        gameOver(gameWon) {
            for (let index of this.winCases[gameWon.index]) {
                document.getElementById(index).style.backgroundColor =
                    gameWon.player == this.huPlayer ? "#409eff" : "red";
            }
            this.disabled = true;
            this.declareWinner(
                (this.winState =
                    gameWon.player === this.huPlayer ? "win" : "lose")
            );
        }
    },
    mounted() {
        this.cells = document.querySelectorAll(".cell");
    }
};
</script>

<style>
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
    top: 100px;
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
    /* padding-bottom: 50px; */
    text-align: center;
    border-radius: 5px;
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

.el-header {
    background-color: #b3c0d1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}

.controller-head {
    padding: 14px;
    background: rgb(130, 144, 163);
    height: 32px;
    margin-top: 0px;
}
.tie {
    background: #46be46;
}
.choose-sign {
    font-size: 5em;
}
.playingcolor {
    color: rgb(6, 66, 114);
}
.wincolor {
    color: green;
}
.losecolor {
    color: rgb(233, 52, 6);
}
.tiecolor {
    color: rgb(124, 116, 5);
}
.container-header {
    text-align: right;
    font-family: monospace;
    font-size: 15px;
    color: "green";
}
</style>
