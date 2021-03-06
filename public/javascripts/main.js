let websocketUrl = "wss://pixel-wars.herokuapp.com/websocket";
let websocket = new WebSocket(websocketUrl);
let activeActionId = -1;
let modal;
let span;
let gameWon = false;

function updateStatusBar(playerName, hp, ap) {
    let statusBar = document.getElementById("statusBar");
    if(statusBar) {
        statusBar.player = playerName;
        statusBar.hp = hp;
        statusBar.maxHp = hp;
        statusBar.ap = ap;
        statusBar.maxAp = ap;
    }
}

function showWinner(winner) {
    console.log("Player " + winner.playerNumber + " wins!");

    let gameBoard = document.getElementById("gameBoard");
    gameBoard.style.backgroundImage = "url(/assets/" + winner.wonImagePath + ")";

    let cells = document.getElementsByClassName("gameBoardCell");
    for (let j = 0; j < cells.length; j++) {
        cells.item(j).style.zIndex = "-1";
    }
    gameWon = true;
}

function updateGameBoardContent(json) {
    let gameBoard = document.getElementById("gameBoard");
    let gameBoardCell = gameBoard.getElementsByClassName("gameBoardCellImage");
    // clear previous content
    for (let i = 0; i < gameBoardCell.length; i++) {
        let cell = gameBoardCell.item(i);
        cell.src = "/assets/images/placeholder.png";
    }

    // find and update cells
    for (let j = 0; j < json.length; j++) {
        let gameObj = json[j];
        let cellToUpdate = document.getElementById("gameBoardCellImage_" + gameObj.rowIdx + "_" + gameObj.columnIdx);
        console.log("cell src=" + cellToUpdate.src);
        cellToUpdate.src = "/assets/" + gameObj.imagePath;
    }
}

function updateGameBoardBackgroundImage() {
    $.ajax({
        method: "GET",
        url: "/backgroundImage",
        dataType: "text",

        success: function (result) {
            console.log("Loaded background image=" + result);

            let gameBoard = document.getElementById("gameBoard");
            gameBoard.style.backgroundImage = "url(/assets/" + result + ")";
        },
        error: function () {
            console.log("Failed to load background image");
        }
    });
}

function activateAction(actionId) {
    activeActionId = actionId;

    updateHighlighting();
}

function updateHighlighting() {
    $.ajax({
        method: "GET",
        url: "/cellsInRange/" + activeActionId,
        contentType: "application/json",
        dataType: "json",

        success: function (result) {
            console.log("Received cells to updateHighlighting");
            if(gameWon){
                console.log('Received message but game already won, Message will be ignored');
                return;
            }

            let gameBoardCell = document.getElementsByClassName("gameBoardCellImage");
            // clear previous highlight
            for (let i = 0; i < gameBoardCell.length; i++) {
                let cell = gameBoardCell.item(i);
                cell.classList.remove("highlight");
            }

            for (let j = 0; j < result.length; j++) {
                let tuple = result[j];
                let cellToHighlight = document.getElementById("gameBoardCellImage_" + tuple.rowIdx + "_" + tuple.columnIdx);
                cellToHighlight.classList.add("highlight");
            }
        },
        error: function () {
            console.log("Failed to receive cells to updateHighlighting for action with id=" + activeActionId);
        }
    });
}

function registerCellListeners() {
    $(".gameBoardCellImage").click(function () {
        let targetRow = this.id.substring(this.id.indexOf("_") + 1, this.id.lastIndexOf("_"));
        let targetCol = this.id.substring(this.id.lastIndexOf("_") + 1, this.id.length);
        console.log("Clicked cell at row=" + targetRow + ", col=" + targetCol);

        if (activeActionId < 0) {
            alert("Bitte eine Aktion auswählen")
        } else {
            $.ajax({
                method: "GET",
                url: "/canExecuteAction/" + activeActionId + "/" + targetRow + "/" + targetCol,
                dataType: "text",

                success: function (result) {
                    console.log("Action with id=" + activeActionId + ", can be executed=" + result);

                    if ("true" === result) {
                        executeAction(targetRow, targetCol)
                    } else {
                        alert("Die Aktion kann am ausgewählten Feld nicht ausgeführt werden")
                    }
                },
                error: function () {
                    console.log("Failed to check Action execution for action with id=" + activeActionId);
                }
            });
        }
    });
}

function executeAction(rowIndex, colIndex) {
    $.ajax({
        method: "GET",
        url: "/executeAction/" + activeActionId + "/" + rowIndex + "/" + colIndex,
        dataType: "text",

        success: function (result) {
            console.log("Executed action=" + activeActionId);

            let playerStatus = JSON.parse(result);
            updateStatusBar(playerStatus.playerName, playerStatus.hp, playerStatus.ap)
            updateHighlighting();
        },
        error: function () {
            console.log("Failed to execute action=" + activeActionId);
        }
    });
}

function setupWebsocket() {
    websocket.onopen = function () {
        console.log("Connected to Websocket");
    };

    websocket.onclose = function () {
        console.log('Connection with Websocket Closed!');
    };

    websocket.onerror = function (error) {
        console.log('Error in Websocket Occured: ' + error);
    };

    websocket.onmessage = function (message) {
        if(gameWon){
            console.log('Received message but game already won, Message will be ignored');
            return;
        }

        let data = JSON.parse(message.data);
        if (data.eventType == null) {
            console.log('default message received -> update game board');
            updateGameBoardContent(data);
        } else if (data.eventType.startsWith("PlayerWon")) {
            console.log('player won message received -> show winner');
            showWinner(data)
        } else if (data.eventType.startsWith("TurnStarted")) {
            console.log('turn started message received -> update status bar');
            updateStatusBar(data.playerName, data.hp, data.ap);
        } else if (data.eventType.startsWith("AttackResult")) {
            console.log('attack result message received -> show result');
            showHit(data.rowIdx, data.columnIdx);
        }
    };
}

function showHit(row,col) {
    let cellToUpdate = document.getElementById("gameBoardCellImage_" + row + "_" + col);
    cellToUpdate.classList.add("hit");
}

function aliveMessage() {
    console.log('sending alive message');
    websocket.send("alive");
}

$(document).ready(function () {
    updateGameBoardBackgroundImage();

    registerCellListeners();
    setupWebsocket();

    modal = document.getElementById('myModal');
    span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Send alive message to avoid socket being closed on user inactivity
    setInterval(aliveMessage, 30 * 1000);
});