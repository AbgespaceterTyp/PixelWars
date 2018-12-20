import {
    LitElement,
    html
} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

class StatusBar extends LitElement {

    static get properties() {
        return {
            player: {
                type: String
            },
            hp: {
                type: Number
            },
            maxHp: {
                type: Number
            },
            ap: {
                type: Number
            },
            maxAp: {
                type: Number
            }
        }
    }

    render() {
        return html `
        <style>
            #statusBar {margin-top: 2%; text-align: center;}
            #activePlayer {}
            #activePlayerHealth {}
            #activePlayerAP {}
            .hp {color: red; border: red; width: ${this.hp * 32}px; height: 32px; 
            background-image: url("/assets/images/action_attack.png"); background-repeat: repeat; display: inline-block;}
            .hp-empty {color: black; border: red; width: ${((this.maxHp-this.hp) * 32) + 1}px; height: 32px; 
            background-image: url("/assets/images/action_wait.png");  background-repeat: repeat; display: inline-block;}
            .ap {color: yellow; border: yellow; width: ${this.ap * 32}px; height: 32px; background-repeat: repeat; 
            background-image: url("/assets/images/action_move.png"); background-repeat: repeat; display: inline-block;}
            .ap-empty {color: black; border: yellow; width: ${((this.maxAp-this.ap) * 32) + 1}px; height: 32px; 
            background-image: url("/assets/images/action_wait.png"); background-repeat: repeat; display: inline-block;}
        </style>
        <div id="statusBar">
            <span id="activePlayer">Turn: ${this.player}</span>
            <span id="activePlayerHealth">HP: </span> <span class="hp"></span> <span class="hp-empty"></span>
            <span id="activePlayerAP">AP: </span> <span class="ap"></span> <span class="ap-empty"></span>
        </div>
        `;
    }
}
customElements.define('status-bar', StatusBar);