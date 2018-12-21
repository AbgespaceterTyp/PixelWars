let apiURL = 'https://api.github.com/repos/vuejs/vue/commits?per_page=3&sha=';

new Vue({

    el: '#actionbar',

    data: {
        actions: null
    },

    created: function () {
        this.fetchData()
    },

    filters: {
        tooltipText: function(action) {
            return "Aktion \"" + action.description + "\" (Schaden " + action.damage + " HP, Reichweite " + action.range + ", Kosten " + action.cost + " AP)"
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
            xhr.send()
        },
    },
});