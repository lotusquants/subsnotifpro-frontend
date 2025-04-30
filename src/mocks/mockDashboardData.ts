import { GetDashboardResponse } from '../types/dashboard';

export const mockDashboardData: GetDashboardResponse = {
  data: [
    {
      platformUserID: 'user123',
      productID: 'com.your.app.premium',
      platform: 'APP_STORE',
      status: 'ACTIVE',
      planType: 'MONTHLY',
      startDate: '2025-01-15T00:00:00Z',
      renewalDate: '2025-06-15T00:00:00Z',
      lastModified: '2025-05-20T10:30:00Z',
      subscriptionID: '',
      latestOrderID: '',
      purchaseToken: ''
    },
    {
      platformUserID: 'user456',
      productID: 'com.your.app.basic',
      platform: 'PLAY_STORE',
      status: 'GRACE_PERIOD',
      planType: 'ANNUAL',
      startDate: '2024-12-01T00:00:00Z',
      renewalDate: '2025-12-01T00:00:00Z',
      lastModified: '2025-05-18T14:45:00Z',
      subscriptionID: '',
      latestOrderID: '',
      purchaseToken: ''
    },
    // Add more mock data as needed
  ],
  total: 2,
  page: 1,
  pageSize: 20,
  totalPages: 1
};