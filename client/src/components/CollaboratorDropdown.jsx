/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { addCollaboratorApi, fetchUsers } from '../api';

export default function CollaboratorDropdown({ docId }) {
  const [data, setData] = useState([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const users = await fetchUsers();
      setData(users);
    };
    getUsers();
  }, []);

  useEffect(() => {
    if (docId && selectedCollaborator) {
      const addCollaborator = async () => {
        const response = await addCollaboratorApi({
          docId: docId,
          collaboratorId: selectedCollaborator,
        });
        if (response.status === 'success') {
          setSelectedCollaborator(null);
          alert(response.message);
        }
        if (response.status === 'fail') {
          alert(response.message);
        }
      };

      addCollaborator();
    }
  }, [docId, selectedCollaborator]);

  const handleSelect = event => {
    setSelectedCollaborator(event.target.value);
  };

  return (
    <div className="collaborator">
      <h4>Select an Collaborator</h4>
      <div className="select-wrapper">
        <select className="select" value={selectedCollaborator} onChange={handleSelect}>
          <option hidden>Select User</option>
          {data.map(item => (
            <option key={item._id} value={item._id} className="select-option">
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
