export interface DashboardRecord {
  subscriptionID: string;
    platformUserID: string;
    productID: string;
    platform: string;
    status: string;
    planType: string;
    basePlanID?: string;
    activeOfferID?: string;
    expirationDate?: string;
    latestOrderID: string;
    purchaseToken: string;
    totalAmount?: number;
    currency?: string;
    startDate: string;
    renewalDate: string;
    lastModified: string;
  }


  
  export interface GetDashboardResponse {
    data: DashboardRecord[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
  
  export type PlatformType = 'APP_STORE' | 'PLAY_STORE';
  export type StatusType = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'GRACE_PERIOD';
  export type PlanType = 'MONTHLY' | 'ANNUAL' | 'LIFETIME';