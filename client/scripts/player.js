class Player {
    constructor(clientUuid, playerName = null, controlledTerritories, cards, color = 'green') {
        this.uuid = clientUuid;
        this.name = playerName;
        this.controlledTerritories = controlledTerritories;
        this.cards = cards;
        // this.color = color;
    }

    get jsonFormat() {
        return {
            uuid: this.uuid,
            name: this.playerName,
            controlledTerritories: this.controlledTerritories,
            cards: this.cards,
        }
    }
}