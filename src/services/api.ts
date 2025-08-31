const API_BASE_URL = 'http://localhost:8081/api';

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
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
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
  const data = await response.json();
  
  // Handle Java backend response format
  if (data.success !== undefined) {
    if (data.success) {
      return data.data || data;
    } else {
      throw new Error(data.message || 'Request failed');
    }
  }
  
  return data;
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
    const data = await handleResponse<any>(response);
    return data;
  },

  // Login user
  login: async (credentials: { email_id: string; password: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse<any>(response);
    return data;
  },

  // Store phone number for unauthenticated users
  storePhoneNumber: async (mobile_no: string): Promise<{ message: string; user: any }> => {
    const response = await fetch(`${API_BASE_URL}/auth/store-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile_no }),
    });
    const data = await handleResponse<any>(response);
    return { message: data.message || "Phone number stored successfully", user: data.user };
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
    const data = await handleResponse<any>(response);
    return { message: data.message || "Profile completed successfully", user: data.user };
  },

  // Logout user
  logout: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<any>(response);
    return { message: data.message || "Logout successful" };
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ message: string; tokens: { accessToken: string; refreshToken: string } }> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await handleResponse<any>(response);
    return { message: data.message || "Token refreshed successfully", tokens: data.tokens };
  },
};

// User API
export const userAPI = {
  // Get user profile
  getProfile: async (): Promise<{ message: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<any>(response);
    return { message: data.message || "Profile fetched successfully", user: data.user };
  },

  // Update user profile
  updateProfile: async (profileData: Partial<UserProfile>): Promise<{ message: string; profile: UserProfile }> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    const data = await handleResponse<any>(response);
    return { message: data.message || "Profile updated successfully", profile: data.profile };
  },

  // Delete user profile
  deleteProfile: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<any>(response);
    return { message: data.message || "Profile deleted successfully" };
  },
};

// Master Data API
export const masterDataAPI = {
  // Get all states
  getStates: async (): Promise<{ states: State[] }> => {
    console.log('Fetching states from:', `${API_BASE_URL}/data/states`);
    const response = await fetch(`${API_BASE_URL}/data/states`);
    const data = await handleResponse<any>(response);
    console.log('Raw states response:', data);
    // Handle Java backend response format
    if (data.success !== undefined) {
      console.log('States data from success wrapper:', data.data);
      return { states: data.data || [] };
    }
    console.log('States data direct:', data);
    return { states: data || [] };
  },

  // Get districts by state
  getDistrictsByState: async (stateId: number): Promise<{ districts: District[] }> => {
    console.log('Fetching districts for state:', stateId, 'from:', `${API_BASE_URL}/data/states/${stateId}/districts`);
    const response = await fetch(`${API_BASE_URL}/data/states/${stateId}/districts`);
    const data = await handleResponse<any>(response);
    console.log('Raw districts response:', data);
    // Handle Java backend response format
    if (data.success !== undefined) {
      console.log('Districts data from success wrapper:', data.data);
      return { districts: data.data || [] };
    }
    console.log('Districts data direct:', data);
    return { districts: data || [] };
  },

  // Get tahsils by district
  getTahsilsByDistrict: async (districtId: number): Promise<{ tahsils: Tahsil[] }> => {
    console.log('Fetching tahsils for district:', districtId, 'from:', `${API_BASE_URL}/data/districts/${districtId}/tahsils`);
    const response = await fetch(`${API_BASE_URL}/data/districts/${districtId}/tahsils`);
    const data = await handleResponse<any>(response);
    console.log('Raw tahsils response:', data);
    // Handle Java backend response format
    if (data.success !== undefined) {
      console.log('Tahsils data from success wrapper:', data.data);
      return { tahsils: data.data || [] };
    }
    console.log('Tahsils data direct:', data);
    return { tahsils: data || [] };
  },

  // Get all professions
  getProfessions: async (): Promise<{ professions: Profession[] }> => {
    console.log('Fetching professions from:', `${API_BASE_URL}/data/professions`);
    const response = await fetch(`${API_BASE_URL}/data/professions`);
    const data = await handleResponse<any>(response);
    console.log('Raw professions response:', data);
    // Handle Java backend response format
    if (data.success !== undefined) {
      console.log('Professions data from success wrapper:', data.data);
      return { professions: data.data || [] };
    }
    console.log('Professions data direct:', data);
    return { professions: data || [] };
  },

  // Get complete location hierarchy
  getLocationHierarchy: async (): Promise<{ hierarchy: any[] }> => {
    const response = await fetch(`${API_BASE_URL}/data/location-hierarchy`);
    const data = await handleResponse<any>(response);
    // Handle Java backend response format
    if (data.success !== undefined) {
      return { hierarchy: data.data || [] };
    }
    return { hierarchy: data || [] };
  },
};

// Blog API
export const blogAPI = {
  // Get all blog posts
  getAllPosts: async (page = 1, limit = 20, search?: string): Promise<{ data: BlogPost[]; pagination: any }> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append('search', search);
    
    const response = await fetch(`${API_BASE_URL}/blog/posts?${params}`);
    const data = await handleResponse<any>(response);
    return { data: data, pagination: data.pagination };
  },

  // Get blog post by ID
  getPostById: async (id: number): Promise<{ data: BlogPost }> => {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${id}`);
    const data = await handleResponse<any>(response);
    return { data: data };
  },

  // Get posts by user ID
  getPostsByUser: async (userId: number, page = 1, limit = 20): Promise<{ data: BlogPost[]; pagination: any }> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    const response = await fetch(`${API_BASE_URL}/blog/users/${userId}/posts?${params}`);
    const data = await handleResponse<any>(response);
    return { data: data, pagination: data.pagination };
  },

  // Create new blog post
  createPost: async (postData: { title: string; content: string; image_url?: string; tags?: string[] }): Promise<{ message: string; data: BlogPost }> => {
    const response = await fetch(`${API_BASE_URL}/blog/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData),
    });
    const data = await handleResponse<any>(response);
    return { message: data.message || "Blog post created successfully", data: data.data };
  },

  // Update blog post
  updatePost: async (id: number, postData: Partial<{ title: string; content: string; image_url?: string; tags?: string[]; status?: string }>): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData),
    });
    const data = await handleResponse<any>(response);
    return { message: data.message || "Blog post updated successfully" };
  },

  // Delete blog post
  deletePost: async (id: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<any>(response);
    return { message: data.message || "Blog post deleted successfully" };
  },

  // Search blog posts
  searchPosts: async (query: string, page = 1, limit = 20): Promise<{ data: BlogPost[]; searchQuery: string; pagination: any }> => {
    const params = new URLSearchParams({ q: query, page: page.toString(), limit: limit.toString() });
    const response = await fetch(`${API_BASE_URL}/blog/posts/search?${params}`);
    const data = await handleResponse<any>(response);
    return { data: data.data, searchQuery: data.searchQuery, pagination: data.pagination };
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
