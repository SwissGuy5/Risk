class Display {
    constructor(room) {
        this.room = room;

        this.mapSVG = document.getElementById("mapSVG")

        // this.lastPathSelected = null;

        this.mapSVG.onload = () => {
            this.xmlElement = this.getXmlElement();
            this.svgElements = this.getSvgElements();
            this.addSvgOnClickListeners();
            this.setupBtns();
            this.room.init();
        };
    }


    // --- Init --- //
    getXmlElement() {
        return this.mapSVG.contentDocument.children[0];
    }

    getSvgElements() {
        return this.xmlElement.getElementsByTagName("g");
    }

    addSvgOnClickListeners() {
        this.svgElements.length == 0 ? alert('=== SVG Failed to load, please RELOAD ===') : null;
        for (let i = 0; i < this.svgElements.length; i++) {
            let path = this.svgElements[i].children[0];
            path.addEventListener("mousedown", () => {
                this.svgClicked(this.svgElements[i]);
            });
        }
    }

    svgClicked(svgElement) {
        this.room.handleSvgClicked(svgElement);
        // this.lastPathSelected = this.getPathFromSvg(svgElement);
        // this.modifySvgColor(svgElement.children[0], 1);
    }

    setupBtns() {
        document.getElementById("attackBtn").addEventListener("click", (e) => {
            this.room.handleActionBtn();
        })
        document.getElementById("nextPhaseBtn").addEventListener("click", (e) => {
            this.room.handleNextPhaseBtn();
        })
    }


    // --- Displays --- //
    displayPhase(info) {
        switch(this.room.phaseName) {
            case 'Reinforcements':
                console.log(`Available Reinforcements: ${this.room.availableReinforcements}`);
                // this.updateSvgMapDisplay();
                break;
            case 'Attack':
                console.log(`Result: ${info.attackingNode - info.attackerLosses}(${info.attackingNode}-${info.attackerLosses}) : ${info.defendingNode - info.defenderLosses}(${info.defendingNode}-${info.defenderLosses})`);
                break;
            case 'Fortify':
                break;
            case 'ReceiveCards':
                break;
        }
    }

    // TODO partially move this over to the room object, this class should be purely display
    updateSvgMapDisplay() {
        this.room.nodeMap.forEach((node) => {
            const player = this.room.getPlayerFromId(node.controlledBy);
            let playerTurn = -1;
            if (player) {
                playerTurn = this.room.getPlayerTurnFromId(player.id)
            }
            const path = this.getSvgFromNodeName(node.name).children[0];
            this.modifySvgColor(path, playerTurn);
        })
    }

    modifySvgColor(path, playerTurn) {
        if (playerTurn == -1) {
            path.className.baseVal = 'default';
        } else {
            // if (path != this.lastPathSelected) {
            if (path != this.room.currentNode) {
                path.className.baseVal = `player${playerTurn}`;
            } else {
                path.className.baseVal = `player${playerTurn}Selected`;
            }
        }
    }

    // --- Helper --- //
    getSvgFromNodeName(nodeName) {
        return this.xmlElement.getElementById(nodeName);
    }

    getPathFromSvg(svgElement) {
        return svgElement.children[0];
    }
}