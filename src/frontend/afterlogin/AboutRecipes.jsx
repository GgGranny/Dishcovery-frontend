import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";
import authorImg from "../../assets/profile.jpg";
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { AiFillFire } from "react-icons/ai";
import { GiKnifeFork } from "react-icons/gi";
import VideoPlayer from "../../components/VideoPlayer";

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

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "User";

  const parseSteps = (steps) => {
    let parsed = [];
    try {
      if (Array.isArray(steps)) parsed = steps.flat().map(String);
      else if (typeof steps === "string") parsed = steps.split(/\n|,/).map((s) => s.trim());
      else if (typeof steps === "object" && steps !== null) parsed = Object.values(steps).flat().map(String);

      return parsed
        .map((s) =>
          s
            .replace(/^\s*\d+[.)]\s*/, "")
            .replace(/^\s*"|"\s*$/g, "")
            .replace(/^\[/, "")
            .replace(/\]$/, "")
            .replace(/\\n/g, " ")
            .trim()
        )
        .filter(Boolean)
        .filter((s) => !/^\d+$/.test(s));
    } catch (e) {
      console.error("STEP PARSE ERROR:", e);
      return [];
    }
  };

  // Fetch recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        // Fetch recipe
        const response = await axios.get(
          `http://localhost:8080/api/recipes/recipe/r1/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data;
        console.log("Recipe data:", data);
        const cleanSteps = parseSteps(data.steps);

        // Check if recipe has video
        let videoStreamUrl = "";

        if (data.videoId !== null) {
          try {
            const videoResponse = await axios.get(
              `http://localhost:8080/api/v1/videos/stream/segment/${data.videoId}/master.m3u8`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            videoStreamUrl = videoResponse.config.url;
            console.log("Video stream URL:", videoStreamUrl);
          } catch (videoErr) {
            console.error("Video stream error:", videoErr);
          }
        }

        // Set recipe data
        setRecipe({ ...data, steps: cleanSteps });
        setVideoUrl(videoStreamUrl);

        // Set video title and description from the video object in recipe response
        if (data.video) {
          setVideoTitle(data.video.title || `${data.recipeName} Video Tutorial`);
          setVideoDescription(data.video.description || "Video tutorial for this recipe");
          console.log("Video title from recipe:", data.video.title);
          console.log("Video description from recipe:", data.video.description);
        } else {
          // Set default values if no video object
          setVideoTitle(`${data.recipeName} Video Tutorial`);
          setVideoDescription("Watch how to make this delicious recipe step by step.");
        }

      } catch (err) {
        console.error("Recipe fetch error:", err);
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, token]);

  // Fetch comments for THIS recipe
  const fetchComments = async () => {
    if (!token || !id) return;

    try {
      const res = await axios.get(
        `http://localhost:8080/api/comments/c1/comment/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let commentsArray = [];

      if (Array.isArray(res.data)) {
        commentsArray = res.data;
      } else if (res.data && Array.isArray(res.data.comments)) {
        commentsArray = res.data.comments;
      } else if (res.data && res.data.comment) {
        commentsArray = [res.data.comment];
      } else if (res.data && typeof res.data === 'object') {
        const possibleArrays = Object.values(res.data).find(val => Array.isArray(val));
        if (possibleArrays) {
          commentsArray = possibleArrays;
        }
      }

      const sortedComments = commentsArray.sort((a, b) =>
        a.createdAt && b.createdAt ? new Date(b.createdAt) - new Date(a.createdAt) : 0
      );

      setCommentsList(sortedComments);

      // Initialize likes for each comment
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
      await axios.post(
        "http://localhost:8080/api/comments/c1/comment/like",
        { commentId, type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Refresh comments to get updated counts
      fetchComments();
    } catch (err) {
      console.error("Like/Dislike failed:", err);
      // Revert on error
      fetchComments();
    }
  };

  // Post comment for THIS recipe
  const postComment = async () => {
    if (!comment.trim() || !token || postingComment || !id) {
      return;
    }

    setPostingComment(true);
    try {
      const requestBody = {
        recipeId: id,
        content: comment.trim(),
        username: username,
      };

      const response = await axios.post(
        `http://localhost:8080/api/comments/c1/comment`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setComment("");
      fetchComments();

    } catch (err) {
      console.error("Failed to post comment:", err.response?.data || err.message);

      // Try alternative method with query parameters if first fails
      try {
        await axios.post(
          `http://localhost:8080/api/comments/c1/comment`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: {
              recipeId: id,
              content: comment.trim(),
              username: username,
            },
          }
        );

        setComment("");
        fetchComments();

      } catch (secondErr) {
        console.error("Second attempt also failed:", secondErr);
        alert(`Failed to post comment. Please try again. Error: ${secondErr.message}`);
      }
    } finally {
      setPostingComment(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Recently";
    }
  };

  const renderIngredients = () => {
    if (!recipe) return [];
    if (Array.isArray(recipe.ingredients)) return recipe.ingredients;
    if (typeof recipe.ingredients === "string")
      return recipe.ingredients.split(/,|\n/).map((i) => i.trim()).filter(Boolean);
    return ["No ingredients listed"];
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
                  {renderIngredients().map((item, idx) => (
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
                {recipe.videoId ? (
                  <>
                    <VideoPlayer src={videoUrl} />

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
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <GiKnifeFork className="text-gray-400 text-4xl mx-auto mb-4" />
                        <p className="text-gray-600">No video available for this recipe.</p>
                      </div>
                    </div>

                    {/* Still show title and description even if no video */}
                    <div className="mt-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {videoTitle || `${recipe.recipeName} Video Tutorial`}
                        </h3>
                      </div>

                      <div>
                        <p className="text-gray-600">
                          {videoDescription || "Watch how to make this delicious recipe step by step."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                    onClick={postComment}
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
          {/* Author Card */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow">
              <img src={authorImg} alt="Author" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-lg mb-1">Hi! I'm {username}</h3>
            <p className="text-gray-600 text-sm mb-3">Food Enthusiast & Recipe Creator</p>
            <p className="text-gray-700 text-sm mb-4">
              Sharing my passion for cooking one recipe at a time. Love experimenting with flavors!
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-6 rounded-lg transition">
              View Profile
            </button>
          </div>

          {/* Video Info Card */}
          {recipe.video && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-lg mb-4">Video Information</h2>
              <div className="space-y-3">
                {videoTitle && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Video Title</h3>
                    <p className="font-semibold text-gray-800">{videoTitle}</p>
                  </div>
                )}
                {videoDescription && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Video Description</h3>
                    <p className="text-sm text-gray-600">{videoDescription}</p>
                  </div>
                )}
                {recipe.video.uploadedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Upload Date</h3>
                    <p className="text-sm text-gray-600">{new Date(recipe.video.uploadedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

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
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition group"
                >
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={`https://source.unsplash.com/random/200x200?food=${item}`}
                      alt={`Similar Recipe ${item}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-green-600 transition">
                      Delicious Recipe {item}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>30 mins</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" /> 4.5
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutRecipes;