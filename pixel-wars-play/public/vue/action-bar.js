let actionBarVue = new Vue({

    el: '#actionbar',

    data: {
        actions: null,
        playerNumber: null
    },

    created: function () {
        this.fetchData();
    },

    filters: {
        tooltipText: function (action) {
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
            };
            xhr.send();
        },

        actionActivated: function (actionId) {
            console.log("activate action " + actionId);
            activateAction(actionId);
        }
    },

    template: ' <div><div id="myModal" class="modal">\n' +
        '                <div class="modal-content">\n' +
        '                    <div class="modal-header">\n' +
        '                        <span class="close">&times;</span>\n' +
        '                    </div>\n' +
        '                    <div class="modal-body">\n' +
        '                        <h1>Spieler {{playerNumber}} ist am Zug.</h1>\n' +
        '                    </div>\n' +
        '                    <div class="modal-footer">\n' +
        '                        <span class="close">&times;</span>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>' +
        '<div id="actionbar" class="switch-toggle switch-candy">\n' +
        '            <span v-for="action in actions">\n' +
        '                <label class="actionContainer">\n' +
        '                    <input class="action" :id="\'action_\' + action.id" name="actions" type="radio" v-on:click="actionActivated(action.id)"/>\n' +
        '                    <img class="actionImage" :src="\'/assets/\' + action.iconPath" :title="action | tooltipText" variant="outline-success"/>\n' +
        '                </label>\n' +
        '            </span>\n' +
        '        </div></div>'
});

function registerWebSocketListeners() {
    websocket.addEventListener("message", function (event) {
        let data = JSON.parse(event.data);
        if (data.eventType != null && data.eventType.startsWith("TurnStarted")) {
            console.log('turn started message received -> update action bar');

            updateActionBar(data.playerNumber, data.actions);
        }
    });
}

function updateActionBar(playerNumber, actions) {
    console.log("updateActionBar");
    actionBarVue.playerNumber = playerNumber;
    actionBarVue.actions = actions;
    modal.style.display = "block";
}

$(document).ready(function () {
    registerWebSocketListeners();
});