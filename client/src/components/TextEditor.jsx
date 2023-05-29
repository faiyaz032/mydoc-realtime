import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';

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

  useEffect(() => {
    const s = io('http://localhost:8080');
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

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
    setQuill(q);
  }, []);

  return <div className="editor-container" ref={wrapperRef}></div>;
}
