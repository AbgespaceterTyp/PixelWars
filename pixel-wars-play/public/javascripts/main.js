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

    //gameboard.style.backgroundImage = jsRoutes.controllers.WuiController.javascriptRoutes("../images/background_woodlands.png" ).url
}

function registerActionbarListeners() {
    let actionBar = document.getElementById("actionbar");
    if(actionBar != null){
        let actions = actionBar.getElementsByClassName("action");
        for(let i = 0; actions.length; i++){
            let action = actions[i];
            if(action != null) {
                let actionId = action.id;
                console.log("registering listener for action id " + actionId);
                //action.onclick = setActionActive(actionId);
            }
        }
    }
}

function setActionActive(actionId){
    console.log("set action active " + actionId);
}

$(document).ready(function() {
    updateGameBoard()
    //registerActionbarListeners();
});