class Room {
    #players = [];
    #phaseNames = {
        0: 'Awaiting',
        1: 'Reinforcements',
        2: 'Attack',
        3: 'Fortify'
    }

    constructor(nodeMap) {
        this.nodeMap = nodeMap;
        
        this.turn = -1;
        this.phase = 0;
        this.availableReinforcements;
        this.continentTerritoriesCount = this.getContinentTerritoriesCount();
        this.continentRewards = {
            "North America": 5,
            "South America": 2,
            "Africa": 3,
            "Europe": 5,
            "Oceania": 2,
            "Asia": 7 
        };
        this.previousNode = null;
        this.currentNode = null;

        this.#players = [new Player("1", "P1"), new Player("2", "P2"), new Player("3", "P3")];
        this.display = new Display(this);
    }

    // Load rest once display has been loaded
    init() {
        this.randomiseStartingTerritories();
        this.nextTurn();
        console.log(`--- ${this.#phaseNames[1]} Phase ---`);
    }

    // --- Handle Turns --- //
    randomiseStartingTerritories() {
        let keyArray = Array.from(this.nodeMap.keys())
        // keyArray = shuffleArray(keyArray);
        for (let i = 0; i < this.nodeMap.size; i++) {
            const node = this.nodeMap.get(keyArray[i])
            node.controlledBy = this.#players.at(i % this.#players.length).id;
            node.troops = 1;
        }

        // this.nodeMap.get("Peru").controlledBy = 1;
        // this.nodeMap.get("Brazil").controlledBy = 1;

        this.display.updateSvgMapDisplay();
    }

    nextTurn() {
        this.turn += 1
        this.phase = 1;

        // Reinforcements
        this.availableReinforcements = this.calculateReinforcements();
        this.display.displayPhase();
    }

    calculateReinforcements() {
        const ownedTerritoriesByContinent = this.getOwnedTerritoriesByContinents();

        let territoryBonus = 0;
        for (let key in ownedTerritoriesByContinent) {
            territoryBonus += ownedTerritoriesByContinent[key];
        }
        territoryBonus = Math.floor(territoryBonus / 3);

        let continentBonus = 0;
        for (const [continentName, numOfTerritories] of Object.entries(this.continentTerritoriesCount)) {
            if (ownedTerritoriesByContinent[`${continentName}`] == numOfTerritories) {
                continentBonus += this.continentRewards[`${continentName}`]
            }
        }

        const bonusSum = territoryBonus + continentBonus;
        return bonusSum < 3 ? 3 : bonusSum;
    }

    // /**
    //  * Triggers when an svg is clicked
    //  * @param {element} svgElement 
    //  */
    handleSvgClicked(svgElement) {
        const node = this.getNodeNameFromSvg(svgElement);
        this.previousNode = this.currentNode;
        this.currentNode = node;
        // console.log((this.previousNode ? this.previousNode.troops : null), this.currentNode.troops)
        // console.log(node, svgElement);

        switch(this.phaseName) {
            case 'Reinforcements':
                this.handleReinforcements(node);
                break;
            case 'Attack':
                break;
            case 'Fortify':
                break;
            case 'ReceiveCards':
                break;
        }
    }

    handleActionBtn() {
        switch (this.phaseName) {
            case "Attack":
                this.handleAttack();
                break;
            case "Fortify":
                this.handleFortification();
                break;
            default:
                break;
        }
    }

    handleNextPhaseBtn() {
        switch (this.phaseName) {
            case 'Reinforcements':
                if (this.availableReinforcements != 0) {
                    console.log("There are still some troops to allocate");
                    return;
                }
                this.phase += 1;
                this.previousNode = null;
                this.currentNode = null;
                break;
            case 'Attack':
                // Todo: Receive card if player attacked at least once
                this.phase += 1;
                break;
            case 'Fortify':
                this.nextTurn();
                break;
        }
        console.log(`--- ${this.phaseName} Phase ---`);
    }

    // Todo: Handle Card Bonuses
    handleReinforcements(node) {
        if (node.controlledBy != this.currentPlayer.id) {
            console.log("Cannot reinforce a node you do not control");
            return;
        }

        node.troops += 1;
        this.availableReinforcements -= 1;
        this.display.displayPhase();

        if (this.availableReinforcements < 1) {
            this.handleNextPhaseBtn();
        }
    }

    handleAttack() {
        // Exit when conditions aren't met
        if (!this.currentNode || !this.previousNode || !(this.previousNode.controlledBy == this.currentPlayer.id && this.currentNode.controlledBy != this.currentPlayer.id && this.previousNode.adjacents.includes(this.currentNode.name))) {
            console.log("Selected territories cannot attack or defend");
            this.previousNode = null;
            this.currentNode = null;
            return;
        }
        if (this.previousNode.troops < 2) {
            console.log("Not enough troops to attack");
            this.previousNode = null;
            this.currentNode = null;
            return;
        }

        // Init vars
        let attackingDamage = [];
        let defendingDamage = [];
        let defendingTroops = this.currentNode.troops >= 2 ? 2 : 1;
        let maxAttackingTroops = this.previousNode.troops >= 4 ? 3 : this.previousNode.troops - 1;
        let attackingTroops = promptInt(`Number of troops to attack with (max: ${maxAttackingTroops})`);
        if (attackingTroops == NaN || attackingTroops > maxAttackingTroops || attackingTroops < 1) {
            console.log("Invalid number of troops");
            return;
        }

        // Populate damage
        for (let i = 0; i < attackingTroops; i++) {
            attackingDamage.push(randInt(6) + 1);
        }
        for (let i = 0; i < defendingTroops; i++) {
            defendingDamage.push(randInt(6) + 1);
        }

        // Sort arrays
        attackingDamage.sort((a, b) => {
            return b - a;
        });
        defendingDamage.sort((a, b) => {
            return b - a;
        });

        // Calculate losses
        let attackerLosses = 0;
        let defenderLosses = 0;
        console.log(defendingDamage.length)
        for (let i = 0; i < defendingDamage.length; i++) {
            console.log(attackingDamage[i] > defendingDamage[i]);
            if (attackingDamage[i] > defendingDamage[i]) {
                defenderLosses += 1;
            } else {
                attackerLosses += 1;
            }
        }
        this.display.displayPhase({
            attackingNode: this.previousNode.troops,
            attackerLosses: attackerLosses,
            defendingNode: this.currentNode.troops,
            defenderLosses: defenderLosses
        })
        this.previousNode.troops -= attackingTroops;
        this.currentNode.troops -= defenderLosses;

        if (this.currentNode.troops < 1) {
            this.currentNode.controlledBy = this.previousNode.controlledBy;
            this.currentNode.troops = attackingTroops - attackerLosses;
        } else {
            this.previousNode.troops += attackingTroops - attackerLosses;
        }

        this.display.updateSvgMapDisplay();
    }

    handleFortification() {
        if (!this.currentNode || !this.previousNode || !(this.previousNode.troops > 1) || this.currentNode == this.previousNode) {
            console.log("Cannot fortify currently selected territories");
            this.previousNode = null;
            this.currentNode = null;
            return;
        }
        if (this.previousNode.controlledBy != this.currentPlayer.id || this.currentNode.controlledBy != this.currentPlayer.id) {
            console.log("Territories not connected");
            this.previousNode = null;
            this.currentNode = null;
            return;
        }

        // Check for existing connections between two countries
        let node;
        let territoriesToVisit = [this.previousNode];
        let continueLoop = true;
        let i = 0;
        while (continueLoop) {
            if (i >= territoriesToVisit.length) {
                console.log("No connected path exists");
                return;
            }

            node = territoriesToVisit[i];
            for (let i = 0; i < node.adjacents.length; i++) {
                let adjacentNode = this.nodeMap.get(node.adjacents[i]);
                if (this.currentNode == adjacentNode) {
                    continueLoop = false;
                }
                if (!territoriesToVisit.includes(adjacentNode) && adjacentNode.controlledBy == this.currentPlayer.id) {
                    console.log(adjacentNode.name)
                    territoriesToVisit.push(adjacentNode);
                }
            }
            i++;
        }
        
        const numberToReinforce = promptInt(`Troops to move (max: ${this.previousNode.troops - 1})`);
        if (numberToReinforce == NaN || numberToReinforce > this.previousNode.troops - 1 || numberToReinforce < 1) {
            console.log("Cannot move this amount of troops");
            this.previousNode = null;
            this.currentNode = null;
            return;
        }

        this.previousNode.troops -= numberToReinforce;
        this.currentNode.troops += numberToReinforce;
        this.nextTurn();
    }


    // --- Helper Functions --- //
    get currentPlayer() {
        return this.#players[this.turn % this.#players.length];
    }

    get phaseName() {
        return this.#phaseNames[this.phase];
    }
    
    // get clientPlayer() {
    //     return this.#players.find(player => player.id == this.clientId);
    // }

    getPlayerFromId(id) {
        return this.#players.find(player => player.id == id);
    }

    getPlayerTurnFromId(id) {
        return this.#players.indexOf(this.getPlayerFromId(id));
    }

    // getNodeSvg(node) {
    //     return this.display.getSvgFromNodeName(node.name);
    // }

    getContinentTerritoriesCount() {
        let continentsTerritoryCount = {};
        this.nodeMap.forEach(node => {
            if (!continentsTerritoryCount.hasOwnProperty(node.continent)) {
                continentsTerritoryCount[`${node.continent}`] = 0;
            }
            continentsTerritoryCount[`${node.continent}`]++;
        })
        return continentsTerritoryCount;
    }

    getOwnedTerritoriesByContinents() {
        let continentsTerritoryCount = {};
        this.nodeMap.forEach(node => {
            if (!continentsTerritoryCount.hasOwnProperty(node.continent)) {
                continentsTerritoryCount[`${node.continent}`] = 0;
            }
            if (node.controlledBy == this.currentPlayer.id) {
                continentsTerritoryCount[`${node.continent}`]++;
            }
        })
        return continentsTerritoryCount;
    }

    getNodeNameFromSvg(svgElement) {
        return this.nodeMap.get(svgElement.id);
    }

    // setTerritoryOwner(node, player) {
    //     if (node.controlledBy == null) {
    //         // const player = this.clientPlayer;
    //         node.controlledBy = player.id;
    //         // player.controlledTerritories.push(node.name);
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

//     parseJsonPlayers(playersJson) {
//         let players = [];
//         playersJson.forEach(player => {
//             players.push(new Player(player.id, player.name, player.controlledTerritories, player.cards));
//         })
//         return players;
//     }

//     getJsonMap() {
//         let map = [];
//         this.nodeMap.forEach(node => {
//             map.push({
//                 continent: node.continent,
//                 name: node.name,
//                 adjacents: node.adjacents,
//                 troops: node.troops,
//                 controlledBy: node.controlledBy
//             })
//         })
//         return map;
//     }

//     getJsonPlayers() {
//         let players = [];
//         this.#players.forEach(player => {
//             players.push(player.jsonFormat);
//         })
//         return players;
//     }

//     get jsonFormat() {
//         return {
//             nodeMap: this.getMapJson(),
//             players: this.getPlayersJson()
//         };
//     }
}