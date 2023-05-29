require('dotenv').config();
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

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
httpServer.listen(PORT, () => console.log(`Server is alive on PORT:${PORT}`));
