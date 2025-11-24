import { HttpClient } from './base';

/**
 * Partner Registration API
 * Handles partner/vendor registration and onboarding
 */

export interface PartnerRegistrationData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  description: string;
}

export interface PartnerRegistrationResponse {
  success: boolean;
  message: string;
  partnerId?: string;
  tenantId?: string;
  requiresVerification?: boolean;
}

class PartnerAPI extends HttpClient {
  constructor() {
    super();
  }

  /**
   * Register a new partner/vendor
   * @param data Partner registration information
   * @returns Registration response with partner details
   */
  async register(data: PartnerRegistrationData): Promise<PartnerRegistrationResponse> {
    return this.post<PartnerRegistrationResponse>('/api/partners/register', data);
  }

  /**
   * Verify partner email
   * @param token Verification token from email
   */
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    return this.post('/api/partners/verify-email', { token });
  }

  /**
   * Resend verification email
   * @param email Partner email address
   */
  async resendVerification(email: string): Promise<{ success: boolean; message: string }> {
    return this.post('/api/partners/resend-verification', { email });
  }

  /**
   * Get partner application status
   * @param partnerId Partner ID
   */
  async getApplicationStatus(partnerId: string): Promise<{
    status: 'pending' | 'approved' | 'rejected';
    message?: string;
  }> {
    return this.get(`/api/partners/${partnerId}/status`);
  }
}

// Export singleton instance
export const partnerApi = new PartnerAPI();
