import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./frontend/Landing";
import Login from "./frontend/Login";
import Signup from "./frontend/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
