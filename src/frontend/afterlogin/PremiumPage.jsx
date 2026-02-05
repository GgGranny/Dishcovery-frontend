import React from "react";
import { NavLink } from "react-router-dom";
import { HiCheck, HiStar, HiSparkles, HiFire, HiLockOpen, HiShieldCheck } from "react-icons/hi";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";
import premiumImg from "../../assets/premium.png";
import { esewaPayment } from "../../api/Payment"; // Adjust the import path as needed

const PremiumPage = () => {
  const packages = [
    {
      name: "Basic",
      price: "Rs 0",
      period: "forever",
      features: [
        "Access to basic recipes",
        "Save up to 50 recipes",
        "Community access",
        "Basic recipe search",
      ],
      buttonText: "Current Plan",
      buttonClass: "bg-gray-200 text-gray-800 cursor-default",
      amountInNPR: 0,
    },
    {
      name: "Pro",
      price: "Rs 650",
      period: "per month",
      features: [
        "All Basic features",
        "Unlimited recipe saves",
        "Advanced search filters",
        "Ad-free experience",
        "Early access to new features",
        "Priority support",
      ],
      buttonText: "Upgrade to Pro",
      buttonClass: "bg-green-600 hover:bg-green-700 text-white",
      popular: true,
      amountInNPR: 650,
    },
    {
      name: "Ultimate",
      price: "Rs 1300",
      period: "per month",
      features: [
        "All Pro features",
        "Offline recipe access",
        "Custom meal planning",
        "Nutritional analysis",
        "Video tutorials",
        "Exclusive chef content",
        "Family sharing (up to 5 users)",
      ],
      buttonText: "Get Ultimate",
      buttonClass: "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white",
      amountInNPR: 1300,
    },
  ];

  const handlePlanSelect = async (pkg) => {
    if (pkg.name === "Basic") return; // Skip for Basic plan

    try {
      const transaction_uuid = Math.round(Math.random() * 99999).toString();
      const total_amount = pkg.amountInNPR;

      // Get signature from backend
      const data = {
        total_amount,
        transaction_uuid,
        product_code: "EPAYTEST",
      };

      const response = await esewaPayment(data);
      const { signature, signed_field_name } = response.data;

      // Create eSewa payment form
      const paymentData = {
        amount: pkg.amountInNPR,
        tax_amount: 0,
        total_amount,
        transaction_uuid,
        product_code: "EPAYTEST",
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: "http://localhost:8080/api/payment/esewa/payment-success",
        failure_url: "http://localhost:8080/api/payment/esewa/payment-failed",
        signed_field_names: signed_field_name,
        signature,
      };

      // Submit form to eSewa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      Object.entries(paymentData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Failed to process payment", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Homenavbar />
      
      {/* Hero Section with Background Image - Reduced height */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${premiumImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Black Overlay with Opacity */}
          <div className="absolute inset-0 bg-black opacity-60"></div>
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
            <HiSparkles className="text-2xl text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
            Unlock Premium Features
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Take your culinary journey to the next level with exclusive features, 
            ad-free experience, and premium content curated by top chefs.
          </p>
          
          {/* Premium Badge and CTA Button - Side by side */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-6">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-400/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 font-semibold">Trusted by 50,000+ Home Chefs</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handlePlanSelect(packages[1])} // Pro plan
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold rounded-full text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="relative">
                <HiSparkles className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute -inset-1 bg-yellow-300/20 blur-sm rounded-full group-hover:bg-yellow-300/30 transition-all duration-300"></div>
              </div>
              Start Your 7-Day Free Trial
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <HiStar className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Exclusive Recipes</h3>
            <p className="text-gray-600">
              Access chef-curated recipes and seasonal specials available only to premium members.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <HiShieldCheck className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Ad-Free Experience</h3>
            <p className="text-gray-600">
              Cook without distractions. No ads, no interruptions, just pure cooking joy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <HiLockOpen className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Advanced Features</h3>
            <p className="text-gray-600">
              Meal planning, nutritional tracking, and offline access to your favorite recipes.
            </p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Flexible plans designed for every type of home cook. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-xl p-8 relative border hover:shadow-2xl transition-all duration-300 ${
                pkg.popular ? "border-green-500 transform scale-105 shadow-green-100 hover:scale-110" : "hover:-translate-y-2"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{pkg.price}</span>
                <span className="text-gray-600">/{pkg.period}</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <HiCheck className="text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {pkg.name === "Basic" ? (
                <button
                  className={`block w-full py-3 rounded-full font-semibold text-center transition ${pkg.buttonClass}`}
                  disabled
                >
                  {pkg.buttonText}
                </button>
              ) : (
                <button
                  onClick={() => handlePlanSelect(pkg)}
                  className={`block w-full py-3 rounded-full font-semibold text-center transition ${pkg.buttonClass} hover:shadow-lg`}
                >
                  {pkg.buttonText}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <h3 className="font-bold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. No hidden fees.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <h3 className="font-bold text-lg mb-2">Do you offer family plans?</h3>
              <p className="text-gray-600">Our Ultimate plan supports up to 5 family members sharing one account.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <h3 className="font-bold text-lg mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes! Try Premium free for 7 days. No credit card required to start.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-700 rounded-full mb-6 shadow-lg">
            <HiSparkles className="text-2xl text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Ready to Elevate Your Cooking Experience?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of premium members who are already enjoying ad-free cooking, 
            exclusive recipes, and advanced features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handlePlanSelect(packages[1])} // Pro plan
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold hover:from-green-700 hover:to-emerald-800 transition shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <HiSparkles />
              Start Your Premium Journey
            </button>
            <NavLink
              to="/homepage"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white text-gray-800 font-bold border border-gray-300 hover:border-green-500 transition hover:shadow-lg"
            >
              Explore Free Features First
            </NavLink>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PremiumPage;