// === Client Variables === //
let id = window.localStorage.getItem('id');
let clientDisplay;

// === Server Communication === //
const ws = new WebSocket("ws://localhost:5556");

ws.addEventListener("open", () => {
    send({
        type: 'authentication',
        id: id
    });
    // send({ type: 'test', id: id, content: 'Just saying hi' });
});

ws.addEventListener("message", (event) => {
    let message = JSON.parse(event.data);

    switch (message.type) {
        case 'authentication':
            id = message.id;
            window.localStorage.setItem('id', id);
            console.log(id);
            break;
        // case 'initRoom':
        //     const roomJson = message.room;
        //     const room = new Room(roomJson, id);
        //     // room.initNewTurn();
        //     // console.log(room);
        //     break;
        // case 'roundHandler':
        //     jsonMap = message.jsonMap;
        //     clientDisplay.updateNodeMap(jsonMap);
        //     break;
        case 'test':
            console.log(message);
            break;
    }
});

function send(jsonMessage) {
    ws.send(JSON.stringify(jsonMessage));
}