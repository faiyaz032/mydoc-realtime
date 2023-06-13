//dependencies
const http = require('http');
const { Server } = require('socket.io');
const connectDatabase = require('./config/database');
const docsService = require('./services/docs.service');
const app = require('./app');
const jwt = require('jsonwebtoken');
const AppError = require('./utils/AppError');

//create http server
const httpServer = http.createServer(app);

//configure io
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

//verify token in socket
io.use((socket, next) => {
  if (socket.handshake.query.token) {
    const { token } = socket.handshake.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) return next(new AppError(401, 'Attach the token in socket query'));
    socket.user = decoded;
    return next();
  } else {
    return next(new AppError(401, 'Authentication Error'));
  }
});
/**
 * Socket.io connection event handler.
 * @param {Object} socket - The socket object representing the client connection.
 */
io.on('connection', socket => {
  /**
   * Event handler for getting a document.
   * @param {string} docId - The ID of the document.
   * @returns {Promise} A Promise representing the asynchronous operation.
   */
  socket.on('getDoc', async docId => {
    let doc;

    // Find the document based on the docId
    const existingDoc = await docsService.findDocById(docId);

    // Check if the document exists
    if (!existingDoc) {
      // Create a new document if it doesn't exist
      doc = await docsService.createDoc(docId, socket.user._id);
    } else {
      doc = existingDoc;
    }

    // Emit an event if the user and document creator user is the same
    if (socket.user._id === doc.createdBy.toHexString()) {
      socket.emit('docCreator');
    }

    if (
      socket.user._id === doc.createdBy.toHexString() ||
      doc.collaborators.includes(socket.user._id)
    ) {
      console.log('satisfied');
      // Join the room corresponding to the docId
      socket.join(docId);

      // Emit an event to load the document in the client
      socket.emit('loadDoc', doc);
    } else {
      console.log('unsatisfied');
      socket.emit('notPermitted');
    }

    /**
     * Event handler for sending updated text.
     * @param {Object} data - The updated text data.
     */
    socket.on('sendUpdatedText', async data => {
      // Broadcast the updated changes to other clients in the same room
      socket.broadcast.to(docId).emit('receiveUpdatedChanges', data);
    });

    /**
     * Event handler for updating the document.
     * @param {Object} data - The updated document data.
     * @returns {Promise} A Promise representing the asynchronous operation.
     */
    socket.on('updateDoc', async data => {
      // Update the document based on the docId
      await docsService.updateDoc(docId, data);
    });
  });
});

// Define Port
const PORT = Number(process.env.PORT) || 8080;

//Start Server
httpServer.listen(PORT, async () => {
  console.log(`Server is alive on PORT:${PORT}`);
  await connectDatabase();
});
