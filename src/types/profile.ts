// Profile DTOs and Types

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  phone?: string;
}

export interface UploadAvatarRequest {
  avatar: File;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}
