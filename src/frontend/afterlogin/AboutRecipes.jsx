import React, { useState, useEffect, useReducer, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { AiFillFire } from "react-icons/ai";
import { GiKnifeFork } from "react-icons/gi";
import Hls from "hls.js";

// Import API functions
import {
  getRecipeById,
  parseSteps,
  getUserProfilePicture,
  processProfilePicture,
  getVideoStreamUrl,
  getVideoMetadata,
  getComments,
  postComment,
  reactToComment,
  formatDate,
  renderIngredients,
  extractComments,
  getSimilarRecipes,
  processSimilarRecipes
} from "../../api/Recipe";
import axios from "axios";

const AboutRecipes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [postingComment, setPostingComment] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [authorId, setAuthorId] = useState(null);
  const [authorData, setAuthorData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [loadingSimilarRecipes, setLoadingSimilarRecipes] = useState(false);
  const [similarRecipesError, setSimilarRecipesError] = useState("");



  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "User";
  const currentUserId = localStorage.getItem("userid");

  // Helper function for fallback author data
  const getFallbackAuthorData = (recipeData) => {
    const authorName = recipeData?.username || "Recipe Author";

    return {
      displayName: authorName,
      bio: "Passionate about creating delicious and healthy recipes"
    };
  };

  // Function to fetch similar recipes
  const fetchSimilarRecipesData = async (recipeId) => {
    if (!recipeId || !token) {
      console.log("Cannot fetch similar recipes: no recipeId or token");
      setSimilarRecipesError("Please login to view similar recipes");
      return;
    }

    setLoadingSimilarRecipes(true);
    setSimilarRecipesError("");

    try {
      const response = await getSimilarRecipes(recipeId);
      const filteredRecipes = processSimilarRecipes(response, recipeId);

      if (filteredRecipes.length === 0) {
        setSimilarRecipesError("No similar recipes found for this recipe.");
      }

      setSimilarRecipes(filteredRecipes);
    } catch (err) {
      console.error("Failed to fetch similar recipes:", err);
      if (err.response) {
        if (err.response.status === 401) {
          setSimilarRecipesError("Please login to view similar recipes");
        } else if (err.response.status === 404) {
          setSimilarRecipesError("Similar recipes feature not available");
        } else if (err.response.status === 500) {
          setSimilarRecipesError("Server error loading similar recipes");
        } else {
          setSimilarRecipesError(`Error ${err.response.status}: Unable to load similar recipes`);
        }
      } else if (err.request) {
        setSimilarRecipesError("Network error. Please check your connection.");
      } else {
        setSimilarRecipesError("Unable to load similar recipes at the moment.");
      }
      setSimilarRecipes([]);
    } finally {
      setLoadingSimilarRecipes(false);
    }
  };

  // Function to fetch user profile by userid - simplified without getUserData
  const fetchUserProfile = async (userid) => {
    if (!userid || !token) {
      console.log("No userid or token available");
      return;
    }

    setProfileLoading(true);
    try {
      const response = await getUserProfilePicture(userid);

      if (response && response.data && response.data !== "no user profile") {
        const pictureUrl = processProfilePicture(response.data);
        setProfilePictureUrl(pictureUrl);
      } else {
        console.log("No profile picture found in database");
        setProfilePictureUrl(""); // Will show placeholder
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      // Don't show error to user, just use placeholder
      setProfilePictureUrl("");
    } finally {
      setProfileLoading(false);
    }
  };

  // SIMPLIFIED: Use recipe data directly for author info
  const setupAuthorData = (recipeData) => {
    if (!recipeData) return;

    // Create author data directly from recipe
    const authorInfo = {
      displayName: recipeData.username || "Recipe Author",
      bio: "Food enthusiast sharing delicious recipes"
    };

    setAuthorData(authorInfo);

    // Try to fetch profile picture if userid exists
    if (recipeData.userid) {
      setAuthorId(recipeData.userid);
      fetchUserProfile(recipeData.userid).catch(err => {
        console.log("Profile picture fetch optional, using placeholder:", err.message);
      });
    } else if (recipeData.userId) {
      setAuthorId(recipeData.userId);
      fetchUserProfile(recipeData.userId).catch(err => {
        console.log("Profile picture fetch optional, using placeholder:", err.message);
      });
    }
  };

  // Fetch recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!token) {
        setError("You are not logged in. Please login to view recipes.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const data = await getRecipeById(id);

        if (!data || Object.keys(data).length === 0) {
          throw new Error("Recipe data is empty");
        }

        const cleanSteps = parseSteps(data.steps);

        // Handle video
        if (data.videoId) {
          setVideoUrl(getVideoStreamUrl(data.videoId));

          const videoMetadata = getVideoMetadata(data.video, data.recipeName);
          setVideoTitle(videoMetadata.title);
          setVideoDescription(videoMetadata.description);
        }

        // Set recipe data
        setRecipe({ ...data, steps: cleanSteps });

        // Setup author data directly from recipe (NO API CALL)
        setupAuthorData(data);

        // Fetch similar recipes
        fetchSimilarRecipesData(id);

      } catch (err) {
        console.error("Recipe fetch error:", err);

        if (err.response) {
          switch (err.response.status) {
            case 401:
              setError("Your session has expired. Please login again.");
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.removeItem("userid");
              navigate("/login");
              break;
            case 403:
              setError("You don't have permission to view this recipe.");
              break;
            case 404:
              setError("Recipe not found.");
              break;
            default:
              setError(`Failed to load recipe: ${err.response.statusText}`);
          }
        } else if (err.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError("Failed to load recipe. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, token, navigate]);

  // custom video player
  const VideoPlayer = ({ src, title }) => {

    const DEFAULT_COUNTDOWN_SECONDS = 10;
    const API_AD_ENDPOINT = "http://localhost:8080/api/ad/v1";
    // Refs
    const videoRef = useRef(null);

    // State - Video playback
    const [videoError, setVideoError] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true);

    // State - Ad management
    const [adUrl, setAdUrl] = useState("");
    const [isPlayingAd, setIsPlayingAd] = useState(false);
    const [skipCountdown, setSkipCountdown] = useState(DEFAULT_COUNTDOWN_SECONDS);
    const [canSkip, setCanSkip] = useState(false);

    // Effect: Fetch ad on component mount
    useEffect(() => {
      const fetchAd = async () => {
        try {
          const response = await axios.get(API_AD_ENDPOINT, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            responseType: 'blob', // Important: Handle binary video data
          });

          if (response.data && response.data.size > 0) {
            // Create object URL from blob for video playback
            const videoBlob = new Blob([response.data], {
              type: response.headers['content-type'] || 'video/mp4'
            });
            const videoBlobUrl = URL.createObjectURL(videoBlob);
            setAdUrl(videoBlobUrl);
          }
        } catch (err) {
          console.error("Failed to fetch ad:", err);
          // Silently fail - video will play without ad
        }
      };

      fetchAd();

      // Cleanup: Revoke blob URL when component unmounts
      return () => {
        if (adUrl) {
          URL.revokeObjectURL(adUrl);
        }
      };
    }, []);

    // Effect: Handle countdown timer for ad skip functionality
    useEffect(() => {
      if (!isPlayingAd) return;

      if (skipCountdown > 0) {
        const timer = setTimeout(() => {
          setSkipCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
      } else {
        setCanSkip(true);
      }
    }, [isPlayingAd, skipCountdown]);

    // Handler: Start video playback (with or without ad)
    const startVideo = (playAd = true) => {
      setShowOverlay(false);

      const video = videoRef.current;
      if (!video) {
        console.error("Video element not found");
        return;
      }

      if (playAd && adUrl) {
        playAdVideo(video);
      } else {
        playMainVideo(video);
      }
    };

    // Helper: Play advertisement video
    const playAdVideo = (video) => {
      setIsPlayingAd(true);
      setSkipCountdown(DEFAULT_COUNTDOWN_SECONDS);
      setCanSkip(false);

      video.src = adUrl;
      video.controls = false;
      video.muted = true; // Prevent autoplay block in browsers
      video.load();

      video.oncanplay = () => {
        video.play().catch((error) => {
          console.error("Autoplay failed:", error);
          setShowOverlay(true); // Show overlay if autoplay blocked
        });
      };
    };

    // Helper: Play main content video
    const playMainVideo = (video) => {
      setIsPlayingAd(false);

      video.src = src;
      video.controls = true;
      video.muted = false;
      video.load();

      video.play().catch((error) => {
        console.error("Video playback failed:", error);
        setShowOverlay(true);
      });
    };

    // Handler: Skip ad and play main video
    const handleSkipAd = () => {
      if (!canSkip) return;
      startVideo(false);
    };

    // Handler: Video ended - transition from ad to main video
    const handleVideoEnded = () => {
      if (isPlayingAd) {
        startVideo(false); // Play main video after ad ends
      }
    };

    // Handler: Retry video loading after error
    const handleRetry = () => {
      setVideoError(false);
      setShowOverlay(true);
    };

    return (
      <div className="video-container relative">
        <video
          ref={videoRef}
          className="w-full h-64 md:h-96 rounded-lg"
          onEnded={handleVideoEnded}
          onError={() => setVideoError(true)}
          aria-label={title || "Video player"}
        />

        {/* Play button overlay */}
        {showOverlay && !videoError && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer z-10 rounded-lg"
            onClick={() => startVideo(true)}
            role="button"
            aria-label="Play video"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                startVideo(true);
              }
            }}
          >
            <div className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-colors">
              <svg
                className="w-8 h-8 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M6 4l12 6-12 6V4z" />
              </svg>
            </div>
          </div>
        )}

        {/* Skip ad button */}
        {isPlayingAd && (
          <div className="absolute top-4 right-4 z-20">
            <button
              disabled={!canSkip}
              onClick={handleSkipAd}
              className={`px-4 py-2 rounded bg-green-500 text-white text-sm font-medium shadow transition-colors ${canSkip
                ? "hover:bg-green-600 cursor-pointer"
                : "opacity-60 cursor-not-allowed"
                }`}
              aria-label={canSkip ? "Skip advertisement" : `Skip available in ${skipCountdown} seconds`}
            >
              {canSkip ? "Skip Ad" : `Skip in ${skipCountdown}s`}
            </button>
          </div>
        )}

        {/* Video error message */}
        {videoError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">
              Video cannot be loaded. The video might be unavailable or the format may not be supported.
            </p>
            <button
              onClick={handleRetry}
              className="mt-2 text-sm text-red-600 underline hover:text-red-700 transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    );
  };



  // Fetch comments
  const fetchComments = async () => {
    if (!token || !id) return;

    try {
      const response = await getComments(id);
      const commentsArray = extractComments(response);

      const sortedComments = commentsArray.sort((a, b) =>
        a.createdAt && b.createdAt ? new Date(b.createdAt) - new Date(a.createdAt) : 0
      );

      setCommentsList(sortedComments);

      const likesState = {};
      sortedComments.forEach(comment => {
        const commentId = comment.id || comment.commentId;
        if (commentId) {
          likesState[commentId] = {
            likes: comment.likesCount || 0,
            dislikes: comment.dislikesCount || 0,
            userReaction: comment.userReaction || null
          };
        }
      });
      setCommentLikes(likesState);

    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setCommentsList([]);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id, token]);

  // Handle comment like/dislike
  const handleCommentReaction = async (commentId, type) => {
    if (!token) {
      alert("Please login to react to comments");
      navigate("/login");
      return;
    }

    const currentState = commentLikes[commentId] || { likes: 0, dislikes: 0, userReaction: null };

    // Optimistic update
    let newLikes = currentState.likes;
    let newDislikes = currentState.dislikes;
    let newUserReaction = type;

    if (currentState.userReaction === type) {
      // Remove reaction
      if (type === "LIKE") {
        newLikes = Math.max(0, newLikes - 1);
      } else {
        newDislikes = Math.max(0, newDislikes - 1);
      }
      newUserReaction = null;
    } else {
      // Add or change reaction
      if (type === "LIKE") {
        newLikes++;
        if (currentState.userReaction === "DISLIKE") {
          newDislikes = Math.max(0, newDislikes - 1);
        }
      } else {
        newDislikes++;
        if (currentState.userReaction === "LIKE") {
          newLikes = Math.max(0, newLikes - 1);
        }
      }
    }

    // Update local state
    setCommentLikes({
      ...commentLikes,
      [commentId]: {
        likes: newLikes,
        dislikes: newDislikes,
        userReaction: newUserReaction
      }
    });

    try {
      await reactToComment(commentId, type);
      fetchComments();
    } catch (err) {
      console.error("Like/Dislike failed:", err);
      fetchComments();
    }
  };

  // Post comment
  const handlePostComment = async () => {
    if (!comment.trim() || !token || postingComment || !id) {
      return;
    }

    setPostingComment(true);
    try {
      await postComment(id, comment.trim(), username);
      setComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to post comment:", err);

      let errorMessage = "Failed to post comment. Please try again.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "You need to be logged in to post comments.";
          navigate("/login");
        } else if (err.response.status === 400) {
          errorMessage = "Invalid comment. Please check your input.";
        } else if (err.response.status === 403) {
          errorMessage = "You don't have permission to post comments.";
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      alert(errorMessage);
    } finally {
      setPostingComment(false);
    }
  };

  // Function to render star ratings for similar recipes
  const renderSimilarRecipeStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="w-3 h-3 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <FaStar className="w-3 h-3 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
        ))}
      </div>
    );
  };

  const staticNutrients = {
    Calories: "250 kcal",
    Protein: "10 g",
    Carbohydrates: "35 g",
    Fat: "8 g",
    Fiber: "5 g",
    Sugar: "7 g",
  };

  const rating = 4.7;
  const reviews = 88;
  const totalStars = 5;

  // Function to manually retry fetching similar recipes
  const retrySimilarRecipes = () => {
    if (recipe) {
      fetchSimilarRecipesData(recipe.recipeId || recipe.id || id);
    }
  };

  // Navigate to author profile if possible - CORRECTED VERSION
  const navigateToAuthorProfile = () => {
    // Use authorId if available, otherwise use recipe.userid
    const profileId = authorId || recipe?.userid;

    if (profileId) {
      navigate(`/userprofile/${profileId}`);
    } else if (recipe?.username) {
      // Fallback to username if userid not available
      navigate(`/profile/username/${recipe.username}`);
    } else {
      alert("Author profile not available");
    }
  };

  if (loading)
    return (
      <div className="w-full min-h-screen bg-white">
        <Homenavbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 text-sm">Loading recipe...</p>
          </div>
        </div>
        <Footer />
      </div>
    );

  if (error || !recipe)
    return (
      <div className="w-full min-h-screen bg-white">
        <Homenavbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-bold text-green-500 mb-4">Oops!</h2>
            <p className="text-gray-600 mb-4">{error || "Recipe not found"}</p>
            <button
              onClick={() => navigate("/recipes")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Back to Recipes
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );


  const handelAdCheck = () => {
    console.log("hello there")
  }
  return (
    <div className="w-full min-h-screen bg-white text-gray-900">
      <Homenavbar />
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.recipeName}</h1>
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              {[...Array(totalStars)].map((_, idx) =>
                idx < Math.floor(rating) ? (
                  <FaStar key={idx} className="text-yellow-400 text-base" />
                ) : (
                  <FaRegStar key={idx} className="text-gray-300 text-base" />
                )
              )}
              <span className="font-semibold ml-1">{rating.toFixed(1)}</span>
              <span>({reviews} Reviews)</span>
            </div>
            <p className="text-gray-700 text-sm">{recipe.description}</p>
          </div>

          {/* Image */}
          <div>
            {recipe.thumbnail ? (
              <img
                src={`data:image/jpeg;base64,${recipe.thumbnail}`}
                alt={recipe.recipeName}
                className="w-100 h-64 object-cover rounded-xl shadow"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x400?text=Recipe+Image";
                }}
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                <GiKnifeFork className="text-gray-400 text-4xl" />
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-4">
              {["ingredients", "instructions", "video", "nutrients"].map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 px-1 capitalize text-sm font-medium relative ${activeTab === tab
                    ? "text-green-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-t"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === "ingredients" && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h2 className="font-semibold mb-4 text-lg">Ingredients</h2>
                <ul className="space-y-3">
                  {renderIngredients(recipe).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <input type="checkbox" className="w-5 h-5 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "instructions" && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h2 className="font-semibold mb-4 text-lg">Instructions</h2>
                <ol className="space-y-4">
                  {recipe.steps?.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white text-sm font-semibold rounded-full flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === "video" && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h2 className="font-semibold mb-4 text-lg">Video Tutorial</h2>

                {/* Video Player */}
                <VideoPlayer src={videoUrl} title={videoTitle} />

                {/* Video Title and Description */}
                <div className="mt-6 space-y-4">
                  {videoTitle && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{videoTitle}</h3>
                      <div className="h-1 w-16 bg-green-500 rounded-full"></div>
                    </div>
                  )}

                  {videoDescription && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-2">About this video:</h4>
                      <p className="text-gray-600">{videoDescription}</p>
                    </div>
                  )}

                  {/* Video Metadata */}
                  {recipe.video && (
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                      {recipe.video.uploadedAt && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Uploaded:</span>
                          <span>{new Date(recipe.video.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      {recipe.video.contentType && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Format:</span>
                          <span className="px-2 py-1 bg-gray-100 rounded">{recipe.video.contentType.split('/')[1]}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "nutrients" && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h2 className="font-semibold mb-4 text-lg">Nutrition Facts</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(staticNutrients).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between hover:bg-gray-100 transition"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        {(key === "Calories" && <AiFillFire className="text-green-600 text-lg" />) ||
                          (key === "Protein" && <GiKnifeFork className="text-green-600 text-lg" />)}
                        {key}
                      </span>
                      <span className="font-semibold text-green-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="font-semibold mb-6 text-lg">Comments ({commentsList.length})</h2>

              {/* Add Comment */}
              <div className="mb-8">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this recipe..."
                  className="w-full border border-gray-300 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    Logged in as: <span className="font-semibold">{username}</span>
                  </span>
                  <button
                    onClick={handlePostComment}
                    disabled={!comment.trim() || postingComment}
                    className={`px-5 py-2 rounded-lg font-medium ${!comment.trim() || postingComment
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                  >
                    {postingComment ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {commentsList.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  commentsList.map((commentItem, index) => {
                    const commentId = commentItem.id || commentItem.commentId || index;
                    const likesData = commentLikes[commentId] || { likes: 0, dislikes: 0, userReaction: null };

                    return (
                      <div
                        key={commentId}
                        className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="font-semibold text-green-700 text-sm">
                                {(commentItem.username || username).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">
                                {commentItem.username || username}
                              </h4>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(commentItem.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 pl-11 mb-3">
                          {commentItem.content || commentItem.comment || "No comment text"}
                        </p>

                        {/* Like/Dislike Buttons */}
                        <div className="flex items-center gap-4 pl-11">
                          <button
                            onClick={() => handleCommentReaction(commentId, "LIKE")}
                            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition ${likesData.userReaction === "LIKE"
                              ? "bg-green-50 text-green-600"
                              : "text-gray-600 hover:bg-gray-100"
                              }`}
                          >
                            <FaThumbsUp className={likesData.userReaction === "LIKE" ? "text-green-600" : "text-gray-500"} />
                            <span className="font-medium">{likesData.likes}</span>
                          </button>

                          <button
                            onClick={() => handleCommentReaction(commentId, "DISLIKE")}
                            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition ${likesData.userReaction === "DISLIKE"
                              ? "bg-red-50 text-red-600"
                              : "text-gray-600 hover:bg-gray-100"
                              }`}
                          >
                            <FaThumbsDown className={likesData.userReaction === "DISLIKE" ? "text-red-600" : "text-gray-500"} />
                            <span className="font-medium">{likesData.dislikes}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Card - SIMPLIFIED (No stats) */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow">
              {profileLoading ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt={authorData?.displayName || recipe?.username || "Author"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Profile image failed to load");
                    // Show placeholder when image fails
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full bg-green-100 flex items-center justify-center">
                        <span class="font-bold text-green-700 text-xl">
                          ${(recipe?.username || "A").charAt(0).toUpperCase()}
                        </span>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-green-100 flex items-center justify-center">
                  <span className="font-bold text-green-700 text-xl">
                    {(recipe?.username || "A").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <h3 className="font-bold text-lg mb-1">
              {authorData?.displayName || recipe?.username || "Unknown Author"}
            </h3>

            <p className="text-gray-700 text-sm mb-6">
              {authorData?.bio || "Sharing delicious recipes with love and passion for cooking."}
            </p>

            <button
              onClick={navigateToAuthorProfile}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-6 rounded-lg transition"
            >
              View Author's Profile
            </button>
          </div>

          {/* Comment Stats */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-lg mb-4">Comment Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Comments</span>
                <span className="font-bold text-green-600">{commentsList.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Reactions</span>
                <span className="font-bold text-green-600">
                  {Object.values(commentLikes).reduce((sum, data) => sum + data.likes + data.dislikes, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Most Liked Comment</span>
                <span className="font-bold text-green-600">
                  {commentsList.length > 0
                    ? Math.max(...commentsList.map(c => commentLikes[c.id || c.commentId]?.likes || 0))
                    : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Similar Recipes */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-lg mb-4">Similar Recipes</h2>
            {loadingSimilarRecipes ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-3"></div>
                <p className="text-gray-500 text-sm">Loading similar recipes...</p>
              </div>
            ) : similarRecipesError ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm mb-3">{similarRecipesError}</p>
                <button
                  onClick={retrySimilarRecipes}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                >
                  Try Again
                </button>
              </div>
            ) : similarRecipes.length > 0 ? (
              <div className="space-y-4">
                {similarRecipes.map((similarRecipe, index) => (
                  <div
                    key={similarRecipe.recipeId || similarRecipe.id || index}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition group"
                    onClick={() => navigate(`/aboutrecipes/${similarRecipe.recipeId || similarRecipe.id}`)}
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {similarRecipe.thumbnail ? (
                        <img
                          src={`data:image/jpeg;base64,${similarRecipe.thumbnail}`}
                          alt={similarRecipe.recipeName}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          onError={(e) => {
                            e.target.src = "https://source.unsplash.com/random/200x200?food";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <GiKnifeFork className="text-gray-400 text-xl" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1 group-hover:text-green-600 transition line-clamp-1">
                        {similarRecipe.recipeName || "Recipe Name"}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{similarRecipe.cookTime || "30 mins"}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {renderSimilarRecipeStars(similarRecipe.rating || 4.0)}
                          <span className="ml-1">{similarRecipe.rating ? similarRecipe.rating.toFixed(1) : 4.0}</span>
                        </span>
                      </div>
                      {similarRecipe.category && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-semibold rounded">
                          {similarRecipe.category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No similar recipes found.</p>
                <button
                  onClick={retrySimilarRecipes}
                  className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                >
                  Search Again
                </button>
              </div>
            )}

            {/* View All Recipes Button */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => navigate("/recipes")}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
              >
                View All Recipes
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div >
  );
};

export default AboutRecipes;