class Node {
    constructor(name, continent, adjacents = [], controlledBy = null) {
        this.adjacents = adjacents;
        this.name = name;
        this.continent = continent;
        this.svgElement = null;
        this.troops = 0;
        this.controlledBy = controlledBy;
    }

    addAdjacent(nodeName) {
        if (!this.adjacents.includes(nodeName)) {
            this.adjacents.push(nodeName);
        }
    }

    removeAdjacent(nodeName) {
        const index = this.adjacents.indexOf(nodeName);
        if(index > -1) {
            this.adjacents.splice(index, 1);
        }
    }

    getAdjacents() {
        return this.adjacents;
    }

    // isAdjacent(nodeName) {
    //     return this.adjacents.indexOf(nodeName) > -1;
    // }
}