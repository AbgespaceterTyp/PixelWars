let actionBarVue = new Vue({

    el: '#actionbar',

    data: {
        actions: null
    },

    created: function () {
        this.fetchData();
    },

    filters: {
        tooltipText: function(action) {
            return "Aktion \"" + action.description + "\" (Schaden " + action.damage + " HP, Reichweite " + action.range + ", Kosten " + action.cost + " AP)";
        }
    },

    methods: {
        fetchData: function () {
            let xhr = new XMLHttpRequest();
            let self = this;
            xhr.open('GET', "/actions");
            xhr.onload = function () {
                self.actions = JSON.parse(xhr.responseText);
                console.log(xhr.responseText);
            };
            xhr.send();
        },
        
        actionActivated: function (actionId) {
            console.log("activate action " + actionId);
            activateAction(actionId);
        }
    },
});

function registerWebSocketListeners() {
    websocket.addEventListener("message", function(event) {
        let data = JSON.parse(event.data);
        if (data.eventType != null && data.eventType.startsWith("TurnStarted")) {
            console.log('turn started message received -> update action bar');
            updateActionBar();
        }
    });
}

function updateActionBar() {
    console.log("updateActionBar");

    activeActionId = -1;
    actionBarVue.fetchData();
}

$(document).ready(function () {
    registerWebSocketListeners();
});