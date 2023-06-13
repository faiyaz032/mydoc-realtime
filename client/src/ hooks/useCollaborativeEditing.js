import { useEffect } from 'react';

export default function (socket, quill, docId, navigate, setShowCollaborator) {
  //useEffect to handle automatic document update with the server
  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit('updateDoc', quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [quill, socket]);

  //useEffect to handle document load and enable editing
  useEffect(() => {
    if (!quill || !socket) return;

    socket.once('loadDoc', doc => {
      quill.setContents(doc.data);
      quill.enable();
    });

    socket.emit('getDoc', docId);
  }, [quill, socket, docId]);

  //useEffect to handle text-change and send the updated text to server
  useEffect(() => {
    if (!quill || !socket) return;

    const handler = (delta, _, source) => {
      if (source !== 'user') return;
      socket.emit('sendUpdatedText', delta);
    };

    quill.on('text-change', handler);

    //clear the effect
    return () => {
      quill.off('text-change', handler);
    };
  }, [quill, socket]);

  //useEffect to listen receiveUpdatedChanges from server and update the contents
  useEffect(() => {
    if (!quill || !socket) return;

    const handler = delta => {
      console.log(delta);
      quill.updateContents(delta);
    };

    socket.on('receiveUpdatedChanges', handler);

    //clear the effect
    return () => {
      socket.off('receiveUpdatedChanges', handler);
    };
  }, [quill, socket]);

  //useEffect to handle when the user is the document creator.
  useEffect(() => {
    if (!quill || !socket) return;
    socket.on('docCreator', () => {
      setShowCollaborator(true);
    });
  }, [quill, socket]);

  //useEffect to handle the case when the user is not permitted to access the document
  useEffect(() => {
    if (!quill || !socket) return;
    socket.on('notPermitted', () => {
      quill.updateContents(null);
      alert('You are not permitted to access this doc');
      navigate('/docs');
    });
  }, [quill, socket, navigate]);
}
