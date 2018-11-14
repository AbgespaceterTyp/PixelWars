function updateGameBoard(rowCount, colCount)
{
    var gameboard = document.getElementById("gameboard");

    gameboard.style.height = "" + 60 * rowCount + "px";
    gameboard.style.minHeight = "" + 60 * rowCount + "px";

    gameboard.style.width = "" + 60 * colCount + "px";
    gameboard.style.minWidth = "" + 60 * colCount + "px";
}

$( document ).ready(function() {
    console.log( "setting gameboard size" );

    updateGameBoard(12,12)
});