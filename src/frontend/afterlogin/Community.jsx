import React, { useState, useEffect } from "react";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";
import recipeBg from "../../assets/recipe-bg.png";
import {
  FaPlus,
  FaFire,
  FaComments,
  FaClock,
  FaUser,
  FaThumbsUp,
  FaComment,
  FaBookmark,
  FaShare,
  FaTimes,
  FaChevronDown
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Community() {
  let navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recent");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [categories] = useState([
    { id: "all", name: "All Discussions", icon: "💬" },
    { id: "tips", name: "Cooking Tips", icon: "👨‍🍳" },
    { id: "requests", name: "Recipe Requests", icon: "🙏" },
    { id: "planning", name: "Meal Planning", icon: "📅" },
    { id: "baking", name: "Baking Tips", icon: "🍰" },
    { id: "bread", name: "Bread Making", icon: "🥖" }
  ]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [serverAllDiscussion, setServerAllDiscussion] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    category: "",
    description: "",
    tags: ""
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view community discussions');
          setIsLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:8080/api/community", {
          headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
          }
        });
        
        // Transform the data to match your component's expected format
        const formattedData = response.data.map(discussion => ({
          id: discussion.id,
          title: discussion.communityName,
          category: discussion.category || "General",
          description: discussion.description,
          username: discussion.username,
          userId: discussion.userId,
          createdAt: new Date(discussion.createdAt || discussion.creationDate || Date.now()).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          replies: 0, // You might need to fetch this from another endpoint
          likes: 0, // You might need to fetch this from another endpoint
          isLiked: false,
          isBookmarked: false,
          userProfile: `https://api.dicebear.com/7.x/avataaars/svg?seed=${discussion.username}`,
          tags: discussion.tags || "",
          isPrivate: discussion.isPrivate || false
        }));
        
        setServerAllDiscussion(formattedData);
      } catch (e) {
        console.error("Error fetching community:", e);
        setError(e.response?.data?.message || "Failed to load discussions");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const username = localStorage.getItem("username") || "User";
  const userId = localStorage.getItem("userid") || 0;

  const handleCreateDiscussion = async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (!newDiscussion.category) {
      alert("Please select a category");
      return;
    }

    const tagsArray = newDiscussion.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const newDiscussionObj = {
      title: newDiscussion.title,
      category: categories.find(c => c.id === newDiscussion.category)?.name || "General",
      description: newDiscussion.description,
      username: username,
      userId: Number(userId),
      isPrivate: isPrivate,
      tags: tagsArray.join(','),
      createdAt: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      replies: 0,
      likes: 0,
      isLiked: false,
      isBookmarked: false,
      userProfile: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to create a discussion");
        return;
      }

      const response = await axios.post("http://localhost:8080/api/community/create",
        {
          communityName: newDiscussion.title,
          description: newDiscussion.description,
          username: username,
          userId: Number(userId),
          isPrivate: isPrivate,
          tags: tagsArray.join(','),
          category: categories.find(c => c.id === newDiscussion.category)?.name || "General"
        },
        {
          headers: {
            "Authorization": "Bearer " + token,
            "Content-type": "application/json"
          }
        }
      );
      
      // Add the new discussion to the state
      const createdDiscussion = {
        ...newDiscussionObj,
        id: response.data.id || Date.now(),
      };
      
      setServerAllDiscussion(prev => [createdDiscussion, ...prev]);
      
      // Reset form
      setNewDiscussion({
        title: "",
        category: "",
        description: "",
        tags: ""
      });
      setShowCategoryDropdown(false);
      setShowCreateModal(false);
      setIsPrivate(false);

      alert("Discussion posted successfully!");
    } catch (e) {
      console.error("Failed to create community", e);
      alert("Failed to post discussion. Please try again.");
    }
  };

  const handleLikeDiscussion = (id) => {
    setServerAllDiscussion(prev => 
      prev.map(discussion => {
        if (discussion.id === id) {
          return {
            ...discussion,
            likes: discussion.isLiked ? discussion.likes - 1 : discussion.likes + 1,
            isLiked: !discussion.isLiked
          };
        }
        return discussion;
      })
    );
  };

  const handleBookmarkDiscussion = (id) => {
    setServerAllDiscussion(prev => 
      prev.map(discussion => {
        if (discussion.id === id) {
          return {
            ...discussion,
            isBookmarked: !discussion.isBookmarked
          };
        }
        return discussion;
      })
    );
  };

  const getFilteredDiscussions = () => {
    if (selectedCategory === "all") return serverAllDiscussion;

    const categoryName = categories.find(c => c.id === selectedCategory)?.name;
    return serverAllDiscussion.filter(discussion => 
      discussion.category === categoryName
    );
  };

  const joinChatRoom = (communityId) => {
    navigate(`/community/chat/${communityId}`);
  }

  const getCategoryColor = (category) => {
    switch(category) {
      case "Trending":
      case "Hot Topic":
        return { bg: "bg-red-200", text: "text-red-700" };
      case "Cooking Tips":
      case "Baking Tips":
      case "Bread Making":
        return { bg: "bg-yellow-200", text: "text-yellow-700" };
      case "Recipe Requests":
        return { bg: "bg-blue-200", text: "text-blue-700" };
      case "Meal Planning":
        return { bg: "bg-green-200", text: "text-green-700" };
      case "Question":
        return { bg: "bg-indigo-200", text: "text-indigo-700" };
      default:
        return { bg: "bg-gray-200", text: "text-gray-700" };
    }
  };

  const CreateDiscussionModal = () => {
    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
        <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Start a New Discussion</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <FaTimes size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discussion title *
              </label>
              <input
                type="text"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What would you like to discuss?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={`w-full p-3 border rounded-lg text-left flex justify-between items-center ${newDiscussion.category
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                    }`}
                >
                  <span className={newDiscussion.category ? "text-gray-800" : "text-gray-500"}>
                    {newDiscussion.category
                      ? categories.find(c => c.id === newDiscussion.category)?.name
                      : "Select category"}
                  </span>
                  <FaChevronDown className={`transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {categories.slice(1).map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setNewDiscussion(prev => ({ ...prev, category: category.id }));
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3"
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={newDiscussion.description}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your question or topic in detail......"
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={newDiscussion.tags}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Add tags separated by commas (e.g., vegan, quick, healthy)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add relevant tags to help others find your discussion
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <label
                htmlFor="privacy-toggle"
                className="text-sm font-medium"
              >
                Is Private Discussion:
              </label>

              <button
                id="privacy-toggle"
                type="button"
                role="radio"
                aria-checked={isPrivate}
                onClick={() => setIsPrivate(prev => !prev)}
                className={`relative w-10 h-5 rounded-full transition-colors
        ${isPrivate ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white
          transition-transform
          ${isPrivate ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>

            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewDiscussion({
                    title: "",
                    category: "",
                    description: "",
                    tags: ""
                  });
                  setIsPrivate(false);
                }}
                className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateDiscussion}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
              >
                Post Discussion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DiscussionCard = ({ discussion }) => {
    const categoryColor = getCategoryColor(discussion.category);
    
    return (
      <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <span className={`${categoryColor.bg} ${categoryColor.text} px-3 py-1 rounded-lg text-sm font-semibold`}>
              {discussion.category || "General"}
            </span>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
              <FaClock size={12} /> {discussion.createdAt || "Just now"} • Posted by {discussion.username}
            </p>
          </div>
          <img
            src={discussion.userProfile || `https://api.dicebear.com/7.x/avataaars/svg?seed=${discussion.username}`}
            alt={discussion.username}
            className="w-10 h-10 rounded-full border"
          />
        </div>

        <h3 className="text-xl font-semibold mt-3 hover:text-green-600 cursor-pointer">
          {discussion.title || discussion.communityName}
        </h3>
        <p className="text-gray-600 mt-2">{discussion.description}</p>

        {discussion.tags && discussion.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {discussion.tags.split(',').map((tag, index) => (
              tag.trim() && (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  #{tag.trim()}
                </span>
              )
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-6 text-gray-700 text-sm">
            <button
              onClick={() => handleLikeDiscussion(discussion.id)}
              className={`flex items-center gap-2 ${discussion.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            >
              <FaThumbsUp /> {discussion.likes || 0}
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500">
              <FaComment /> {discussion.replies || 0}
            </button>
            <button
              onClick={() => handleBookmarkDiscussion(discussion.id)}
              className={`flex items-center gap-2 ${discussion.isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`}
            >
              <FaBookmark />
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-green-500">
              <FaShare />
            </button>
          </div>
          <button 
            className="text-green-600 hover:text-green-800 font-medium text-sm" 
            onClick={() => joinChatRoom(discussion.id)}
          >
            Join Discussion →
          </button>
        </div>
      </div>
    );
  };

  const filteredDiscussions = getFilteredDiscussions();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Homenavbar />
      {CreateDiscussionModal()}

      {/* Hero Section */}
      <div
        className="relative w-full h-[260px] bg-cover bg-center"
        style={{ backgroundImage: `url(${recipeBg})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl font-bold mb-2">Community Discussions</h1>
          <p className="text-lg">Share, learn, and connect with fellow food enthusiasts</p>

          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition flex items-center gap-2 font-semibold"
          >
            <FaPlus /> Start New Discussion
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex w-full max-w-7xl mx-auto mt-10 gap-6 px-4 flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white p-5 rounded-2xl shadow-md h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Categories</h2>
            <span className="text-sm text-gray-500">{filteredDiscussions.length} discussions</span>
          </div>

          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${selectedCategory === category.id
                  ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold text-gray-700 mb-3">Community Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Discussions</span>
                <span className="font-semibold">{serverAllDiscussion.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Users</span>
                <span className="font-semibold">
                  {Array.from(new Set(serverAllDiscussion.map(d => d.userId))).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Your Discussions</span>
                <span className="font-semibold text-green-600">
                  {serverAllDiscussion.filter(d => d.userId === Number(userId)).length}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <FaPlus /> New Discussion
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:ml-6">
          <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4 sm:gap-0">
            <div className="flex gap-6 text-lg font-medium">
              {[
                { id: "recent", label: "Recent", icon: <FaClock /> },
                { id: "popular", label: "Popular", icon: <FaFire /> },
                { id: "qa", label: "Q&A", icon: <FaComments /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-1 ${activeTab === tab.id
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 hover:text-black"
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-semibold shadow-md"
            >
              <FaPlus size={16} /> New Discussion
            </button>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <div className="bg-white p-10 rounded-2xl shadow-md text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Loading discussions...
                </h3>
              </div>
            ) : error ? (
              <div className="bg-white p-10 rounded-2xl shadow-md text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {error}
                </h3>
                <p className="text-gray-500 mb-6">
                  Please login to view community discussions
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition inline-flex items-center gap-2"
                >
                  Login
                </button>
              </div>
            ) : filteredDiscussions.length > 0 ? (
              filteredDiscussions.map((discussion) => (
                <DiscussionCard
                  key={discussion.id}
                  discussion={discussion}
                />
              ))
            ) : (
              <div className="bg-white p-10 rounded-2xl shadow-md text-center">
                <div className="text-gray-400 text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No discussions found in this category
                </h3>
                <p className="text-gray-500 mb-6">
                  Be the first to start a discussion about {categories.find(c => c.id === selectedCategory)?.name.toLowerCase()}!
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition inline-flex items-center gap-2"
                >
                  <FaPlus /> Start First Discussion
                </button>
              </div>
            )}

            {filteredDiscussions.length > 0 && filteredDiscussions.length >= 10 && (
              <div className="flex justify-center mt-8">
                <button 
                  className="px-8 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition font-semibold"
                >
                  Load More Discussions
                </button>
              </div>
            )}
          </div>

          <div className="mt-12 bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">💡 Community Guidelines</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">1</div>
                <span>Be respectful and kind to all members</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">2</div>
                <span>Share specific experiences and detailed questions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">3</div>
                <span>Provide helpful, constructive feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">4</div>
                <span>Tag your posts appropriately for better visibility</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}