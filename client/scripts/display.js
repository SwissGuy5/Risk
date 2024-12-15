class Display {
    constructor(room) {
        this.room = room;

        this.mapSVG = document.getElementById("mapSVG");
        this.xmlElement = this.getXmlElement();
        this.svgElements = this.getSvgElements();

        this.lastPathSelected = null;

        // this.mapSVG.onload = () => {
        this.addSvgOnClickListeners();
        // };
    }

    
    // --- Init --- //
    getXmlElement() {
        console.log(this.mapSVG);
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
        this.lastPathSelected = this.getPathFromSvg(svgElement);
        this.room.handleSvgClicked(svgElement);
    }


    // --- Displays --- //
    // TODO remove direct link to room object
    displayPhase(phase) {
        switch(phase) {
            case 'Reinforcements':
                console.log(`Available Reinforcements: ${this.room.availableReinforcements}`);
                this.updateSvgMapDisplay();
                break;
            case 'UseCards':
                break;
            case 'Attack':
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
            const player = this.room.getPlayerFromUuid(node.controlledBy);
            let playerTurn = -1;
            if (player) {
                playerTurn = this.room.getPlayerTurnFromUuid(player.uuid)
            }
            const path = this.getSvgFromNodeName(node.name).children[0];
            this.modifySvgColor(path, playerTurn);
        })
    }

    modifySvgColor(path, playerTurn) {
        if (playerTurn == -1) {
            path.className.baseVal = 'default';
        } else {
            if (path != this.lastPathSelected) {
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