import Content from "./components/Content";
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Login from "./pages/Login";
import { AuthContextProvider } from "./context/AuthContext";
const { default: Layout } = require("./components/Layout");

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path="/home" element={<Layout />}/>
      </Routes>
    </Router>
  );
}
export default App;