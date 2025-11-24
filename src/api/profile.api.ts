/**
 * Profile API
 * Handles user profile management
 */

import { AdminProfile, UpdateProfileRequest, UploadAvatarResponse } from '@/types/profile';
import { httpClient, apiConfig, mockDelay } from './base';

// Mock profile data
let mockProfile: AdminProfile = {
  id: '1',
  name: 'Admin User',
  email: 'admin@homedecor.com',
  phone: '+1 (555) 123-4567',
  role: 'Administrator',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
};

/**
 * Profile API Class
 */
class ProfileAPI {
  /**
   * Get current user profile
   */
  async get(): Promise<AdminProfile> {
    if (apiConfig.useMockData) {
      return mockDelay(mockProfile);
    }
    return httpClient.get<AdminProfile>('/profile');
  }

  /**
   * Update user profile
   */
  async update(data: UpdateProfileRequest): Promise<AdminProfile> {
    if (apiConfig.useMockData) {
      mockProfile = {
        ...mockProfile,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return mockDelay(mockProfile);
    }
    return httpClient.put<AdminProfile>('/profile', data);
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    if (apiConfig.useMockData) {
      // Simulate upload by creating local URL
      const avatarUrl = URL.createObjectURL(file);
      mockProfile.avatarUrl = avatarUrl;
      return mockDelay({ avatarUrl });
    }

    const formData = new FormData();
    formData.append('avatar', file);
    
    return httpClient.upload<UploadAvatarResponse>('/profile/avatar', formData);
  }
}

// Export singleton instance
export const profileApi = new ProfileAPI();
