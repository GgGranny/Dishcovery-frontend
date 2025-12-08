import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./frontend/Landing";
import Login from "./frontend/Login";
import Signup from "./frontend/Signup";
import Upload from "./frontend/Upload";
import Otp from "./frontend/Otp";
import Homepage from "./frontend/afterlogin/Homepage";
import Profile from "./frontend/afterlogin/Profile";
import Recipes from "./frontend/afterlogin/Recipes";
import UploadRecipes from "./frontend/afterlogin/UploadRecipes";
import AboutUs from "./frontend/AboutUs";
import Setting from "./frontend/afterlogin/Setting";
import Comments from "./components/Comments";
import Payments from "./components/Payment";
import AboutRecipes from "./frontend/afterlogin/AboutRecipes";
import Community from "./frontend/afterlogin/Community";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/otp" element={<Otp />} /> */}
        <Route path="/recipe" element={<Comments />} />
        <Route path="/payment" element={<Payments />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/uploadrecipes" element={<UploadRecipes />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/aboutrecipes/:id" element={<AboutRecipes />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </Router>

    // <Otp />

    // <Upload />
  );
}

export default App;
