// import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
// import Landing from "./frontend/Landing";
// import Login from "./frontend/Login";
// import Signup from "./frontend/Signup";
// import Upload from "./frontend/Upload";
// import Otp from "./frontend/Otp";
// import Homepage from "./frontend/afterlogin/Homepage";
// import Profile from "./frontend/afterlogin/Profile";
// import Recipes from "./frontend/afterlogin/Recipes";
// import UploadRecipes from "./frontend/afterlogin/UploadRecipes";

// import Setting from "./frontend/afterlogin/Setting";
// import Comments from "./components/Comments";
// import Payments from "./components/Payment";
// import AboutRecipes from "./frontend/afterlogin/AboutRecipes";
// import Community from "./frontend/afterlogin/Community";
// import PaymentSuccess from "./components/PaymentSuccess";
// import PaymentFail from "./components/PaymentFail";
// import About from "./frontend/About";
// import AboutUs from "./frontend/afterlogin/AboutUs";
// import Communities from "./frontend/Communities";


// function App() {
//   return (
//     <BrowserRouter >
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/otp" element={<Otp />} /> 
//         <Route path="/recipe" element={<Comments />} />
//         <Route path="/payment" element={<Payments />} />
//         <Route path="/homepage" element={<Homepage />} />
//         <Route path="/aboutus" element={<AboutUs />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/recipes" element={<Recipes />} />
//         <Route path="/uploadrecipes" element={<UploadRecipes />} />
//         <Route path="/setting" element={<Setting />} />
//         <Route path="/setting" element={<Setting />} />
//         <Route path="/aboutrecipes/:id" element={<AboutRecipes />} />
//         <Route path="/community" element={<Community />} />
//         <Route path="/payment/success" element={<PaymentSuccess />} />
//         <Route path="/payment/fail" element={<PaymentFail />} />
//         <Route path="/communities" element={<Communities />} />
//       </Routes>

//     </BrowserRouter>

//     // <Otp />

//     // <Upload />
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./frontend/Landing";
import Login from "./frontend/Login";
import Signup from "./frontend/Signup";
import Otp from "./frontend/Otp";
import About from "./frontend/About";
import Homepage from "./frontend/afterlogin/Homepage";
import Profile from "./frontend/afterlogin/Profile";
import Recipes from "./frontend/afterlogin/Recipes";
import UploadRecipes from "./frontend/afterlogin/UploadRecipes";
import Setting from "./frontend/afterlogin/Setting";
import Communities from "./frontend/Communities";
import Community from "./frontend/afterlogin/Community";
import AboutUs from "./frontend/afterlogin/AboutUs";
import PaymentFail from "./components/PaymentFail";
import AboutRecipes from "./frontend/afterlogin/AboutRecipes";
import PaymentSuccess from "./components/PaymentSuccess";
import Payments from "./components/Payment";
import Chat from "./frontend/afterlogin/Chat";
import CommunityChat from "./frontend/afterlogin/CommunityChat";
import Pdf from "./frontend/Pdf";
import PremiumPage from "./frontend/afterlogin/PremiumPage";
import UserProfile from "./frontend/afterlogin/UserProfile";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/about" element={<About />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/pdf" element={<Pdf name="Abhishek" />} />
        {/* 🔐 Protected Routes (NO main page needed) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/uploadrecipes" element={<UploadRecipes />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/community" element={<Community />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/checkout" element={<Payments />} />
          <Route path="/payment/fail" element={<PaymentFail />} />
          <Route path="/aboutrecipes/:id" element={<AboutRecipes />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/community/chat/:id" element={<CommunityChat />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/userprofile/:userId" element={<UserProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
