const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
          }
        } else {
          data = {};
        }
      } else {
        // If not JSON, return the text response
        data = await response.text();
      }

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        const errorMessage = typeof data === 'object' 
          ? (data.detail || data.error || data.message || `API Error: ${response.statusText}`)
          : `API Error: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Auth endpoints
  async register(email: string, password: string, username?: string) {
    const data = await this.request<{
      user: any;
      tokens: { access: string; refresh: string };
    }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ email, password, username: username || email.split('@')[0] }),
    });
    if (data.tokens?.access) {
      this.setToken(data.tokens.access);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', data.tokens.refresh);
      }
    }
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<{
      user: any;
      access: string;
      refresh: string;
    }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access) {
      this.setToken(data.access);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', data.refresh);
      }
    }
    return data;
  }

  async refreshToken() {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const data = await this.request<{ access: string }>('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (data.access) {
      this.setToken(data.access);
    }
    return data;
  }

  async logout() {
    this.clearToken();
  }

  // User endpoints
  async getCurrentUser() {
    return this.request('/users/me/');
  }

  async updateUser(data: Partial<{ first_name: string; last_name: string }>) {
    return this.request('/users/me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Project endpoints
  async getProjects(search?: string, page?: number) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (page) params.append('page', page.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/projects/${query}`);
  }

  async getProject(id: number) {
    return this.request(`/projects/${id}/`);
  }

  async createProject(projectData: any) {
    return this.request('/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: number, data: any) {
    return this.request(`/projects/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: number) {
    return this.request(`/projects/${id}/`, {
      method: 'DELETE',
    });
  }

  async getProjectLibrary(id: number) {
    return this.request(`/projects/${id}/library/`);
  }

  // Subscription endpoints
  async getPlans() {
    return this.request('/subscriptions/plans/');
  }

  async getCurrentSubscription() {
    return this.request('/subscriptions/current/');
  }

  async subscribe(planId: number, billingPeriod: 'monthly' | 'yearly') {
    return this.request('/subscriptions/subscribe/', {
      method: 'POST',
      body: JSON.stringify({ plan_id: planId, billing_period: billingPeriod }),
    });
  }

  // Referral endpoints
  async getReferralLink() {
    return this.request('/referrals/link/');
  }

  async getReferralStats() {
    return this.request('/referrals/stats/');
  }

  // Prompt generation endpoint
  async generatePrompts(projectId: number) {
    return this.request(`/projects/${projectId}/generate-prompts/`, {
      method: 'POST',
    });
  }

  // Plans/Chat endpoints
  async getPlanMessages(projectId: number) {
    return this.request(`/projects/${projectId}/plans/messages/`);
  }

  async sendPlanMessage(projectId: number, message: string) {
    return this.request(`/projects/${projectId}/plans/messages/`, {
      method: 'POST',
      body: JSON.stringify({ role: 'user', content: message }),
    });
  }

  // Status/Todos endpoints
  async getStatusItems(projectId: number) {
    return this.request(`/projects/${projectId}/status/items/`);
  }

  async createStatusItem(projectId: number, item: { title: string; description?: string }) {
    return this.request(`/projects/${projectId}/status/items/`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateStatusItem(projectId: number, itemId: number, completed: boolean) {
    return this.request(`/projects/${projectId}/status/items/${itemId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  }

  // Documentation endpoints
  async initializeDocs(projectId: number) {
    return this.request(`/projects/${projectId}/docs/initialize/`, {
      method: 'POST',
    });
  }

  async getDocs(projectId: number) {
    return this.request(`/projects/${projectId}/docs/`);
  }
}

export const api = new ApiClient(API_BASE_URL);

