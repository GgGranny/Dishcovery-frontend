import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiStar, FiPlusCircle, FiX } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:8080';

const AdminRecipes = () => {
  // ---------- Recipe state ----------
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecipes, setTotalRecipes] = useState(0);

  // ---------- Action loading states ----------
  const [actionLoading, setActionLoading] = useState({});

  // ---------- Modal state for Add Ad ----------
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [adVideoFile, setAdVideoFile] = useState(null);

  // ---------- Token validation (prevents 431, handles expiry) ----------
  const validateToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return null;
    }
    if (token.length > 4000) {
      setError('Token too large. Please log out and log in again.');
      localStorage.removeItem('token');
      return null;
    }
    return token;
  };

  // ---------- Helper: fill missing fields with mock data (fallback only) ----------
  const generateMockData = (recipeId) => {
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const seed = recipeId || Math.floor(Math.random() * 1000);
    return {
      date: new Date().toISOString().split('T')[0],
      difficulty: difficulties[seed % difficulties.length],
      rating: (4.0 + (seed % 10) * 0.1).toFixed(1),
      views: 500 + (seed * 123) % 2500,
      saves: 20 + (seed * 23) % 280
    };
  };

  // ---------- Format thumbnail URL ----------
  const formatThumbnailUrl = (thumbnail) => {
    if (!thumbnail) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (thumbnail.startsWith('http') || thumbnail.startsWith('data:')) return thumbnail;

    const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
    if (base64Pattern.test(thumbnail) && thumbnail.length > 50) {
      if (thumbnail.startsWith('/9j/')) return `data:image/jpeg;base64,${thumbnail}`;
      if (thumbnail.startsWith('iVBORw0KGgo')) return `data:image/png;base64,${thumbnail}`;
      return `data:image/jpeg;base64,${thumbnail}`;
    }

    if (thumbnail.startsWith('/')) return `${API_BASE_URL}${thumbnail}`;
    return thumbnail;
  };

  // ---------- Fetch recipes (with pagination) ----------
  const fetchRecipes = async (page = 1, size = 10) => {
    const token = validateToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${API_BASE_URL}/api/recipes/recipe?page=${page}&size=${size}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let recipesData = [];
      let totalPagesCount = 1;
      let totalRecipesCount = 0;

      if (Array.isArray(response.data)) {
        recipesData = response.data;
        totalRecipesCount = response.data.length;
      } else if (response.data.content && Array.isArray(response.data.content)) {
        recipesData = response.data.content;
        totalPagesCount = response.data.totalPages || 1;
        totalRecipesCount = response.data.totalElements || response.data.content.length;
      } else if (response.data.items && Array.isArray(response.data.items)) {
        recipesData = response.data.items;
        totalPagesCount = response.data.totalPages || 1;
        totalRecipesCount = response.data.total || response.data.items.length;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        recipesData = response.data.data;
        totalPagesCount = response.data.totalPages || 1;
        totalRecipesCount = response.data.total || response.data.data.length;
      } else if (response.data.recipes && Array.isArray(response.data.recipes)) {
        recipesData = response.data.recipes;
        totalRecipesCount = response.data.total || response.data.recipes.length;
      } else {
        recipesData = Array.isArray(response.data) ? response.data : [];
        totalRecipesCount = recipesData.length;
      }

      // Transform recipes – no author field
      const transformedRecipes = recipesData.map((recipe, index) => {
        const mock = generateMockData(recipe.recipeId || index + 1);
        const recipeId = recipe.recipeId || index + 1;

        return {
          id: recipeId,
          name: recipe.recipeName || recipe.name || `Recipe ${index + 1}`,
          description: recipe.description || 'No description available',
          thumbnail: recipe.thumbnail || null,
          date: recipe.createdDate || recipe.date || mock.date,
          category: recipe.category || recipe.type || 'Uncategorized',
          difficulty: recipe.difficulty || recipe.level || mock.difficulty,
          rating: parseFloat(recipe.rating || recipe.averageRating || mock.rating),
          status: 'published',
          views: recipe.views || recipe.viewCount || mock.views,
          saves: recipe.saves || recipe.saveCount || recipe.favorites || mock.saves,
          cookTime: recipe.cookTime || recipe.prepTime || '30 mins',
          cuisine: recipe.cuisine || recipe.type || ''
        };
      });

      setRecipes(transformedRecipes);
      setFilteredRecipes(transformedRecipes);
      setTotalPages(totalPagesCount);
      setTotalRecipes(totalRecipesCount);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
      } else {
        setError(`Failed to fetch recipes: ${err.response?.data?.message || err.message}`);
      }

      // Only use mock data if we have no recipes at all
      if (recipes.length === 0) {
        const mockRecipes = getMockRecipes();
        setRecipes(mockRecipes);
        setFilteredRecipes(mockRecipes);
        setTotalRecipes(mockRecipes.length);
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------- Mock recipes (fallback, no author) ----------
  const getMockRecipes = () => [
    {
      id: 1,
      name: 'Spicy Thai Basil Chicken',
      description: 'A delicious Thai dish with basil and chicken',
      thumbnail: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      date: '2024-01-15',
      category: 'Asian',
      difficulty: 'Medium',
      rating: 4.8,
      status: 'published',
      views: 1247,
      saves: 89,
      cookTime: '30 mins',
      cuisine: 'Thai'
    },
    {
      id: 2,
      name: 'Chocolate Lava Cake',
      description: 'Decadent chocolate cake with molten center',
      thumbnail: 'https://images.unsplash.com/photo-1624353365286-3f8d62dadadf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      date: '2024-01-14',
      category: 'Desserts',
      difficulty: 'Hard',
      rating: 4.9,
      status: 'published',
      views: 2156,
      saves: 234,
      cookTime: '45 mins',
      cuisine: 'French'
    }
  ];

  // ---------- Initial fetch ----------
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchRecipes(currentPage, pageSize);
    } else {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  // ---------- Search filter ----------
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecipes(recipes);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredRecipes(recipes.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.cuisine && r.cuisine.toLowerCase().includes(q))
      ));
    }
  }, [searchQuery, recipes]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // ---------- Delete Recipe ----------
  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    const token = validateToken();
    if (!token) return;

    try {
      setActionLoading(prev => ({ ...prev, [`delete-${recipeId}`]: true }));
      // Optimistic update
      setRecipes(prev => prev.filter(r => r.id !== recipeId));

      await axios.delete(
        `${API_BASE_URL}/api/recipes/recipe/${recipeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Error deleting recipe:', err);
      alert(`Failed to delete recipe: ${err.response?.data?.message || err.message}`);
      fetchRecipes(currentPage, pageSize); // revert optimistic update
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete-${recipeId}`]: false }));
    }
  };

  // ---------- Add to Featured (Star) ----------
  const handleAddToFeatured = async (recipeId) => {
    const token = validateToken();
    if (!token) return;

    setActionLoading(prev => ({ ...prev, [`feature-${recipeId}`]: true }));

    try {
      await axios.post(
        `${API_BASE_URL}/api/admin/recipe/feature`,
        { recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Recipe ${recipeId} has been featured!`);
    } catch (err) {
      console.error('Error featuring recipe:', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        // ❌ No redirect – user stays on page
      } else {
        alert(`Failed to feature recipe: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [`feature-${recipeId}`]: false }));
    }
  };

  // ---------- Add Advertisement – open modal ----------
  const openAddAdModal = (recipeId) => {
    setSelectedRecipeId(recipeId);
    setAdVideoFile(null);
    setIsAdModalOpen(true);
  };

  // ---------- Video file validation ----------
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('Please upload a valid video file (MP4, WebM, Ogg, etc.)');
        e.target.value = null;
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        alert('Video file must be less than 50MB.');
        e.target.value = null;
        return;
      }
      setAdVideoFile(file);
    } else {
      setAdVideoFile(null);
    }
  };

  // ---------- Submit Ad – NO AUTOMATIC REDIRECTS ----------
  const handleSubmitAd = async (e) => {
    e.preventDefault();

    if (!adVideoFile) {
      alert('Please select a video file.');
      return;
    }

    const token = validateToken();
    if (!token) {
      alert('Authentication failed. Please log in again.');
      // ❌ No redirect – just alert
      return;
    }

    setActionLoading(prev => ({ ...prev, [`ad-${selectedRecipeId}`]: true }));

    const formData = new FormData();
    formData.append('recipeId', selectedRecipeId);
    formData.append('video', adVideoFile);

    try {
      await axios.post(
        `${API_BASE_URL}/api/ad/v1`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          maxRedirects: 0 // ⛔ CRITICAL: stops automatic redirect to login page
        }
      );
      alert(`Video advertisement added for recipe ${selectedRecipeId}!`);
      setAdVideoFile(null);
      setIsAdModalOpen(false);
    } catch (err) {
      console.error('Error adding ad:', err);
      if (err.response?.status === 401) {
        alert('Authentication failed. Please log in again.');
        localStorage.removeItem('token');
        // ❌ No redirect – user stays on page
      } else if (err.response?.status === 302 || err.message?.includes('redirect')) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        // ❌ No redirect – user stays on page
      } else {
        alert(`Failed to add ad: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [`ad-${selectedRecipeId}`]: false }));
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const getDifficultyBadgeClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'hard': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // --- AUTH / LOADING / ERROR states ---
  if (!localStorage.getItem('token')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-yellow-200 max-w-md text-center">
          <div className="text-yellow-500 text-4xl mb-4">🔒</div>
          <p className="text-gray-800 mb-2 font-medium">Authentication Required</p>
          <p className="text-gray-600 mb-4 text-sm">Please log in to access the admin panel</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading && recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading recipes...</p>
      </div>
    );
  }

  if (error && recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 max-w-md text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-800 mb-2 font-medium">API Connection Error</p>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <p className="text-gray-500 text-xs mb-6">Using fallback data for demonstration</p>
          <button
            onClick={() => fetchRecipes(currentPage, pageSize)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Recipe Management</h1>
        <p className="text-gray-600 mt-1">Manage and moderate recipe submissions</p>
      </div>

      {/* Search & Pagination Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search recipes, categories, or cuisines..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-3 w-full md:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="pageSize" className="text-sm text-gray-600 mr-2">Show:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>

        <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredRecipes.length}</span> of <span className="font-semibold">{totalRecipes}</span> recipes
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm text-gray-600">
                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RECIPE</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CATEGORY</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DIFFICULTY</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RATING</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ENGAGEMENT</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map(recipe => (
                  <tr key={recipe.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 mr-4 relative">
                          <img
                            className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                            src={formatThumbnailUrl(recipe.thumbnail)}
                            alt={recipe.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{recipe.name}</div>
                          <div className="text-sm text-gray-500">{recipe.date}</div>
                          <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                            {recipe.description.length > 50
                              ? `${recipe.description.substring(0, 50)}...`
                              : recipe.description}
                          </div>
                          {recipe.cuisine && (
                            <div className="text-xs text-blue-600 mt-1">{recipe.cuisine}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800">
                        {recipe.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full border ${getDifficultyBadgeClass(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">{renderStars(recipe.rating)}</div>
                        <span className="font-medium text-gray-900">{recipe.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full border bg-green-100 text-green-800 border-green-200">
                        Published
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex flex-col">
                        <span className="font-medium">{recipe.views.toLocaleString()} views</span>
                        <span className="text-gray-500">{recipe.saves} saves</span>
                        {recipe.cookTime && (
                          <span className="text-xs text-gray-400 mt-1">⏱️ {recipe.cookTime}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* Add to Featured (Star) */}
                        <button
                          onClick={() => handleAddToFeatured(recipe.id)}
                          disabled={actionLoading[`feature-${recipe.id}`]}
                          className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 hover:text-yellow-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Add to Featured"
                        >
                          {actionLoading[`feature-${recipe.id}`] ? (
                            <span className="animate-spin inline-block">⏳</span>
                          ) : (
                            <FiStar className="w-4 h-4" />
                          )}
                        </button>

                        {/* Add Advertisement (Plus) - opens modal */}
                        <button
                          onClick={() => openAddAdModal(recipe.id)}
                          disabled={actionLoading[`ad-${recipe.id}`]}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Upload Video Ad"
                        >
                          {actionLoading[`ad-${recipe.id}`] ? (
                            <span className="animate-spin inline-block">⏳</span>
                          ) : (
                            <FiPlusCircle className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition duration-150"
                          onClick={() => handleDeleteRecipe(recipe.id)}
                          disabled={actionLoading[`delete-${recipe.id}`]}
                          title="Delete recipe"
                        >
                          {actionLoading[`delete-${recipe.id}`] ? (
                            <span className="animate-spin inline-block">⏳</span>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 text-lg font-medium mb-2">No recipes found</p>
                      <p className="text-gray-400">
                        {searchQuery ? `No results for "${searchQuery}"` : 'No recipes available'}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 sm:mb-0">
              Showing {filteredRecipes.length} recipes
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- MODAL: ONLY VIDEO FILE ---------- */}
      {isAdModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsAdModalOpen(false)}
            aria-hidden="true"
          ></div>

          {/* Modal panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                    Upload Video Advertisement
                  </h3>
                  <button
                    onClick={() => setIsAdModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitAd}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video File *
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Supported formats: MP4, WebM, Ogg, etc. (max 50MB)
                    </p>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAdModalOpen(false)}
                      className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading[`ad-${selectedRecipeId}`]}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading[`ad-${selectedRecipeId}`] ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Uploading...
                        </>
                      ) : (
                        'Upload Ad'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRecipes;