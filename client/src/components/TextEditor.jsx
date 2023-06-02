//Dependencies
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import useAuth from '../ hooks/useAuth';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
];

export default function TextEditor() {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  const { docId } = useParams();

  const { token } = useAuth();

  //useEffect function to handle socket connection
  useEffect(() => {
    const s = io('http://localhost:8080', {
      query: {
        token,
      },
    });
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit('updateDoc', quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (!quill || !socket) return;

    socket.once('loadDoc', doc => {
      quill.setContents(doc);
      quill.enable();
    });

    socket.emit('getDoc', docId);
  }, [quill, socket, docId]);

  //useEffect to handle text-change and emit event to server
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

  const wrapperRef = useCallback(wrapper => {
    if (!wrapper) return;
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } });
    q.disable();
    q.setText('Loading');
    setQuill(q);
  }, []);

  return <div className="editor-container" ref={wrapperRef}></div>;
}
