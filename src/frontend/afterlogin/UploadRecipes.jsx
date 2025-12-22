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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

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
      setUploadProgress(0);
      setUploadMessage("Starting upload...");

      // Simulate progress for small files
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 300);

      const response = await axios.post(
        "http://localhost:8080/api/recipes/upload",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
              
              // Update messages based on progress
              if (progress < 30) {
                setUploadMessage("Uploading recipe data...");
              } else if (progress < 60) {
                setUploadMessage("Uploading thumbnail image...");
              } else if (progress < 90) {
                setUploadMessage("Uploading video file...");
              } else {
                setUploadMessage("Finalizing upload...");
              }
            }
          },
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadMessage("Upload complete!");

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
      setTimeout(() => {
        setShowSuccessPopup(false);
        setUploadProgress(0);
        setUploadMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Upload Error:",
        error.response ? error.response.data : error.message
      );
      setUploadMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadMessage("");
      }, 2000);
    }
  };

  // Calculate estimated time based on file sizes
  const getEstimatedTime = () => {
    let totalSize = 0;
    if (formData.recipeThumbnail) {
      totalSize += formData.recipeThumbnail.size;
    }
    if (formData.file) {
      totalSize += formData.file.size;
    }
    
    if (totalSize === 0) return "a few seconds";
    if (totalSize < 5 * 1024 * 1024) return "10-20 seconds";
    if (totalSize < 20 * 1024 * 1024) return "20-40 seconds";
    if (totalSize < 50 * 1024 * 1024) return "40-60 seconds";
    return "1-2 minutes";
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Homenavbar />

      {/* Loading Overlay with Progress Bar */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center max-w-lg w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Uploading Recipe</h3>
            
            {/* Progress Bar Container */}
            <div className="w-full mb-6">
              {/* Progress Bar */}
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              
              {/* Progress Percentage */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-gray-700">
                  {uploadMessage}
                </span>
                <span className="text-lg font-bold text-green-600">
                  {uploadProgress}%
                </span>
              </div>
            </div>
            
            {/* Upload Details */}
            <div className="w-full space-y-4 mb-6">
              {/* Recipe Data */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Recipe Data</p>
                    <p className="text-xs text-gray-500">Name, description, ingredients, steps</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${uploadProgress > 20 ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                  {uploadProgress > 20 ? '✓ Uploaded' : 'Pending'}
                </span>
              </div>
              
              {/* Thumbnail */}
              {formData.recipeThumbnail && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded mr-3 overflow-hidden">
                        {formData.recipeThumbnail && (
                          <img 
                            src={URL.createObjectURL(formData.recipeThumbnail)} 
                            alt="Thumbnail preview" 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Thumbnail</p>
                        <p className="text-xs text-gray-500">
                          {(formData.recipeThumbnail.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${uploadProgress > 50 ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                    {uploadProgress > 50 ? '✓ Uploaded' : 'Pending'}
                  </span>
                </div>
              )}
              
              {/* Video */}
              {formData.file && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Video File</p>
                      <p className="text-xs text-gray-500">
                        {formData.file.name} • {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${uploadProgress > 80 ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                    {uploadProgress > 80 ? '✓ Uploaded' : 'Pending'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Estimated Time */}
            <div className="w-full p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm text-blue-700">Estimated time: {getEstimatedTime()}</span>
                </div>
                <span className="text-xs text-blue-500">Do not close this window</span>
              </div>
            </div>
            
            {/* Progress Stages */}
            <div className="flex items-center justify-between w-full mt-6 px-4">
              <div className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${uploadProgress > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-500">Uploading</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-200">
                <div className={`h-1 ${uploadProgress > 33 ? 'bg-green-500' : 'bg-gray-300'}`} style={{ width: '33%' }}></div>
              </div>
              <div className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${uploadProgress > 33 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-500">Processing</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-200">
                <div className={`h-1 ${uploadProgress > 66 ? 'bg-green-500' : 'bg-gray-300'}`} style={{ width: '33%' }}></div>
              </div>
              <div className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${uploadProgress > 66 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-500">Finalizing</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  className="bg-green-600 text-white px-7 py-3 rounded-xl hover:bg-green-700 transition"
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

              <button onClick={addIngredient} className="text-green-700 mt-3 hover:text-green-800 transition">
                + Add Ingredient
              </button>

              <div className="flex justify-between mt-10">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl border hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-green-600 text-white px-7 py-3 rounded-xl hover:bg-green-700 transition"
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


              <button onClick={addStep} className="text-green-700 mt-3 hover:text-green-800 transition">
                + Add Step
              </button>

              <div className="flex justify-between mt-10">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl border hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="bg-green-600 text-white px-7 py-3 rounded-xl hover:bg-green-700 transition"
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
              <label className="border-2 p-6 rounded-xl border-dashed block mb-4 cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
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
              <label className="border-2 p-6 rounded-xl border-dashed block mb-4 cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
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
                  className="px-6 py-3 rounded-xl border hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="bg-green-600 text-white px-7 py-3 rounded-xl hover:bg-green-700 transition"
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
                  className="px-6 py-3 rounded-xl border hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-7 py-3 rounded-xl text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
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
          <div className="bg-white p-8 rounded-xl shadow-lg z-10 text-center max-w-md mx-4">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Upload Complete!</h3>
              <p className="text-gray-700 mb-6">
                Your recipe has been successfully uploaded and is now live on the platform.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800 mb-1">Recipe</p>
                <p className="font-bold text-green-900">{formData.recipeName}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 mb-1">Status</p>
                <p className="font-bold text-blue-900">Published</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                setUploadProgress(0);
                setUploadMessage("");
              }}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Continue to Recipes
            </button>
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                // Reset form for new upload
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
              }}
              className="w-full py-2 mt-3 text-green-600 hover:text-green-800 transition"
            >
              Upload Another Recipe
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UploadRecipes;