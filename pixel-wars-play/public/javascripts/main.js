function updateGameBoard()
{
    var gameboard = document.getElementById("gameboard");
    var rowCount = gameboard.getElementsByClassName("gameboardrow").length;
    var colCount = gameboard.getElementsByClassName("gameboardrow").item(0).getElementsByClassName("gameboardcolumn").length

    gameboard.style.height = 60 * rowCount + "px";
    gameboard.style.minHeight = 60 * rowCount + "px";

    gameboard.style.width = 60 * colCount + "px";
    gameboard.style.minWidth = 60 * colCount + "px";

    gameboard.style.display = "block";
    gameboard.style.marginLeft = "auto";
    gameboard.style.marginRight = "auto";

    //gameboard.style.backgroundImage = jsRoutes.controllers.WuiController.javascriptRoutes("../images/background_woodlands.png" ).url
}

$( document ).ready(function() {
    updateGameBoard()
});