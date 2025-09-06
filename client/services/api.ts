const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
    isAdmin: boolean;
  };
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AdminUsersResponse {
  users: User[];
}

export interface Analytics {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  avgSession: number; // seconds
}

export interface Event {
  _id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  category: string;
  status: string;
  createdAt?: string;
  image?: string; // Add this line for event image URL
  registrationLink?: string; // Add this line for Google Form link
}

export interface TeamMember {
  _id?: string;
  name: string;
  position: string;
  description?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  image?: string;
  city: string;
  core?: boolean;
}

export interface Advisor {
  _id?: string;
  name: string;
  title: string;
  organization?: string;
  description?: string;
  expertise: string[];
  image?: string;
  isInteraction?: boolean;
}

export interface CityData {
  _id?: string;
  name: string;
  image: string;
  studentCount: number;
  registrationLink?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
}

export interface Registration {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface ChangeCredentialsRequest {
  currentPassword: string;
  newEmail?: string;
  newPassword?: string;
}

export interface ChangeCredentialsResponse {
  message: string;
}

export interface GalleryImage {
  _id: string;
  title: string;
  url: string;
  alt?: string;
  part: string;
  event?: string;
  date?: string;
  location?: string;
  category?: string;
}

export interface CarouselImage {
  _id: string;
  title: string;
  url: string;
  alt?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('tpc_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async signup(data: SignupRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return response.json();
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const result = await response.json();
    
    // Store the token
    localStorage.setItem('tpc_token', result.token);
    
    return result;
  }

  async getAdminUsers(): Promise<AdminUsersResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch users');
    }

