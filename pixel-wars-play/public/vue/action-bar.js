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

    template: '<div id="actionbar" class="switch-toggle switch-candy">\n' +
        '            <span v-for="action in actions">\n' +
        '                <label class="actionContainer">\n' +
        '                    <input class="action" :id="\'action_\' + action.id" name="actions" type="radio" v-on:click="actionActivated(action.id)"/>\n' +
        '                    <img :src="\'/assets/\' + action.iconPath" :title="action | tooltipText" variant="outline-success"/>\n' +
        '                </label>\n' +
        '            </span>\n' +
        '        </div>'
});

function registerWebSocketListeners() {
    websocket.addEventListener("message", function(event) {
        let data = JSON.parse(event.data);
        if (data.eventType != null && data.eventType.startsWith("TurnStarted")) {
            console.log('turn started message received -> update action bar');

            activeActionId = -1;
            updateActionBar(data.actions);
        }
    });
}

function updateActionBar(actions) {
    console.log("updateActionBar");

    activeActionId = -1;
    actionBarVue.actions = actions;
}

$(document).ready(function () {
    registerWebSocketListeners();
});