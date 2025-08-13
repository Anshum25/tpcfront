import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiService } from '../api';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Service - City Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  describe('getCities', () => {
    it('should fetch active cities successfully', async () => {
      const mockCities = [
        {
          _id: '1',
          name: 'Vadodara',
          image: '/uploads/vadodara.jpg',
          studentCount: 150,
          isActive: true,
        },
        {
          _id: '2',
          name: 'Surat',
          image: '/uploads/surat.jpg',
          studentCount: 100,
          isActive: true,
        },
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCities,
      });

      const result = await apiService.getCities();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/cities')
      );
      expect(result).toEqual(mockCities);
    });

    it('should throw error when fetch fails', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(apiService.getCities()).rejects.toThrow('Failed to fetch cities');
    });
  });

  describe('createCityWithFormData', () => {
    it('should create city with form data successfully', async () => {
      const mockCity = {
        _id: '1',
        name: 'Vadodara',
        image: '/uploads/vadodara.jpg',
        studentCount: 0,
        isActive: true,
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCity,
      });

      const formData = new FormData();
      formData.append('name', 'Vadodara');
      formData.append('studentCount', '0');
      formData.append('isActive', 'true');

      const result = await apiService.createCityWithFormData(formData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/cities'),
        expect.objectContaining({
          method: 'POST',
          body: formData,
        })
      );
      expect(result).toEqual(mockCity);
    });
  });

  describe('deleteCity', () => {
    it('should delete city successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
      });

      await apiService.deleteCity('1');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/cities/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});

describe('API Service - Registration Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitRegistration', () => {
    it('should submit registration successfully', async () => {
      const mockResponse = {
        message: 'Registration successful!',
        registration: {
          _id: '1',
          name: 'John Doe',
          city: 'Vadodara',
          status: 'pending',
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const registrationData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        city: 'Vadodara',
      };

      const result = await apiService.submitRegistration(registrationData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/registrations'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle registration errors', async () => {
      const errorResponse = {
        message: 'You have already registered for this city',
      };

      (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => errorResponse,
      });

      const registrationData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        city: 'Vadodara',
      };

      await expect(apiService.submitRegistration(registrationData))
        .rejects.toThrow('You have already registered for this city');
    });
  });

  describe('getRegistrations', () => {
    it('should fetch registrations with pagination', async () => {
      const mockResponse = {
        registrations: [
          {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+91 9876543210',
            city: 'Vadodara',
            status: 'pending',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        totalPages: 1,
        currentPage: 1,
        total: 1,
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.getRegistrations({
        page: 1,
        limit: 20,
        city: 'Vadodara',
        status: 'pending',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/registrations?page=1&limit=20&city=Vadodara&status=pending'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateRegistration', () => {
    it('should update registration status', async () => {
      const mockRegistration = {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        city: 'Vadodara',
        status: 'confirmed',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRegistration,
      });

      const result = await apiService.updateRegistration('1', { status: 'confirmed' });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/registrations/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ status: 'confirmed' }),
        })
      );
      expect(result).toEqual(mockRegistration);
    });
  });
});