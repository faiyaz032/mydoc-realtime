import { useEffect, useState } from 'react';
import { fetchUsers } from '../api';

export default function CollaboratorDropdown() {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      const users = await fetchUsers();
      setData(users);
    };
    getUsers();
  }, []);

  const handleSelect = event => {
    setSelectedItem(event.target.value);
  };

  return (
    <div className="collaborator">
      <h4>Select an Collaborator</h4>
      <div className="select-wrapper">
        <select className="select" value={selectedItem} onChange={handleSelect}>
          <option hidden>Select User</option>
          {data.map(item => (
            <option key={item._id} value={item.name} className="select-option">
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
