import useAuth from '../ hooks/useAuth';

export default function Docs() {
  const { setToken } = useAuth();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <div>
      <button onClick={handleLogout}>Log out</button>
      <h1>All Docs</h1>
    </div>
  );
}
