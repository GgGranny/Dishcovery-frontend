import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./frontend/Landing";
import Login from "./frontend/Login";
import Signup from "./frontend/Signup";
import Upload from "./frontend/Upload";
import Otp from "./frontend/Otp";
import Comments from "./components/Comments";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/recipe" element={<Comments />} />
      </Routes>
    </Router>

    // <Otp />

    // <Upload />
  );
}

export default App;
