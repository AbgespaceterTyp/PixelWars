let activeActionId = -1;

function updateGameBoard()
{
    let gameboard = document.getElementById("gameboard");

    let gameboardrow = gameboard.getElementsByClassName("gameboardrow");
    let rowCount = 0;
    let colCount = 0;
    if(gameboardrow != null){
        rowCount = gameboardrow.length;
        if(rowCount > 0) {
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

        success: function(result){
            console.log("Loaded background image=" + result);
            gameboard.style.backgroundImage = "url(/assets/" + result + ")";
        },
        error: function(){
            console.log("Failed to load background image");
        }
    });
}

function registerActionbarListeners() {
    $(".action").click(function (event) {
        activeActionId = this.id.substring(this.id.lastIndexOf("_") + 1, this.id.length);
        console.log("Activated action with id=" + activeActionId);
    });
}

function registerCellListeners() {
    $(".gameboardcolumn").click(function (event) {
        let targetRow = this.id.substring(this.id.indexOf("_") + 1, this.id.lastIndexOf("_"));
        let targetCol = this.id.substring(this.id.lastIndexOf("_") + 1, this.id.length);
        console.log("Clicked cell at row=" + targetRow + ", col=" + targetCol);

        if(activeActionId < 0){
            alert("Bitte eine Aktion auswählen")
        } else {
            $.ajax({
                method: "GET",
                url: "/canExecuteAction/"+activeActionId+"/"+targetRow+"/"+targetCol,
                dataType: "text",

                success: function(result){
                    console.log("Action with id=" + activeActionId + ", can be executed=" + result);
                    if("true" === result){
                        executeAction(targetRow, targetCol)
                    } else {
                        alert("Die Aktion kann am ausgewählten Feld nicht ausgeführt werden")
                    }
                },
                error: function(){
                    console.log("Failed to check Action execution for action with id=" + activeActionId);
                }
            });
        }
    });
}

function executeAction(rowIndex, colIndex) {
    $.ajax({
        method: "GET",
        url: "/executeAction/"+activeActionId+"/"+rowIndex+"/"+colIndex,
        dataType: "text",

        success: function(result){
            console.log("Executed action=" + activeActionId);
        },
        error: function(){
            console.log("Failed to execute action=" + activeActionId);
        }
    });
}

$(document).ready(function() {
    updateGameBoard();
    registerActionbarListeners();
    registerCellListeners();
});