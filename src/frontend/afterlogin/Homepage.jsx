import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import heroBg from "../../assets/hero-bg.png";
import Homenavbar from "../../components/Homenavbar";
import TrendingSection from "../../components/TrendingSection";
import Footer from "../../components/Footer";

// ---------- Enhanced Premium Success Popup ----------
const SuccessPopup = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // auto-close after 5 seconds (gives more time to read)
    return () => clearTimeout(timer);
  }, [onClose]);

  const features = [
    { icon: "🍳", text: "Exclusive premium recipes" },
    { icon: "🚫", text: "Ad‑free browsing" },
    { icon: "⚡", text: "Early access to new features" },
    { icon: "📚", text: "Save unlimited favorites" },
  ];

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Popup Card – centered, with subtle confetti-like background */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
        <div className="relative bg-white rounded-3xl shadow-2xl p-8 text-center overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-100 rounded-full opacity-20" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-100 rounded-full opacity-20" />

          {/* Success icon with pulse effect */}
          <div className="relative mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mb-6 shadow-lg animate-pulse">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Main message */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            🎉 Welcome to Premium!
          </h2>
          <p className="text-gray-600 mb-6">
            {message || "Your account has been upgraded. Enjoy these new benefits:"}
          </p>

          {/* Feature list – clean, icon-based */}
          <div className="bg-green-50 rounded-xl p-5 mb-6 text-left space-y-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xl">{feature.icon}</span>
                <span className="text-gray-700 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Close button – gradient & shiny */}
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            Got it, let's cook! 👨‍🍳
          </button>

          {/* Auto-close hint */}
          <p className="text-xs text-gray-400 mt-4">
            This window will close automatically in 5 seconds
          </p>
        </div>
      </div>
    </>
  );
};

// ---------- Homepage (unchanged except popup integration) ----------
const Homepage = () => {
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (location.state?.paymentSuccess) {
      setPopupMessage(location.state.message);
      setShowPopup(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const closePopup = () => setShowPopup(false);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Fade-in animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -30%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      {showPopup && (
        <SuccessPopup message={popupMessage} onClose={closePopup} />
      )}

      <Homenavbar />

      {/* Hero Section */}
      <section
        className="relative w-full min-h-[80vh] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
              Discover Delicious <br /> Recipes from Around <br /> the World
            </h1>
            <p className="mt-4 text-lg opacity-90 text-white">
              Join thousands of food lovers sharing their favorite recipes.
              Cook, share, and explore culinary delights.
            </p>
            <div className="mt-8">
              <button className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-full text-white font-semibold transition">
                Explore Recipes
              </button>
            </div>
          </div>
        </div>
      </section>

      <TrendingSection />
      <Footer />
    </div>
  );
};

export default Homepage;