import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./frontend/Landing";
import Login from "./frontend/Login";
import Signup from "./frontend/Signup";
import Upload from "./frontend/Upload";
import Otp from "./frontend/Otp";
import Comments from "./components/Comments";

import AboutUs from "./frontend/Aboutus";
import Homepage from "./frontend/afterlogin/Homepage";
import Profile from "./frontend/afterlogin/Profile";
import Recipes from "./frontend/afterlogin/Recipes";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />
        {/* <Route path="/recipe" element={<Comments />} /> */}
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipes" element={<Recipes />} />
      </Routes>
    </Router>

    // <Otp />

    // <Upload />
  );
}

export default App;
