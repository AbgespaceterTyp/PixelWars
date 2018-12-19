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
        <div id="statusBar">
            <span id="activePlayer">Turn: ${this.player}</span>
            <span id="activePlayerHealth">HP: ${this.hp} of ${this.maxHp}</span>
            <span id="activePlayerAP">AP: ${this.ap} of ${this.maxAp}</span>
        </div>
        `;
    }
}
customElements.define('status-bar', StatusBar);