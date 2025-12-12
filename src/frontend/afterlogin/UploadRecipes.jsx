import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../../components/Footer";
import Homenavbar from "../../components/Homenavbar";
import heroImg from "../../assets/recipe-bg.png";

const UploadRecipes = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipeName: "",
    recipeDescription: "",
    category: "",
    cookTime: "",
    ingredients: [""],
    steps: [""],
    recipeThumbnail: null,
    file: null,
    videoTitle: "",
    videoDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [stepsArray, setStepsArray] = useState([null]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() > payload.exp * 1000;
    } catch (err) {
      console.log(err);
      return true;
    }
  };

  const addIngredient = () =>
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, ""]
    });
    console.log(formData.steps)
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, recipeThumbnail: file });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, file });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      alert("Your login session expired. Please log in again.");
      return;
    }

    const data = new FormData();
    data.append("recipeName", formData.recipeName);
    data.append("recipeDescription", formData.recipeDescription);
    data.append("category", formData.category);
    data.append("cookTime", formData.cookTime);
    data.append("ingredients", formData.ingredients.filter(ingredient => ingredient.trim() !== "").join(","));
    data.append("steps", formData.steps.filter(step => step.trim() !== "").join(","));

    if (formData.recipeThumbnail) {
      data.append("recipeThumbnail", formData.recipeThumbnail);
    }

    if (formData.file) {
      data.append("file", formData.file);
    }

    data.append("videoTitle", formData.videoTitle);
    data.append("videoDescription", formData.videoDescription);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/recipes/upload",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upload Success:", response.data);

      // Reset form
      setFormData({
        recipeName: "",
        recipeDescription: "",
        category: "",
        cookTime: "",
        ingredients: [""],
        steps: [""],
        recipeThumbnail: null,
        file: null,
        videoTitle: "",
        videoDescription: "",
      });

      setStep(1);

      // Show success popup
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error(
        "Upload Error:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Homenavbar />

      {/* HERO SECTION */}
      <div
        className="relative w-full h-[260px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center text-white text-center">
          <h1 className="text-4xl font-semibold drop-shadow-lg">
            Share Your Recipe
          </h1>
          <p className="mt-1 opacity-90">
            Inspire others with your cooking creativity
          </p>
        </div>
      </div>

      {/* MAIN FORM CARD */}
      <div className="max-w-4xl w-full mx-auto mt-10 mb-16">
        {/* STEPPER */}
        <div className="flex justify-between mb-12 px-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex flex-col items-center w-full">
              <div
                className={`w-11 h-11 flex items-center justify-center rounded-full text-lg font-bold transition-all duration-300 ${step === num
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-300 text-gray-700"
                  }`}
              >
                {num}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {["Basic Info", "Ingredients", "Instructions", "Media", "Publish"][
                  num - 1
                ]}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-10 transition-all">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold mb-6">
                Basic Recipe Information
              </h2>

              <label className="block font-medium mb-1">Recipe Name *</label>
              <input
                type="text"
                value={formData.recipeName}
                onChange={(e) =>
                  setFormData({ ...formData, recipeName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border mb-5"
                placeholder="Enter recipe name"
              />

              <label className="block font-medium mb-1">Description *</label>
              <textarea
                value={formData.recipeDescription}
                onChange={(e) =>
                  setFormData({ ...formData, recipeDescription: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border mb-5"
                placeholder="Describe your recipe"
              />

              <label className="block font-medium mb-1">Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border mb-5"
                placeholder="e.g. Italian, Vegan"
              />

              <label className="block font-medium mb-1">Cook Time *</label>
              <input
                type="text"
                value={formData.cookTime}
                onChange={(e) =>
                  setFormData({ ...formData, cookTime: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border mb-5"
                placeholder="e.g. 30 minutes"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="bg-green-600 text-white px-7 py-3 rounded-xl"
                >
                  Continue →
                </button>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold mb-6">Ingredients</h2>
              {formData.ingredients.map((ing, i) => (
                <input
                  key={i}
                  value={ing}
                  onChange={(e) => {
                    const arr = [...formData.ingredients];
                    arr[i] = e.target.value;
                    setFormData({ ...formData, ingredients: arr });
                  }}
                  className="w-full px-4 py-3 rounded-xl border mb-3"
                  placeholder="e.g. 2 cups flour"
                />
              ))}

              <button onClick={addIngredient} className="text-green-700 mt-3">
                + Add Ingredient
              </button>

              <div className="flex justify-between mt-10">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl border"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-green-600 text-white px-7 py-3 rounded-xl"
                >
                  Continue →
                </button>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold mb-6">Instructions</h2>
              {
                formData.steps.map((stp, i) => (
                  <div key={i} className="mb-4">
                    <label className="block font-medium mb-1">Step {i + 1}</label>

                    <input
                      value={stp}
                      onChange={(e) => {
                        const updatedSteps = [...formData.steps];
                        updatedSteps[i] = e.target.value;

                        setFormData({
                          ...formData,
                          steps: updatedSteps
                        });
                      }}
                      className="w-full px-4 py-3 rounded-xl border"
                    />
                  </div>
                ))
              }


              <button onClick={addStep} className="text-green-700 mt-3">
                + Add Step
              </button>

              <div className="flex justify-between mt-10">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl border"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="bg-green-600 text-white px-7 py-3 rounded-xl"
                >
                  Continue →
                </button>
              </div>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <h2 className="text-2xl font-semibold mb-6">Media Upload</h2>

              <label className="font-medium">Thumbnail *</label>
              <label className="border-2 p-6 rounded-xl border-dashed block mb-4 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <p>Select Thumbnail Image</p>
              </label>

              {formData.recipeThumbnail && (
                <p className="text-green-600 mb-4">
                  ✓ {formData.recipeThumbnail.name} selected
                </p>
              )}

              <label className="font-medium">Video</label>
              <label className="border-2 p-6 rounded-xl border-dashed block mb-4 cursor-pointer">
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
                <p>Select Video File</p>
              </label>

              {formData.file && (
                <p className="text-green-600 mb-4">
                  ✓ {formData.file.name} selected
                </p>
              )}

              <label className="font-medium">Video Title</label>
              <input
                type="text"
                value={formData.videoTitle}
                onChange={(e) =>
                  setFormData({ ...formData, videoTitle: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border mb-4"
              />

              <label className="font-medium">Video Description</label>
              <textarea
                value={formData.videoDescription}
                onChange={(e) =>
                  setFormData({ ...formData, videoDescription: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border mb-4"
              />

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl border"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="bg-green-600 text-white px-7 py-3 rounded-xl"
                >
                  Continue →
                </button>
              </div>
            </>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <>
              <h2 className="text-2xl font-semibold mb-6">Review & Publish</h2>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <p>
                    <strong>Name:</strong> {formData.recipeName}
                  </p>
                  <p>
                    <strong>Category:</strong> {formData.category}
                  </p>
                  <p>
                    <strong>Cook Time:</strong> {formData.cookTime}
                  </p>
                  <p>
                    <strong>Ingredients:</strong> {formData.ingredients.length}
                  </p>
                  <p>
                    <strong>Steps:</strong> {formData.steps.length}
                  </p>
                  <p>
                    <strong>Thumbnail:</strong>{" "}
                    {formData.recipeThumbnail ? "Uploaded" : "Missing"}
                  </p>
                  <p>
                    <strong>Video:</strong> {formData.file ? "Uploaded" : "None"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-xl border"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-7 py-3 rounded-xl text-white ${loading ? "bg-gray-400" : "bg-green-700 hover:bg-green-800"
                    }`}
                >
                  {loading ? "Uploading..." : "Publish Recipe ↑"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black/50 absolute inset-0"></div>
          <div className="bg-white p-6 rounded-xl shadow-lg z-10 text-center max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-green-600 mb-2">Success!</h3>
            <p className="text-gray-700 mb-4">
              Your recipe has been added successfully.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UploadRecipes;
