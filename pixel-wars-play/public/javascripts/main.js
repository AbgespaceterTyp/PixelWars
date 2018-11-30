let activeActionId = -1;

/***
 * updateGameBoard()
 */
function updateGameBoard() {
    let gameboard = document.getElementById("gameboard");

    let gameboardrow = gameboard.getElementsByClassName("gameboardrow");
    let rowCount = 0;
    let colCount = 0;
    if (gameboardrow != null) {
        rowCount = gameboardrow.length;
        if (rowCount > 0) {
            colCount = gameboardrow.item(0).getElementsByClassName("gameboardcolumn").length
        }
    }

    gameboard.style.height = 60 * rowCount + "px";
    gameboard.style.minHeight = 60 * rowCount + "px";

    gameboard.style.width = 60 * colCount + "px";
    gameboard.style.minWidth = 60 * colCount + "px";

    gameboard.style.display = "block";
    gameboard.style.marginLeft = "auto";
    gameboard.style.marginRight = "auto";

    $.ajax({
        method: "GET",
        url: "/backgroundImage",
        dataType: "text",

        success: function (result) {
            console.log("Loaded background image=" + result);
            gameboard.style.backgroundImage = "url(/assets/" + result + ")";
        },
        error: function () {
            console.log("Failed to load background image");
        }
    });
}

/***
 * registerActionbarListeners()
 */
function registerActionbarListeners() {
    $(".action").click(function (event) {
        activeActionId = this.id.substring(this.id.lastIndexOf("_") + 1, this.id.length);
        console.log("Activated action with id=" + activeActionId);
        updateHighlighting();
    });
}

/***
 * updateHighlighting()
 */
function updateHighlighting() {
    $.ajax({
        method: "GET",
        url: "/cellsInRange/" + activeActionId,
        contentType : "application/json",
        dataType: "json",

        success: function (result) {
            console.log("Received cells to updateHighlighting=" + result);

            /*let gameboardcolumns = gameboard.getElementsByClassName("gameboardcolumn");
            for(let i = 0; i < gameboardcolumns.length; i++){
                let cell = gameboardcolumns.item(i);

                let cellRowIndex = cell.id.substring(cell.id.indexOf("_") + 1, cell.id.lastIndexOf("_"));
                let cellColIndex = cell.id.substring(cell.id.lastIndexOf("_") + 1, cell.id.length);
                let cellIndex = cellRowIndex + "," + cellColIndex

                if(result.contains(cellIndex)) {
                    // TODO style highlight
                } else {
                    // TODO style no highlight
                }
            }*/
        },
        error: function () {
            console.log("Failed to receive cells to updateHighlighting for action with id=" + activeActionId);
        }
    });
}

/***
 * registerCellListeners()
 */
function registerCellListeners() {
    $(".gameboardcolumn").click(function (event) {
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

/***
 * executeAction(rowIndex, colIndex)
 * @param rowIndex
 * @param colIndex
 */
function executeAction(rowIndex, colIndex) {
    $.ajax({
        method: "GET",
        url: "/executeAction/" + activeActionId + "/" + rowIndex + "/" + colIndex,
        dataType: "text",

        success: function (result) {
            console.log("Executed action=" + activeActionId);
            updateHighlighting();
        },
        error: function () {
            console.log("Failed to execute action=" + activeActionId);
        }
    });
}

$(document).ready(function () {
    updateGameBoard();
    registerActionbarListeners();
    registerCellListeners();
});