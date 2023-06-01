import { useState } from 'react';
import useAuth from '../ hooks/useAuth';
import { registerApi } from '../api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { setToken } = useAuth() || {};

  const handleSubmit = async e => {
    e.preventDefault();
    //api request
    const data = await registerApi({ name, email, password });
    //handle error case
    if (data.status === 'fail' || data.status !== 'success') {
      setError(data.message);
    }
    //store the token in context and local storage
    setToken(data.accessToken);
    localStorage.setItem('token', JSON.stringify(data.accessToken));
    //TODO: redirect to a all docs page
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="login-input"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type="submit" className="login-button">
          Register
        </button>
      </form>
    </div>
  );
}
