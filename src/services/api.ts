const API_BASE_URL = 'http://localhost:3000/api';

// Types
export interface User {
  id: number;
  email_id: string;
  mobile_no: string;
  role: 'ADMIN' | 'USER' | 'MODERATOR';
  profile?: UserProfile;
}

export interface UserProfile {
  id: number;
  user_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  dob?: string;
  profile_url?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  state_id?: number;
  district_id?: number;
  tahsil_id?: number;
  address_line?: string;
  about?: string;
  profession_id?: number;
  business_description?: string;
  state_name?: string;
  dist_name?: string;
  tahsil_name?: string;
  employee_type?: string;
}

export interface BlogPost {
  id: number;
  user_id: number;
  title: string;
  content: string;
  image_url?: string;
  tags?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  email_id?: string;
  first_name?: string;
  last_name?: string;
  author_profile_url?: string;
}

export interface State {
  id: number;
  state_name: string;
}

export interface District {
  id: number;
  master_state_id: number;
  dist_name: string;
}

export interface Tahsil {
  id: number;
  master_dist_id: number;
  tahsil_name: string;
}

export interface Profession {
  id: number;
  employee_type: 'PRIVATE' | 'GOVERNMENT' | 'SELF_EMPLOYED' | 'BUSINESS';
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T> {
  message: string;
  [key: string]: any;
}

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Auth API
export const authAPI = {
  // Register user
  register: async (userData: {
    email_id: string;
    mobile_no: string;
    password: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    dob?: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    state_id?: number;
    district_id?: number;
    tahsil_id?: number;
    address_line?: string;
    about?: string;
    profession_id?: number;
    business_description?: string;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse<AuthResponse>(response);
  },

  // Login user
  login: async (credentials: { email_id: string; password: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  },

  // Store phone number for unauthenticated users
  storePhoneNumber: async (mobile_no: string): Promise<{ message: string; user: any }> => {
    const response = await fetch(`${API_BASE_URL}/auth/store-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile_no }),
    });
    return handleResponse<{ message: string; user: any }>(response);
  },

  // Complete user profile for users without passwords
  completeProfile: async (profileData: {
    user_id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    dob: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    state_id: number;
    district_id: number;
    tahsil_id: number;
    address_line: string;
    about?: string;
    profession_id: number;
    business_description?: string;
  }): Promise<{ message: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    return handleResponse<{ message: string; user: User }>(response);
  },

  // Logout user
  logout: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ message: string; tokens: { accessToken: string; refreshToken: string } }> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    return handleResponse<{ message: string; tokens: { accessToken: string; refreshToken: string } }>(response);
  },
};

// User API
export const userAPI = {
  // Get user profile
  getProfile: async (): Promise<{ message: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string; user: User }>(response);
  },

  // Update user profile
  updateProfile: async (profileData: Partial<UserProfile>): Promise<{ message: string; profile: UserProfile }> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse<{ message: string; profile: UserProfile }>(response);
  },

  // Delete user profile
  deleteProfile: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },
};

// Master Data API
export const masterDataAPI = {
  // Get all states
  getStates: async (): Promise<ApiResponse<State[]>> => {
    const response = await fetch(`${API_BASE_URL}/master-data/states`);
    return handleResponse<ApiResponse<State[]>>(response);
  },

  // Get districts by state
  getDistrictsByState: async (stateId: number): Promise<ApiResponse<District[]>> => {
    const response = await fetch(`${API_BASE_URL}/master-data/states/${stateId}/districts`);
    return handleResponse<ApiResponse<District[]>>(response);
  },

  // Get tahsils by district
  getTahsilsByDistrict: async (districtId: number): Promise<ApiResponse<Tahsil[]>> => {
    const response = await fetch(`${API_BASE_URL}/master-data/districts/${districtId}/tahsils`);
    return handleResponse<ApiResponse<Tahsil[]>>(response);
  },

  // Get all professions
  getProfessions: async (): Promise<ApiResponse<Profession[]>> => {
    const response = await fetch(`${API_BASE_URL}/master-data/professions`);
    return handleResponse<ApiResponse<Profession[]>>(response);
  },

  // Get complete location hierarchy
  getLocationHierarchy: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE_URL}/master-data/location-hierarchy`);
    return handleResponse<ApiResponse<any[]>>(response);
  },
};

// Blog API
export const blogAPI = {
  // Get all blog posts
  getAllPosts: async (page = 1, limit = 20, search?: string): Promise<{ data: BlogPost[]; pagination: any }> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append('search', search);
    
    const response = await fetch(`${API_BASE_URL}/blog/posts?${params}`);
    const result = await handleResponse<{ data: BlogPost[]; pagination: any }>(response);
    return result;
  },

  // Get blog post by ID
  getPostById: async (id: number): Promise<{ data: BlogPost }> => {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${id}`);
    return handleResponse<{ data: BlogPost }>(response);
  },

  // Get posts by user ID
  getPostsByUser: async (userId: number, page = 1, limit = 20): Promise<{ data: BlogPost[]; pagination: any }> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    const response = await fetch(`${API_BASE_URL}/blog/users/${userId}/posts?${params}`);
    const result = await handleResponse<{ data: BlogPost[]; pagination: any }>(response);
    return result;
  },

  // Create new blog post
  createPost: async (postData: { title: string; content: string; image_url?: string; tags?: string[] }): Promise<{ message: string; data: BlogPost }> => {
    const response = await fetch(`${API_BASE_URL}/blog/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData),
    });
    return handleResponse<{ message: string; data: BlogPost }>(response);
  },

  // Update blog post
  updatePost: async (id: number, postData: Partial<{ title: string; content: string; image_url?: string; tags?: string[]; status?: string }>): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData),
    });
    return handleResponse<{ message: string }>(response);
  },

  // Delete blog post
  deletePost: async (id: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },

  // Search blog posts
  searchPosts: async (query: string, page = 1, limit = 20): Promise<{ data: BlogPost[]; searchQuery: string; pagination: any }> => {
    const params = new URLSearchParams({ q: query, page: page.toString(), limit: limit.toString() });
    const response = await fetch(`${API_BASE_URL}/blog/posts/search?${params}`);
    const result = await handleResponse<{ data: BlogPost[]; searchQuery: string; pagination: any }>(response);
    return result;
  },
};

// Token management
export const tokenManager = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  isAuthenticated: () => !!localStorage.getItem('accessToken'),
};

export default {
  auth: authAPI,
  user: userAPI,
  masterData: masterDataAPI,
  blog: blogAPI,
  tokenManager,
};
