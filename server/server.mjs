import express from "express";
const app = express();
import path from "path";
const __dirname = path.resolve();

import { port } from "./config.mjs";

import "./websocket.mjs";

app.use(express.static("client"));
app.get("/", (_, res) => res.redirect("/lobby"));
app.get('/lobby', (req, res) => {
    res.sendFile(__dirname + "/client/pages/lobby.html");
});
app.get('/room', (req, res) => {
    const roomId = req.query.roomId;
    if (roomId) {
        res.sendFile(__dirname + "/client/pages/room.html");
    } else {
        res.redirect("/lobby");
    }
});
// Temp: Test mode
app.get('/test', () => {
    res.sendFile(__dirname + "/client/test/");
})
app.get('*', (_, res) => {
    res.redirect("/lobby");
})

import lobbyRouter from "./routers/lobby.mjs";
import roomRouter from "./routers/room.mjs";
import playerRouter from "./routers/player.mjs";
app.use(express.json()); // middleware to parse body to json
app.use('/api/lobby', lobbyRouter);
app.use('/api/room', roomRouter);
app.use('/api/player', playerRouter);

import errorHandler from "./routers/errors.mjs";
app.use(errorHandler) // middleware to handle errors

app.listen(port, () => console.log(`Listening on port: ${port}`))