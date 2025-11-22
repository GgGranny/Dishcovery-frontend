import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">

      {/* Top Section */}
      <div className="text-center py-14 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold">
          Share Your Culinary Masterpiece?
        </h2>

        <p className="mt-2 text-sm md:text-base px-2">
          Join our community and share your recipes with food lovers worldwide.
        </p>

        <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-md text-lg hover:bg-green-700 transition">
          Start Sharing Now
        </button>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-6 max-w-7xl mx-auto py-12 border-t border-gray-700">

        {/* Column 1 */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-3">Dishcovery</h3>
          <p className="text-sm leading-relaxed">
            Discover and share recipes from around the world.
          </p>

          <div className="flex justify-center md:justify-start gap-4 text-xl mt-4">
            <FaFacebookF className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
            <FaTwitter className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Column 2 */}
        <div className="text-center md:text-left">
          <h4 className="font-bold text-lg mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-white cursor-pointer">Browse Recipes</a></li>
            <li><a className="hover:text-white cursor-pointer">Categories</a></li>
            <li><a className="hover:text-white cursor-pointer">Community</a></li>
            <li><a className="hover:text-white cursor-pointer">Upload Recipe</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="text-center md:text-left">
          <h4 className="font-bold text-lg mb-3">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-white cursor-pointer">Newari</a></li>
            <li><a className="hover:text-white cursor-pointer">Indian</a></li>
            <li><a className="hover:text-white cursor-pointer">Chinese</a></li>
            <li><a className="hover:text-white cursor-pointer">Desserts</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="text-center md:text-left">
          <h4 className="font-bold text-lg mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-white cursor-pointer">Help Center</a></li>
            <li><a className="hover:text-white cursor-pointer">Contact Us</a></li>
            <li><a className="hover:text-white cursor-pointer">Privacy Policy</a></li>
            <li><a className="hover:text-white cursor-pointer">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="py-5 text-center border-t border-gray-700 text-sm">
        © 2024 Dishcovery. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
