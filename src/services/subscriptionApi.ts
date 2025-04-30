// services/subscriptionApi.ts
import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_BASE_URL = 'http://localhost:8080'; // Your Go backend URL

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Subscription {
  id: string;
  subscriptionId: string;
  activePlatform: string;
  status: string;
  productId: string;
  basePlanId: string;
  planType: string;
  startDate: string;
  nextRenewalDate: string | null;
  expirationDate: string | null;
  latestOrderId: string | null;
  purchaseToken: string;
  currency: string;
  totalAmount: number;
}

// Update your interface to match the API response
export interface SubscriptionEvent {
    id: string;
    event_type: string;  // Changed from eventType
    timestamp: string;
   
    created_at: string;  // Added this field from API
    active_offer_id: string | null;  // Added from API
    amount: number;  // Added from API
    base_plan_id: string | null;  // Added from API
    currency: string;  // Added from API
    platform: string;  // Added from API
    product_id: string;  // Added from API
    subscription_id: string;  // Added from API
  }
  

export const fetchUserSubscriptions = async (
    platform_user_id: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Subscription>> => {
  const response = await axios.get(`${API_BASE_URL}/api/user/unified_subscriptions`, {
    params: { platform_user_id ,page, page_size: pageSize }
  });
  console.log('Subscription API Response:', response.data);
  return response.data;
};

// Change this in your services/subscriptionApi.ts
export const fetchSubscriptionEvents = async (
    subscriptionId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<SubscriptionEvent>> => {
    const response = await axios.get(`${API_BASE_URL}/api/subscriptions/${subscriptionId}/events`, {
      params: { page, page_size: pageSize }
    });
    
    // Add mapping to ensure consistent data structure
    const mappedData = response.data.data.map((event: any) => ({
      id: event.id,
      event_type: event.event_type,
      
      timestamp: event.timestamp,
      created_at: event.created_at,
      active_offer_id: event.active_offer_id,
      amount: event.amount,
      base_plan_id: event.base_plan_id,
      currency: event.currency,
      platform: event.platform,
      product_id: event.product_id,
      subscription_id: event.subscription_id
    }));
  
    return {
      data: mappedData,
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.page_size
    };
  };