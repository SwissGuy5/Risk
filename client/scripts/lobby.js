// === Get User Input === //
const roomCodeInput = document.getElementById('roomCodeInput');
const joinRoomBtn = document.getElementById('joinRoomBtn');
joinRoomBtn.addEventListener('click', joinRoom);
roomCodeInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
        joinRoom();
    }
});

const newRoomBtn = document.getElementById('newRoomBtn');
newRoomBtn.addEventListener('click', newRoom);

// === Server Communication === //
async function newRoom() {
    const bodyObj = {
        id: id
    };
    const data = await fetchServer('/newRoom', bodyObj);
    window.localStorage.setItem('roomId', data.roomId);
    window.location.replace(json.redirect);
    console.log(data);
}
async function joinRoom() {
    const bodyObj = {
        id: id,
        roomCode: roomCodeInput.value
    };
    const data = await fetchServer('/joinRoom', bodyObj);
    console.log(data);
}