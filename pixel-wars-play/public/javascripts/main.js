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

    // TODO make ajax call and get correct value
    //gameboard.style.backgroundImage = "url(/assets/images/background_woodlands.png)";
}

function registerActionbarListeners() {
    $('.action').click(function (event) {
        console.log('clicked', $(this).text());
        $.ajax({
            method: "GET",
            url: "/action/1/2/3",
            success: function(){
                console.log('success!');
            },
            error: function(){
                console.log('error!');
            }
        });
    });
}

$(document).ready(function() {
    updateGameBoard()
    registerActionbarListeners();
});