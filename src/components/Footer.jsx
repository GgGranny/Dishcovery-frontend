import React from "react";
import "../css/Footer.css";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section */}
      <div className="footer-top">
        <h2>Share Your Culinary Masterpiece?</h2>
        <p>
          Join our community of passionate home cooks and share your favorite
          recipes with food lovers worldwide.
        </p>
        <button className="share-btn">Start Sharing Now</button>
      </div>

      {/* Middle Section */}
      <div className="footer-middle">
        <div className="footer-column">
          <h3>Dishcovery</h3>
          <p>
            Discover, share, and enjoy recipes from around the world with our
            passionate cooking community.
          </p>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Browse Recipes</a></li>
            <li><a href="#">Categories</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Upload Recipe</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Categories</h4>
          <ul>
            <li><a href="#">Newari</a></li>
            <li><a href="#">Indian</a></li>
            <li><a href="#">Chinese</a></li>
            <li><a href="#">Desserts</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© 2024 Dishcovery. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
