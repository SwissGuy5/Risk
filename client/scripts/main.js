const graph = new Graph(JSON.parse(defaultMapJson));
console.log(graph.nodeMap);

const room = new Room(graph.nodeMap, "0000-0000-0000");