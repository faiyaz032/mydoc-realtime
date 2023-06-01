import { useEffect, useState } from 'react';
import useAuth from './useAuth';

export default function useAuthCheck() {
  const [authChecked, setAuthChecked] = useState(false);

  const { setToken } = useAuth();

  useEffect(() => {
    const localStorageToken = localStorage?.getItem('token');

    if (localStorageToken) {
      const token = JSON.parse(localStorageToken);
      if (token) {
        setToken(token);
      }
    }

    setAuthChecked(true);
  }, []);

  return authChecked;
}
