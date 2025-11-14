import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Homenavbar from "../components/Homenavbar";
import TrendingSection from "../components/TrendingSection";
import heroBg from "../assets/hero-bg.png";

const Homepage =()=>{
  return(
    <div>
        <Homenavbar/>

          <section
  className="relative w-full min-h-[80vh] bg-cover bg-center flex items-center"
  style={{ backgroundImage: `url(${heroBg})` }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Content */}
  <div className="relative z-10 max-w-2xl px-6 md:px-12 text-white">
    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-left">
      Discover Delicious <br /> Recipes from Around <br /> the World
    </h1>

    <p className="mt-4 text-lg opacity-90 text-left">
      Join thousands of food lovers sharing their favorite recipes.
      Cook, share, and explore culinary delights.
    </p>

    <div className="mt-8 text-left">
      <button className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-full text-white font-semibold transition">
        Explore Recipes
      </button>
    </div>
  </div>
</section>



        <TrendingSection/>

        <Footer/>
        

    </div>

  );
}
export default Homepage;