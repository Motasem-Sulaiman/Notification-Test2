require('dotenv').config();
const io = require("socket.io-client");
const port2 = process.env.PORT2 || 3001;
let host = `http://localhost:${port2}/`;
const testConnection = io.connect(host);
const mota="hello "
testConnection.emit("mota",mota)


console.log("AETHSFG")