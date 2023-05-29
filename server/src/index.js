//dependencies
const dotenv = require('dotenv');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDatabase = require('./config/database');
const apiRouter = require('./routes');
const docsService = require('./services/docs.service');

//env config
dotenv.config();

const app = express();
const httpServer = createServer(app);

//api routes
app.use('/api', apiRouter);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

io.on('connection', socket => {
  socket.on('getDoc', async docId => {
    let doc;
    const existingDoc = await docsService.findDocById(docId);

    if (!existingDoc) {
      doc = await docsService.createDoc(docId);
    } else {
      doc = existingDoc;
    }

    socket.join(docId);
    socket.emit('loadDoc', doc.data);

    socket.on('sendUpdatedText', async data => {
      socket.broadcast.to(docId).emit('receiveUpdatedChanges', data);
    });

    socket.on('updateDoc', async data => {
      await docsService.updateDoc(docId, data);
    });
  });
});

const PORT = Number(process.env.PORT) || 8080;

httpServer.listen(PORT, async () => {
  console.log(`Server is alive on PORT:${PORT}`);
  await connectDatabase();
});
