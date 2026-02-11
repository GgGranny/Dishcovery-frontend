import React from "react";

import aboutBg from "../../assets/about-bg.png";
import cuisineImg from "../../assets/cuisine.png"
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";


const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Homenavbar />

      {/* HERO SECTION */}
      <section
        className="bg-cover bg-center h-[65vh] flex items-center justify-center relative"
        style={{ backgroundImage: `url(${aboutBg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-green-300 mb-6 drop-shadow-lg">
            About Dishcovery
          </h1>
          <p className="text-2xl text-green-100 font-light italic drop-shadow-md">
            Discover. Cook. Share. Inspire.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
          <div className="w-24 h-1 bg-green-400 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              A Place Where Recipes Come Alive
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Dishcovery was created to connect passionate home cooks, food lovers,
              and aspiring chefs. What started as a small recipe-sharing community
              quickly grew into a platform where creativity and flavors meet in the
              most beautiful way.
              <br />
              <br />
              Our mission is simple — empower people to cook, explore, and share
              recipes that bring joy and meaning to their lives.
            </p>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
              src={cuisineImg}
              alt="Dishcovery kitchen"
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The foundation that guides everything we do
            </p>
            <div className="w-24 h-1 bg-green-400 mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Creativity",
                description:
                  "Encouraging unique recipe ideas and fresh new flavors.",
                icon: "🍳",
              },
              {
                title: "Community",
                description:
                  "A place where everyone can share, learn, and connect.",
                icon: "👨‍🍳",
              },
              {
                title: "Simplicity",
                description: "Making cooking easy and enjoyable for everyone.",
                icon: "🥗",
              },
              {
                title: "Quality",
                description:
                  "Every recipe is crafted with love, detail, and passion.",
                icon: "⭐",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-green-50 p-6 rounded-lg hover:bg-green-100 transition-colors duration-300"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600">
            The passionate creators behind Dishcovery
          </p>
          <div className="w-24 h-1 bg-green-400 mx-auto mt-4"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Aryan Maharjan", role: "Frontend & Leader", initials: "AM" },
            { name: "Abhishek Rai", role: "Backend Developer", initials: "AR" },
            { name: "Nirjal Phashi", role: "QA", initials: "NP" },
            { name: "Sagish Maharjan", role: "UI/UX Designer", initials: "SM" },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mx-auto mb-4">
                {member.initials}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-green-500 mb-2">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center bg-[url('/images/food-cta-bg.jpg')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join the Dishcovery Community
          </h2>
          <p className="text-xl text-green-200 mb-8">
            Share your recipes, inspire others, and explore food like never before.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-10 rounded-full transition">
            Get Started
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