    return response.json();
  }

  logout(): void {
    localStorage.removeItem('tpc_token');
    localStorage.removeItem('tpc_user');
  }

  getStoredToken(): string | null {
    return localStorage.getItem('tpc_token');
  }

  getStoredUser(): any {
    const user = localStorage.getItem('tpc_user');
    return user ? JSON.parse(user) : null;
  }

  setStoredUser(user: any): void {
    localStorage.setItem('tpc_user', JSON.stringify(user));
  }

  async getAnalytics(): Promise<Analytics> {
    const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  }

  async getEvents(): Promise<Event[]> {
    await new Promise(res => setTimeout(res, 2000)); // Artificial 2s delay for testing
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  }

  async createEvent(event: Event): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/admin/events`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  }

  async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
  }

  async deleteEvent(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete event');
  }

  async registerForEvent(eventId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  }

  async getEventParticipants(eventId: string): Promise<{ participants: User[] }> {
    const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}/participants`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch participants');
    }
    return response.json();
  }

  async getImages(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/admin/images`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch images');
    return response.json();
  }

  async getGalleryImages(): Promise<GalleryImage[]> {
    const response = await fetch(`${API_BASE_URL}/admin/images/gallery`);
    if (!response.ok) throw new Error('Failed to fetch gallery images');
    return response.json();
  }

  async getCarouselImages(): Promise<CarouselImage[]> {
    const response = await fetch(`${API_BASE_URL}/admin/images/carousel`);
    if (!response.ok) throw new Error('Failed to fetch carousel images');
    return response.json();
  }

  async createEventWithFormData(formData: FormData): Promise<Event> {
    const token = localStorage.getItem('tpc_token');
    const response = await fetch(`${API_BASE_URL}/admin/events`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  }

  async updateEventWithFormData(id: string, formData: FormData): Promise<Event> {
    const token = localStorage.getItem('tpc_token');
    const response = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    const token = localStorage.getItem('tpc_token');
    const response = await fetch(`${API_BASE_URL}/admin/team`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch team members');
    return response.json();
  }

  async createTeamMemberWithFormData(formData: FormData): Promise<TeamMember> {
    const token = localStorage.getItem('tpc_token');
    const response = await fetch(`${API_BASE_URL}/admin/team`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create team member');
    return response.json();
  }

  async updateTeamMemberWithFormData(id: string, formData: FormData): Promise<TeamMember> {
    const token = localStorage.getItem('tpc_token');
    const response = await fetch(`${API_BASE_URL}/admin/team/${id}`, {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update team member');
    return response.json();
  }

  async deleteTeamMember(id: string): Promise<void> {
    const token = localStorage.getItem('tpc_token');
    const response = await fetch(`${API_BASE_URL}/admin/team/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to delete team member');
  }

  async getAdvisors(type?: 'board' | 'interaction'): Promise<Advisor[]> {
    const token = localStorage.getItem('tpc_token');
    const queryParam = type ? `?type=${type}` : '';
    const response = await fetch(`${API_BASE_URL}/admin/advisors${queryParam}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch advisors');
    return response.json();
  }

  async getBoardAdvisors(): Promise<Advisor[]> {
    return this.getAdvisors('board');
  }

  async getInteractions(): Promise<Advisor[]> {
    return this.getAdvisors('interaction');
  }

  async createAdvisorWithFormData(formData: FormData): Promise<Advisor> {
    const token = localStorage.getItem('tpc_token');
    const response = await fetch(`${API_BASE_URL}/admin/advisors`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create advisor');
    return response.json();
  }

  async updateAdvisorWithFormData(id: string, formData: FormData): Promise<Advisor> {
    const token = localStorage.getItem('tpc_token');
    const response = await fetch(`${API_BASE_URL}/admin/advisors/${id}`, {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update advisor');
    return response.json();
  }

  async deleteAdvisor(id: string): Promise<void> {
    const token = localStorage.getItem('tpc_token');
    const response = await fetch(`${API_BASE_URL}/admin/advisors/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to delete advisor');
  }

  async changeAdminCredentials(data: ChangeCredentialsRequest): Promise<ChangeCredentialsResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/change-credentials`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change credentials');
    }
    return response.json();
  }

  async getPublicTeamMembers(): Promise<TeamMember[]> {
    const response = await fetch(`${API_BASE_URL}/team`);
    if (!response.ok) throw new Error('Failed to fetch team members');
    return response.json();
  }

  async getLatestCompletedEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events/latest-completed`);
    if (!response.ok) throw new Error('Failed to fetch latest completed events');
    return response.json();
  }

  // City management methods
  async getCities(): Promise<CityData[]> {
    const response = await fetch(`${API_BASE_URL}/cities`);
    if (!response.ok) throw new Error('Failed to fetch cities');
    return response.json();
  }

  async getAdminCities(): Promise<CityData[]> {
    const response = await fetch(`${API_BASE_URL}/admin/cities`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch cities');
    return response.json();
  }

  async createCityWithFormData(formData: FormData): Promise<CityData> {
    const token = localStorage.getItem('tpc_token');
    const response = await fetch(`${API_BASE_URL}/admin/cities`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create city');
    return response.json();
  }

  async updateCityWithFormData(id: string, formData: FormData): Promise<CityData> {
    const token = localStorage.getItem('tpc_token');
    const response = await fetch(`${API_BASE_URL}/admin/cities/${id}`, {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update city');
    return response.json();
  }

  async deleteCity(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/cities/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete city');
  }

  // Registration methods
  async submitRegistration(data: RegistrationFormData): Promise<{ message: string; registration: any }> {
    const response = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  }

  async getRegistrations(params?: {
    page?: number;
    limit?: number;
    city?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{
    registrations: Registration[];
    totalPages: number;
    currentPage: number;
    total: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.city) queryParams.append('city', params.city);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await fetch(`${API_BASE_URL}/admin/registrations?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch registrations');
    return response.json();
  }

  async updateRegistration(id: string, data: { status: string }): Promise<Registration> {
    const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to update registration');
    return response.json();
  }

  async deleteRegistration(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to delete registration');
  }

  async getRegistrationsByCity(cityName: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    registrations: Registration[];
    totalPages: number;
    currentPage: number;
    total: number;
    city: string;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/admin/registrations/city/${cityName}?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch registrations');
    return response.json();
  }

  async getRegistrationsByStatus(status: string, params?: {
    page?: number;
    limit?: number;
    city?: string;
  }): Promise<{
    registrations: Registration[];
    totalPages: number;
    currentPage: number;
    total: number;
    status: string;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.city) queryParams.append('city', params.city);

    const response = await fetch(`${API_BASE_URL}/admin/registrations/status/${status}?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch registrations');
    return response.json();
  }
}

export const apiService = new ApiService(); 