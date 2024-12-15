class Room {
    #players = [];
    #phaseNames = {
        0: 'Awaiting',
        1: 'Reinforcements',
        2: 'UseCards',
        3: 'Attack',
        4: 'Fortify',
        5: 'ReceiveCards',
    }

    constructor(nodeMap) {
        this.nodeMap = nodeMap;
        this.continentTerritoriesCount = this.getContinentsTerritoryCount();
        this.continentRewards = {
            "North America": 5,
            "South America": 2,
            "Africa": 3,
            "Europe": 5,
            "Oceania": 2,
            "Asia": 7
        };
        this.players = [new Player("0", "P1", [], []), new Player("0", "P2", [], []), new Player("0", "P3", [], [])];
        this.display = new Display(this);
        this.turn = 0;
        this.phase = 0;
        this.availableReinforcements;

        // this.initNewTurn();
    }


    // --- Helper Functions --- //
    get currentPlayerObjTurn() {
        return this.#players[this.turn % this.#players.length];
    }

    get phaseName() {
        return this.#phaseNames[this.phase];
    }
    
    get clientPlayer() {
        return this.#players.find(player => player.uuid == this.clientUuid);
    }

    getPlayerFromUuid(uuid) {
        return this.#players.find(player => player.uuid == uuid);
    }

    getPlayerTurnFromUuid(uuid) {
        return this.#players.indexOf(this.getPlayerFromUuid(uuid));
    }

    getNodeSvg(node) {
        return this.display.getSvgFromNodeName(node.name);
    }

    getContinentsTerritoryCount() {
        let continentsTerritoryCount = {};
        this.nodeMap.forEach(node => {
            if (!continentsTerritoryCount.hasOwnProperty(node.continent)) {
                continentsTerritoryCount[`${node.continent}`] = 0;
            }
            continentsTerritoryCount[`${node.continent}`]++;
        })
        return continentsTerritoryCount;
    }

    getPlayerContinentsTerritoryCount() {
        let continentsTerritoryCount = {};
        this.nodeMap.forEach(node => {
            if (!continentsTerritoryCount.hasOwnProperty(node.continent)) {
                continentsTerritoryCount[`${node.continent}`] = 0;
            }
            if (node.controlledBy == this.clientUuid) {
                continentsTerritoryCount[`${node.continent}`]++;
            }
        })
        return continentsTerritoryCount;
    }

    getNodeNameFromSvg(svgElement) {
        return this.nodeMap.get(svgElement.id);
    }

    setTerritoryOwner(node) {
        if (node.controlledBy == null) {
            const player = this.clientPlayer;
            node.controlledBy = player.uuid;
            player.controlledTerritories.push(node.name);
        }
    }

    // --- Handle Turns --- //
    initNewTurn() {
        this.turn += 1;
        this.phase = 1;

        // Reinforcements
        this.availableReinforcements = this.calculateReinforcementBonus();
        this.display.displayPhase(this.phaseName);
    }

    calculateReinforcementBonus() {
        const territoryBonuses = Math.floor(this.clientPlayer.controlledTerritories.length / 3);

        let continentBonuses = 0;
        const ownedTerritoriesByContinent = this.getPlayerContinentsTerritoryCount();
        for (const [continentName, numOfTerritories] of Object.entries(this.continentTerritoriesCount)) {
            if (ownedTerritoriesByContinent[`${continentName}`] == numOfTerritories) {
                continentBonuses += this.continentRewards[`${continentName}`]
            }
        }

        const bonusSum = territoryBonuses + continentBonuses;
        return (bonusSum < 3 ? 3 : bonusSum);
    }

    /**
     * Triggers when an svg is clicked
     * @param {element} svgElement 
     */
    handleSvgClicked(svgElement) {
        const node = this.getNodeNameFromSvg(svgElement);
        console.log(node, svgElement);
        switch(this.phaseName) {
            case 'Reinforcements':
                this.handleReinforcementPhase(node);
                break;
            case 'UseCards':
                this.handleUseCardsPhase();
                break;
            case 'Attack':
                this.handleAttackPhase();
                break;
            case 'Fortify':
                break;
            case 'ReceiveCards':
                break;
        }
    }

    handleReinforcementPhase(node) {
        if (node.controlledBy == null) {
            this.setTerritoryOwner(node);
            this.availableReinforcements -= 1;
            this.display.displayPhase(this.phaseName);
        }
        
        if (this.availableReinforcements == 0) {
            console.log(this.clientPlayer);
            this.phase += 1;
            this.handleUseCardsPhase();
        }
    }

    handleUseCardsPhase() {
        // TODO implement the card system
        this.phase += 1;
    }

    handleAttackPhase() {
        console.log('Attacking Phase');
    }

    // checkPhase() {
    //     switch(this.phase) {
    //         case 'Awaiting':
    //             this.display.displayPhase(this.phase);
    //             console.log('Waiting for Opponents to Player');
    //             break;
    //         case 'Reinforcements':
    //             this.display.displayPhase(this.phase);
    //             break;
    //         case 'UseCards':
    //             break;
    //         case 'Attack':
    //             break;
    //         case 'Fortify':
    //             break;
    //         case 'ReceiveCards':
    //             break;
    //     }
    // }


    // --- Json Format Conversion --- //
    // parseJsonMap(mapJson) {
    //     let nodeMap = new Map();
    //     mapJson.forEach(jsonNodeData => {
    //         const node = new Node(jsonNodeData.continent, jsonNodeData.name, jsonNodeData.adjacents, jsonNodeData.troops, jsonNodeData.controlledBy);
    //         nodeMap.set(jsonNodeData.name, node);
    //     });
    //     return nodeMap;
    // }

    parseJsonPlayers(playersJson) {
        let players = [];
        playersJson.forEach(player => {
            players.push(new Player(player.uuid, player.name, player.controlledTerritories, player.cards));
        })
        return players;
    }

    getJsonMap() {
        let map = [];
        this.nodeMap.forEach(node => {
            map.push({
                continent: node.continent,
                name: node.name,
                adjacents: node.adjacents,
                troops: node.troops,
                controlledBy: node.controlledBy
            })
        })
        return map;
    }

    getJsonPlayers() {
        let players = [];
        this.#players.forEach(player => {
            players.push(player.jsonFormat);
        })
        return players;
    }

    get jsonFormat() {
        return {
            nodeMap: this.getMapJson(),
            players: this.getPlayersJson()
        };
    }
}

// class Room {
//     constructor() {
//         console.log('hello');
//     }
// }