class Player {
    constructor(clientId, playerName = null, controlledTerritories = [], cards = [], color = 'green') {
        this.id = clientId;
        this.name = playerName;
        this.controlledTerritories = controlledTerritories;
        this.cards = cards;
        // this.color = color;
    }

    get jsonFormat() {
        return {
            id: this.id,
            name: this.playerName,
            controlledTerritories: this.controlledTerritories,
            cards: this.cards,
        }
    }
}