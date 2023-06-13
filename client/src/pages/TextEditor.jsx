//Dependencies
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import useAuth from '../ hooks/useAuth';
import useCollaborativeEditing from '../ hooks/useCollaborativeEditing';
import CollaboratorDropdown from '../components/CollaboratorDropdown';

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
  const [showCollaborator, setShowCollaborator] = useState(false);

  //extract the docId
  const { docId } = useParams();

  //get the authenticated token
  const { token } = useAuth();

  //useNavigate hook for further navigation
  const navigate = useNavigate();

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
  }, [token]);

  useCollaborativeEditing(socket, quill, docId, navigate, setShowCollaborator);

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

  return (
    <div>
      {showCollaborator && <CollaboratorDropdown docId={docId} />}
      <div className="editor-container" ref={wrapperRef}></div>
    </div>
  );
}
