import { nanoid } from 'nanoid';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import TextEditor from './components/TextEditor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Link to={`docs/${nanoid()}`}>Create New Doc</Link>}></Route>
        <Route path="/docs/:docId" element={<TextEditor />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
