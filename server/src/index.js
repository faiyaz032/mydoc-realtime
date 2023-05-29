//dependencies
const dotenv = require('dotenv');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDatabase = require('./config/database');

//env config
dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

io.on('connection', socket => {
  socket.on('sendUpdatedText', data => {
    socket.broadcast.emit('receiveUpdatedChanges', data);
  });
});

global.io = io;

const PORT = Number(process.env.PORT) || 8080;
httpServer.listen(PORT, async () => {
  console.log(`Server is alive on PORT:${PORT}`);
  await connectDatabase();
});
