let activeActionId = -1;

function updateStatusBar(playerName, hp, ap) {
    document.getElementById("activePlayer").textContent = "Turn: " + playerName;
    document.getElementById("activePlayerHealth").textContent = "HP: " + hp;
    document.getElementById("activePlayerAP").textContent = "AP: " + ap;
}

function updateActionBar(actionIds, actionImagePaths) {
    activeActionId = -1;

    // Clear previous content
    let actionbar = document.getElementById("actionbar");
    while (actionbar.firstChild) {
        actionbar.removeChild(actionbar.firstChild);
    }

    // Create new actions
    for (let i = 0; i < actionIds.length; i++) {
        let actionId = actionIds[i];
        let actionImagePath = actionImagePaths[i];

        let input = document.createElement("input");
        input.id = "action_" + actionId;
        input.name = "actions"
        input.type = "radio";
        input.onclick = "";
        input.classList.add("action");

        let img = document.createElement("img");
        img.src = "/assets/" + actionImagePath;
        actionbar.appendChild(img);
        actionbar.appendChild(input);
    }
    registerActionbarListeners();
}

function showWinner(winner) {
    console.log("Player " + winner.playerNumber + " wins!");

    let gameBoard = document.getElementById("gameBoard");
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }
    let statusBar = document.getElementById("statusBar");
    statusBar.parentNode.removeChild(statusBar);

    let actionbar = document.getElementById("actionbar");
    actionbar.parentNode.removeChild(actionbar);

    gameBoard.style.height = 600 + "px";
    gameBoard.style.minHeight = 600 + "px";
    gameBoard.style.width = 600 + "px";
    gameBoard.style.minWidth = 600 + "px";

    gameBoard.style.display = "block";
    gameBoard.style.marginLeft = "auto";
    gameBoard.style.marginRight = "auto";

    gameBoard.style.backgroundImage = "url(/assets/" + winner.wonImagePath + ")";
}

function updateGameBoardContent(json) {
    let gameBoard = document.getElementById("gameBoard");
    let gameBoardCell = gameBoard.getElementsByClassName("gameBoardCell");
    // clear previous content
    for (let i = 0; i < gameBoardCell.length; i++) {
        let cell = gameBoardCell.item(i);
        cell.src = "/assets/images/placeholder.png";
    }

    // find and update cells
    for (let j = 0; j < json.length; j++) {
        let gameObj = json[j];
        let cellToUpdate = document.getElementById("gameBoardCell_" + gameObj.rowIdx + "_" + gameObj.columnIdx);
        console.log("cell src=" + cellToUpdate.src);
        cellToUpdate.src = "/assets/" + gameObj.imagePath;
    }
}

function updateGameBoardScale() {
    let gameBoard = document.getElementById("gameBoard");

    let gameBoardRow = gameBoard.getElementsByClassName("gameBoardRow");
    let rowCount = 0;
    let colCount = 0;
    if (gameBoardRow != null) {
        rowCount = gameBoardRow.length;
        if (rowCount > 0) {
            colCount = gameBoardRow.item(0).getElementsByClassName("gameBoardCell").length
        }
    }

    gameBoard.style.height = 60 * rowCount + "px";
    gameBoard.style.minHeight = 60 * rowCount + "px";

    gameBoard.style.width = 60 * colCount + "px";
    gameBoard.style.minWidth = 60 * colCount + "px";

    gameBoard.style.display = "block";
    gameBoard.style.marginLeft = "auto";
    gameBoard.style.marginRight = "auto";
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

function registerActionbarListeners() {
    $(".action").click(function () {
        activeActionId = this.id.substring(this.id.lastIndexOf("_") + 1, this.id.length);
        console.log("Activated action with id=" + activeActionId);

        updateHighlighting();
    });
}

function updateHighlighting() {
    $.ajax({
        method: "GET",
        url: "/cellsInRange/" + activeActionId,
        contentType: "application/json",
        dataType: "json",

        success: function (result) {
            console.log("Received cells to updateHighlighting");

            let gameBoard = document.getElementById("gameBoard");
            let gameBoardCell = gameBoard.getElementsByClassName("gameBoardCell");
            // clear previous highlight
            for (let i = 0; i < gameBoardCell.length; i++) {
                let cell = gameBoardCell.item(i);
                cell.classList.remove("highlight");
            }

            for (let j = 0; j < result.length; j++) {
                let tuple = result[j];
                let cellToHighlight = document.getElementById("gameBoardCell_" + tuple.rowIdx + "_" + tuple.columnIdx);
                console.log("cellIdToHighlight=" + cellToHighlight);
                cellToHighlight.classList.add("highlight");
            }
        },
        error: function () {
            console.log("Failed to receive cells to updateHighlighting for action with id=" + activeActionId);
        }
    });
}

function registerCellListeners() {
    $(".gameBoardCell").click(function () {
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

        success: function () {
            console.log("Executed action=" + activeActionId);

            updateHighlighting();
        },
        error: function () {
            console.log("Failed to execute action=" + activeActionId);
        }
    });
}

function connectWebSocket() {
    let websocket = new WebSocket("ws://localhost:9000/websocket");
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
        let data = JSON.parse(message.data);
        if (data.eventType == null) {
            console.log('default message received -> update game board');
            updateGameBoardContent(data)
        } else if (data.eventType.startsWith("PlayerWon")) {
            console.log('player won message received -> show winner');
            showWinner(data)
        } else if (data.eventType.startsWith("TurnStarted")) {
            console.log('turn started message received -> update status and action bar');
            updateStatusBar(data.playerName, data.hp, data.ap);
            updateActionBar(data.actionIds, data.actionImagePaths);
        } else if (data.eventType.startsWith("AttackResult")) {
            console.log('attack result message received -> show result');
            // TODO show result on screen
        }
    };
}

$(document).ready(function () {
    updateGameBoardScale();
    updateGameBoardBackgroundImage();

    registerActionbarListeners();
    registerCellListeners();

    connectWebSocket();
});