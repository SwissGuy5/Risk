class Graph {
    constructor(jsonDataFile) {
        this.nodeMap = new Map();

        this.parseJSONData(jsonDataFile);
    }

    parseJSONData(jsonMapData) {
        Object.entries(jsonMapData.continents).forEach(([continentName, continentObject]) => {
            const vertices = continentObject.vertices;
            for (let vertex in vertices) {
                this.addVertex(vertex, continentName);
            }
        })

        Object.entries(jsonMapData.continents).forEach(([__, continentObject]) => {
            const vertices = continentObject.vertices;
            for (let vertex in vertices) {
                const adjacentVertices = vertices[vertex];
                adjacentVertices.forEach(adjacentVertex => this.addEdge(vertex, adjacentVertex));
            }
        })
    }

    addVertex(nodeName, nodeContinent) {
        if (this.nodeMap.has(nodeName)) {
            return;
        }

        const node = new Node(nodeName, nodeContinent);
        this.nodeMap.set(nodeName, node);
    }

    getVertex(vertexName) {
        return this.nodeMap.get(vertexName);
    }

    addEdge(sourceNodeName, destinationNodeName) {
        const sourceNode = this.getVertex(sourceNodeName);
        const destinationNode = this.getVertex(destinationNodeName);

        // sourceNode.addAdjacent(destinationNode);
        // destinationNode.addAdjacent(sourceNode);

        sourceNode.addAdjacent(destinationNodeName);
        destinationNode.addAdjacent(sourceNodeName);
    }

    removeVertex(nodeToRemoveName) {
        const nodeToRemove = this.nodeMap.get(nodeToRemoveName);

        for (const adjacentNodeName of nodeToRemove.getAdjacents()) {
            const adjacentNode = this.getVertex(adjacentNodeName);
            adjacentNode.removeAdjacent(nodeToRemoveName);
        }

        return this.nodeMap.delete(nodeToRemoveName);
    }

    removeEdge(sourceNodeName, destinationNodeName) {
        const sourceNode = this.nodeMap.get(sourceNodeName);
        const destinationNode = this.nodeMap.get(destinationNodeName);

        if (sourceNode && destinationNode) {
            sourceNode.removeAdjacent(destinationNodeName);
            destinationNode.removeAdjacent(sourceNodeName);
        }
    }

    getVertices() {
        return this.nodeMap;
    }

    // bfs(key) {
    //     if (this.nodeMap.has(key) == false) {
    //         return;
    //     }

    //     const first = this.nodeMap.get(key);
    //     // console.log(first);
    //     let visited = [first];
    //     let queue = [...first.getAdjacents()];

    //     while (queue.length > 0) {
    //         const node = queue.shift();
    //         // console.log(node);
    //         visited.push(node);
    //         node.getAdjacents().forEach(childNode => {
    //             if (visited.some(e => e.key == childNode.key) == false) {
    //                 queue.push(childNode)
    //             }
    //         });
    //     }
    // }
}