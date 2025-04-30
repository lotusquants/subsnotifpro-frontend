import axios from 'axios';
import { GetDashboardResponse } from '../types/dashboard';

const API_BASE_URL = 'http://localhost:8080'; // Your Go backend URL

export interface DashboardFilters {
  platformUserIDs?: string[];
  statuses?: string[];
  platforms?: string[];
  planTypes?: string[];
  dateFrom?: Date | null;
  dateTo?: Date | null;
  page?: number;
  pageSize?: number;
}

export const fetchDashboardData = async (filters: DashboardFilters): Promise<GetDashboardResponse> => {
  const params: Record<string, string> = {};
  
  // Add array filters
  if (filters.platformUserIDs?.length) {
    params.platform_user_ids = filters.platformUserIDs.join(',');
  }
  if (filters.statuses?.length) {
    params.statuses = filters.statuses.join(',');
  }
  if (filters.platforms?.length) {
    params.platforms = filters.platforms.join(',');
  }
  if (filters.planTypes?.length) {
    params.plan_types = filters.planTypes.join(',');
  }
  
  // Add date filters
  if (filters.dateFrom) {
    params.date_from = filters.dateFrom.toISOString().split('T')[0];
  }
  if (filters.dateTo) {
    params.date_to = filters.dateTo.toISOString().split('T')[0];
  }
  
  // Add pagination
  params.page = (filters.page || 1).toString();
  params.page_size = (filters.pageSize || 10).toString();

  const response = await axios.get(`${API_BASE_URL}/api/dashboard/get`, { params });
  console.log('API Request Params:', params);
  console.log('API Response:', response.data);
  
  // Transform response remains the same
  const transformedData = response.data.data.map((item: any) => ({
    platformUserID: item.platform_user_id,
    productID: item.product_id,
    platform: item.platform,
    status: item.status,
    planType: item.plan_type,
    startDate: item.start_date,
    renewalDate: item.renewal_date,
    expirationDate: item.expiration_date, 
    latestOrderID: item.latest_order_id,
    purchaseToken: item.purchase_token,
    totalAmount: item.total_amount,
    currency: item.currency, 
    lastModified: item.last_modified
  }));

  return {
    data: transformedData,
    total: Number(response.data.total) || 0,
    page: Number(response.data.page) || 1,
    pageSize: Number(response.data.page_size) || 10,
    totalPages: Number(response.data.total_pages) || 1
  };
};