import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create authenticated axios instance with interceptors
const createAuthAxios = () => {
  const token = localStorage.getItem('token');
  
  // Create instance
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Add response interceptor for debugging
  instance.interceptors.response.use(
    response => response,
    error => {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return Promise.reject(error);
    }
  );

  return instance;
};

// ========== RECIPE API FUNCTIONS ==========
export const getRecipeById = async (id) => {
  const authAxios = createAuthAxios();
  try {
    const response = await authAxios.get(`/api/recipes/recipe/r1/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

export const getSimilarRecipes = async (recipeId) => {
  const authAxios = createAuthAxios();
  try {
    console.log(`Fetching similar recipes for recipeId: ${recipeId}`);
    const response = await authAxios.get(`/api/recipes/recipe/recommendation?recipeId=${recipeId}`);
    console.log("Similar recipes API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching similar recipes:', error);
    throw error;
  }
};

export const parseSteps = (steps) => {
  let parsed = [];
  try {
    if (Array.isArray(steps)) parsed = steps.flat().map(String);
    else if (typeof steps === 'string') parsed = steps.split(/\n|,/).map((s) => s.trim());
    else if (typeof steps === 'object' && steps !== null) parsed = Object.values(steps).flat().map(String);

    return parsed
      .map((s) =>
        s
          .replace(/^\s*\d+[.)]\s*/, '')
          .replace(/^\s*"|"\s*$/g, '')
          .replace(/^\[/, '')
          .replace(/\]$/, '')
          .replace(/\\n/g, ' ')
          .trim()
      )
      .filter(Boolean)
      .filter((s) => !/^\d+$/.test(s));
  } catch (e) {
    console.error('STEP PARSE ERROR:', e);
    return [];
  }
};

// Helper to process similar recipes response
export const processSimilarRecipes = (response, currentRecipeId) => {
  let recipesArray = [];
  
  // Handle different response structures
  if (Array.isArray(response)) {
    recipesArray = response;
  } else if (response && response.content && Array.isArray(response.content)) {
    recipesArray = response.content;
  } else if (response && response.recipes && Array.isArray(response.recipes)) {
    recipesArray = response.recipes;
  } else if (response && response.recommendations && Array.isArray(response.recommendations)) {
    recipesArray = response.recommendations;
  } else if (response && typeof response === 'object') {
    // Try to find any array in the response object
    const arrays = Object.values(response).filter(val => Array.isArray(val));
    if (arrays.length > 0) {
      recipesArray = arrays[0];
    } else {
      // If it's a single recipe object, wrap it in an array
      recipesArray = [response];
    }
  }

  // Filter out the current recipe from similar recipes
  const filteredRecipes = recipesArray.filter(recipe => {
    if (!recipe) return false;
    const recipeId = recipe.recipeId || recipe.id;
    return recipeId && recipeId.toString() !== currentRecipeId.toString();
  });

  return filteredRecipes.slice(0, 3); // Limit to 3 recipes for display
};

// ========== USER API FUNCTIONS ==========
export const getUserProfilePicture = async (userid) => {
  const authAxios = createAuthAxios();
  try {
    const response = await authAxios.get(`/user/profile/${userid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const getUserData = async (userid) => {
  const authAxios = createAuthAxios();
  try {
    const response = await authAxios.get(`/user/edit/${userid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const processProfilePicture = (profileData) => {
  if (!profileData || profileData === "no user profile") return "";
  
  if (profileData.startsWith('data:image/')) {
    return profileData;
  } else if (profileData.startsWith('http')) {
    return profileData;
  } else {
    return `data:image/jpeg;base64,${profileData}`;
  }
};

// ========== VIDEO API FUNCTIONS ==========
export const getVideoStreamUrl = (videoId) => {
  return `${API_BASE_URL}/api/v1/videos/stream/segment/${videoId}/master.m3u8`;
};

export const getVideoMetadata = (videoData, recipeName) => {
  if (!videoData) {
    return {
      title: `${recipeName} Video Tutorial`,
      description: 'Watch how to make this delicious recipe step by step.',
      uploadedAt: null,
      contentType: null
    };
  }
  
  return {
    title: videoData.title || `${recipeName} Video Tutorial`,
    description: videoData.description || 'Video tutorial for this recipe',
    uploadedAt: videoData.uploadedAt || null,
    contentType: videoData.contentType || null
  };
};

// ========== COMMENTS API FUNCTIONS ==========
export const getComments = async (recipeId) => {
  const authAxios = createAuthAxios();
  try {
    const response = await authAxios.get(`/api/comments/c1/comment/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const postComment = async (recipeId, content, username) => {
  const authAxios = createAuthAxios();
  
  // Try different formats based on your working code
  try {
    // First try: JSON request body
    const requestBody = {
      recipeId: recipeId,
      content: content.trim(),
      username: username,
    };
    
    console.log('Posting comment with data:', requestBody);
    
    const response = await authAxios.post('/api/comments/c1/comment', requestBody);
    return response.data;
    
  } catch (firstError) {
    console.log('First attempt failed, trying query params:', firstError.message);
    
    try {
      // Second try: Query parameters
      const response = await authAxios.post('/api/comments/c1/comment', null, {
        params: {
          recipeId: recipeId,
          content: content.trim(),
          username: username,
        }
      });
      return response.data;
      
    } catch (secondError) {
      console.error('All comment posting attempts failed:', secondError);
      throw secondError;
    }
  }
};

export const reactToComment = async (commentId, type) => {
  const authAxios = createAuthAxios();
  try {
    const response = await authAxios.post('/api/comments/c1/comment/like', { 
      commentId, 
      type 
    });
    return response.data;
  } catch (error) {
    console.error('Error reacting to comment:', error);
    throw error;
  }
};

// ========== HELPER FUNCTIONS ==========
export const formatDate = (dateString) => {
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

export const renderIngredients = (recipe) => {
  if (!recipe) return [];
  if (Array.isArray(recipe.ingredients)) return recipe.ingredients;
  if (typeof recipe.ingredients === "string")
    return recipe.ingredients.split(/,|\n/).map((i) => i.trim()).filter(Boolean);
  return ["No ingredients listed"];
};

// Helper to extract comments from API response
export const extractComments = (response) => {
  let commentsArray = [];

  if (Array.isArray(response)) {
    commentsArray = response;
  } else if (response && Array.isArray(response.comments)) {
    commentsArray = response.comments;
  } else if (response && response.comment) {
    commentsArray = [response.comment];
  } else if (response && typeof response === 'object') {
    const possibleArrays = Object.values(response).find(val => Array.isArray(val));
    if (possibleArrays) {
      commentsArray = possibleArrays;
    }
  }

  return commentsArray;
};