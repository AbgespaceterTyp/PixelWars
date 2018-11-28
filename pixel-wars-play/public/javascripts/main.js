let activeActionId = 0;

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
            console.log('Success! Loaded background image: ' + result);
            gameboard.style.backgroundImage = "url(/assets/" + result + ")";
        },
        error: function(){
            console.log('Error! Failed to load background image');
        }
    });
}

function registerActionbarListeners() {
    $('.action').click(function (event) {
        activeActionId = this.id.substring(this.id.lastIndexOf("_") + 1, this.id.length);
        console.log('Activated action with id: ' + activeActionId);
    });
}

$(document).ready(function() {
    updateGameBoard();
    registerActionbarListeners();
});