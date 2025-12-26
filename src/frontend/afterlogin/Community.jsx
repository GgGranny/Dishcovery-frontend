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

export default function Community() {
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

  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    category: "",
    description: "",
    tags: ""
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Discussions state - in real app, this would come from API
  const [discussions, setDiscussions] = useState({
    recent: [
      {
        id: 1,
        category: "Baking Tips",
        time: "2 hours ago",
        title: "Best substitutes for eggs in baking?",
        content: "I'm trying to make my grandmother's cake recipe vegan-friendly. What are the best egg substitutes that won't affect the texture?",
        author: "John Doe",
        replies: 23,
        likes: 45,
        isLiked: false,
        isBookmarked: false,
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        tags: ["vegan", "baking", "substitutes"],
        categoryColor: "bg-green-200",
        textColor: "text-green-700"
      },
      {
        id: 2,
        category: "Meal Planning",
        time: "4 hours ago",
        title: "Weekly Meal Prep Ideas – Share Your Favorites!",
        content: "Looking for new meal prep ideas for busy weekdays. What are your go-to recipes that reheat well?",
        author: "Sarah",
        replies: 18,
        likes: 32,
        isLiked: true,
        isBookmarked: false,
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        tags: ["meal-prep", "planning", "time-saving"],
        categoryColor: "bg-blue-200",
        textColor: "text-blue-700"
      },
      {
        id: 3,
        category: "Bread Making",
        time: "6 hours ago",
        title: "Help! My sourdough starter isn't bubbling",
        content: "I've been feeding my starter for a week but it's not showing much activity. Any troubleshooting tips?",
        author: "Emma Thompson",
        replies: 34,
        likes: 67,
        isLiked: false,
        isBookmarked: true,
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        tags: ["sourdough", "bread", "troubleshooting"],
        categoryColor: "bg-yellow-200",
        textColor: "text-yellow-700"
      }
    ],
    popular: [
      {
        id: 4,
        category: "Trending",
        time: "1 day ago",
        title: "10 Most-Liked Dinner Recipes of the Week",
        content: "These dinner ideas took the community by storm — quick, tasty, and healthy!",
        author: "Community",
        replies: 52,
        likes: 148,
        isLiked: true,
        isBookmarked: false,
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Community",
        tags: ["trending", "dinner", "recipes"],
        categoryColor: "bg-red-200",
        textColor: "text-red-700"
      },
      {
        id: 5,
        category: "Hot Topic",
        time: "2 days ago",
        title: "Is Air Frying Actually Healthier?",
        content: "Community members share research, comparisons, and honest opinions.",
        author: "Alex Chen",
        replies: 27,
        likes: 93,
        isLiked: false,
        isBookmarked: true,
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        tags: ["air-fryer", "health", "debate"],
        categoryColor: "bg-purple-200",
        textColor: "text-purple-700"
      }
    ],
    qa: [
      {
        id: 6,
        category: "Question",
        time: "3 hours ago",
        title: "How do I stop pasta from sticking?",
        content: "I always end up with clumps. Any professional tips?",
        author: "Ravi",
        replies: 12,
        likes: 24,
        isLiked: false,
        isBookmarked: false,
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi",
        tags: ["pasta", "tips", "beginner"],
        categoryColor: "bg-indigo-200",
        textColor: "text-indigo-700"
      },
      {
        id: 7,
        category: "Question",
        time: "5 hours ago",
        title: "Why is my cake sinking in the middle?",
        content: "Followed the recipe exactly, but still sinks. What am I doing wrong?",
        author: "Meera",
        replies: 19,
        likes: 31,
        isLiked: true,
        isBookmarked: false,
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
        tags: ["baking", "cake", "problem"],
        categoryColor: "bg-pink-200",
        textColor: "text-pink-700"
      }
    ]
  });

  const [userDiscussions, setUserDiscussions] = useState([]);
  const username = localStorage.getItem("username") || "User";

  // Handle creating new discussion
  const handleCreateDiscussion = () => {
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
      id: Date.now(),
      category: categories.find(c => c.id === newDiscussion.category)?.name || "General",
      time: "Just now",
      title: newDiscussion.title,
      content: newDiscussion.description,
      author: username,
      replies: 0,
      likes: 0,
      isLiked: false,
      isBookmarked: false,
      authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      tags: tagsArray,
      categoryColor: "bg-green-200",
      textColor: "text-green-700"
    };

    // Add to recent discussions
    const updatedRecent = [newDiscussionObj, ...discussions.recent];
    setDiscussions(prev => ({
      ...prev,
      recent: updatedRecent
    }));

    // Add to user's discussions
    setUserDiscussions(prev => [newDiscussionObj, ...prev]);

    // Save to localStorage (for demo)
    const allDiscussions = JSON.parse(localStorage.getItem('communityDiscussions') || '[]');
    localStorage.setItem('communityDiscussions', JSON.stringify([newDiscussionObj, ...allDiscussions]));

    // Reset form
    setNewDiscussion({
      title: "",
      category: "",
      description: "",
      tags: ""
    });
    setShowCategoryDropdown(false);
    setShowCreateModal(false);
    
    alert("Discussion posted successfully!");
  };

  // Handle like discussion
  const handleLikeDiscussion = (tab, id) => {
    setDiscussions(prev => ({
      ...prev,
      [tab]: prev[tab].map(discussion => {
        if (discussion.id === id) {
          return {
            ...discussion,
            likes: discussion.isLiked ? discussion.likes - 1 : discussion.likes + 1,
            isLiked: !discussion.isLiked
          };
        }
        return discussion;
      })
    }));
  };

  // Handle bookmark discussion
  const handleBookmarkDiscussion = (tab, id) => {
    setDiscussions(prev => ({
      ...prev,
      [tab]: prev[tab].map(discussion => {
        if (discussion.id === id) {
          return {
            ...discussion,
            isBookmarked: !discussion.isBookmarked
          };
        }
        return discussion;
      })
    }));
  };

  // Filter discussions by category
  const getFilteredDiscussions = () => {
    if (selectedCategory === "all") return discussions[activeTab];
    
    return discussions[activeTab].filter(discussion => {
      const categoryName = categories.find(c => c.id === selectedCategory)?.name;
      return discussion.category === categoryName;
    });
  };

  const filteredDiscussions = getFilteredDiscussions();

  // Create Discussion Modal Component - Matching your design
  const CreateDiscussionModal = () => {
    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-xl w-full">
          {/* Modal Header */}
          <div className="p-6 border-b">
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

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Title Field */}
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

            {/* Category Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={`w-full p-3 border rounded-lg text-left flex justify-between items-center ${
                    newDiscussion.category 
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

            {/* Description Field */}
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

            {/* Tags Field */}
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

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
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

  // Discussion Card Component
  const DiscussionCard = ({ discussion, tab }) => (
    <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <span className={`${discussion.categoryColor} ${discussion.textColor} px-3 py-1 rounded-lg text-sm font-semibold`}>
            {discussion.category}
          </span>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
            <FaClock size={12} /> {discussion.time} • Posted by {discussion.author}
          </p>
        </div>
        <img
          src={discussion.authorAvatar}
          alt={discussion.author}
          className="w-10 h-10 rounded-full border"
        />
      </div>
      
      <h3 className="text-xl font-semibold mt-3 hover:text-green-600 cursor-pointer">
        {discussion.title}
      </h3>
      <p className="text-gray-600 mt-2">{discussion.content}</p>
      
      {discussion.tags && discussion.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {discussion.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-6 text-gray-700 text-sm">
          <button
            onClick={() => handleLikeDiscussion(tab, discussion.id)}
            className={`flex items-center gap-2 ${discussion.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
          >
            <FaThumbsUp /> {discussion.likes}
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500">
            <FaComment /> {discussion.replies}
          </button>
          <button
            onClick={() => handleBookmarkDiscussion(tab, discussion.id)}
            className={`flex items-center gap-2 ${discussion.isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`}
          >
            <FaBookmark />
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-green-500">
            <FaShare />
          </button>
        </div>
        <button className="text-green-600 hover:text-green-800 font-medium text-sm">
          Join Discussion →
        </button>
      </div>
    </div>
  );

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
          
          {/* Create Discussion Button in Hero */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition flex items-center gap-2 font-semibold"
          >
            <FaPlus /> Start New Discussion
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex w-full max-w-7xl mx-auto mt-10 gap-6 px-4">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-5 rounded-2xl shadow-md h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Categories</h2>
            <span className="text-sm text-gray-500">{filteredDiscussions.length} discussions</span>
          </div>
          
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                  selectedCategory === category.id
                    ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold text-gray-700 mb-3">Community Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Discussions</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Users</span>
                <span className="font-semibold">892</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Your Discussions</span>
                <span className="font-semibold text-green-600">{userDiscussions.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <FaPlus /> New Discussion
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header with Tabs and Create Button */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-6 text-lg font-medium">
              {[
                { id: "recent", label: "Recent", icon: <FaClock /> },
                { id: "popular", label: "Popular", icon: <FaFire /> },
                { id: "qa", label: "Q&A", icon: <FaComments /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-1 ${
                    activeTab === tab.id
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

          {/* Tab Content */}
          <div className="space-y-6">
            {filteredDiscussions.length > 0 ? (
              filteredDiscussions.map((discussion) => (
                <DiscussionCard
                  key={discussion.id}
                  discussion={discussion}
                  tab={activeTab}
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

            {/* Load More Button */}
            {filteredDiscussions.length > 0 && (
              <div className="flex justify-center mt-8">
                <button className="px-8 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition font-semibold">
                  Load More Discussions
                </button>
              </div>
            )}
          </div>

          {/* Quick Tips Section */}
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