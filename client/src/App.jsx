import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import useAuthCheck from './ hooks/useAuthCheck';
import PrivateOutlet from './components/PrivateOutlet';
import PublicOutlet from './components/PublicOutlet';
import Docs from './pages/Docs';
import Login from './pages/Login';
import Register from './pages/Register';
import TextEditor from './pages/TextEditor';

function App() {
  const isAuthChecked = useAuthCheck();

  return !isAuthChecked ? (
    <div>Brewing Application</div>
  ) : (
    <Router>
      <Routes>
        <Route path="/*" element={<PublicOutlet />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/*" element={<PrivateOutlet />}>
          <Route path="docs/:docId" element={<TextEditor />} />
          <Route path="docs" element={<Docs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
