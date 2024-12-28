class Display {
    constructor(room) {
        this.room = room;

        this.mapSVG = document.getElementById("mapSVG")

        // this.lastPathSelected = null;

        this.mapSVG.onload = () => {
            this.xmlElement = this.getXmlElement();
            this.svgElements = this.getSvgElements();
            this.addTroopCountText();
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

    addTroopCountText() {
        for (let i = 0; i < this.svgElements.length; i++) {
            const path = this.svgElements[i];
            const pathBound = path.getBoundingClientRect();
            // console.log(path.getBoundingClientRect())

            const cy = Math.round(pathBound.y / 2 + pathBound.height / 4);
            const cx = Math.round(pathBound.x / 2 + pathBound.width / 4);
            const y = 4
            let x = 3;
            if (i >= 10) {
                x = 5.5;
            }
            path.innerHTML += `<circle class="gCircle" cx="${cx}" cy="${cy}px" r="1.5vh" fill="black" style="pointer-events: none;"></circle>`;
            path.innerHTML += `<text class="gText" x="${cx - x}" y="${cy + y}px" fill="white" font-size="10px" font-family="Arial" style="pointer-events: none;">${i}</text>`;        }
    }

    addSvgOnClickListeners() {
        // this.svgElements.length == 0 ? alert('=== SVG Failed to load, please RELOAD ===') : null;
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
            case "Setup":
                console.log(`Available Reinforcements: ${this.room.startingTroops}`);
                this.updateSvgMapDisplay();
                break;
            case 'Reinforcements':
                console.log(`Available Reinforcements: ${this.room.availableReinforcements}`);
                this.updateSvgMapDisplay();
                break;
            case 'Attack':
                console.log(`Result: ${info.attackingNode - info.attackerLosses}(${info.attackingNode}-${info.attackerLosses}) : ${info.defendingNode - info.defenderLosses}(${info.defendingNode}-${info.defenderLosses})`);
                if (!info.success) {
                    this.updateSvgMapDisplay(true);
                } else {
                    this.updateSvgMapDisplay();
                }
                break;
            case 'Fortify':
                break;
            case 'ReceiveCards':
                break;
        }
    }

    // TODO partially move this over to the room object, this class should be purely display
    updateSvgMapDisplay(showPrev = false) {
        this.room.nodeMap.forEach((node) => {
            const player = this.room.getPlayerFromId(node.controlledBy);
            let playerTurn = -1;
            if (player) {
                playerTurn = this.room.getPlayerTurnFromId(player.id)
            }
            const svgGroup = this.getSvgFromNodeName(node.name);
            this.modifySvgColor(svgGroup.children[0], playerTurn, showPrev);
            this.updateTroopCount(svgGroup.children[3], node.troops);
        })
    }

    modifySvgColor(path, playerTurn, showPrev = false) {
        if (playerTurn == -1) {
            path.className.baseVal = 'default';
        } else {
            if (path == (this.room.currentNode ? this.getSvgFromNodeName(this.room.currentNode.name).children[0] : null)) {
                path.className.baseVal = `player${playerTurn}Selected`;
            } else if (showPrev && path == (this.room.previousNode ? this.getSvgFromNodeName(this.room.previousNode.name).children[0] : null)) {
                path.className.baseVal = `player${playerTurn}Selected`;
            } else {
                path.className.baseVal = `player${playerTurn}`;
            }
        }
    }

    updateTroopCount(path, count) {
        const prevCount = Number(path.textContent);
        if (prevCount >= 10 && count < 10) {
            path.setAttribute("x", Number(path.getAttribute("x")) + 2.5);
        } else if (prevCount < 10 && count >= 10) {
            path.setAttribute("x", Number(path.getAttribute("x")) - 2.5);
        }
        path.textContent = count;
    }

    // --- Helper --- //
    getSvgFromNodeName(nodeName) {
        return this.xmlElement.getElementById(nodeName);
    }

    getPathFromSvg(svgElement) {
        return svgElement.children[0];
    }
}