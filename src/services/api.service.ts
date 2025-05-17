import { type DisturbanceEvent, type RegionSummary } from '../types/api';
import { validationService } from './validation.service';

const API_BASE_URL = 'https://electric-emergency-and-disturbance-api.vercel.app/api/v1';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
}

export const apiService = {
  async getDisturbanceEvents(params: any): Promise<DisturbanceEvent[]> {
    let url = `${API_BASE_URL}/disturbance-events/`;
    if (params.month) {
      url = `${API_BASE_URL}/disturbance-events/month/${params.month}`;
    }
    const queryParams = new URLSearchParams();
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    if (params.offset) queryParams.append('offset', String(params.offset));
    if (params.limit) queryParams.append('limit', String(params.limit));

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url);
    const data = await handleResponse<DisturbanceEvent[]>(response);
    return validationService.validateEvents(data);
  },

  async getDisturbanceEventsByRegion(
    region: string,
    params: any
  ): Promise<DisturbanceEvent[]> {
    let url = `${API_BASE_URL}/disturbance-events/region/${region}`;
    const queryParams = new URLSearchParams();
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    if (params.offset) queryParams.append('offset', String(params.offset));
    if (params.limit) queryParams.append('limit', String(params.limit));

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    const response = await fetch(url);
    const data = await handleResponse<DisturbanceEvent[]>(response);
    return validationService.validateEvents(data);
  },

  async getDisturbanceEventsByEventType(
    eventtype: string,
    params: any
  ): Promise<DisturbanceEvent[]> {
    let url = `${API_BASE_URL}/disturbance-events/eventtype/${eventtype}`;
    const queryParams = new URLSearchParams();
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    if (params.offset) queryParams.append('offset', String(params.offset));
    if (params.limit) queryParams.append('limit', String(params.limit));

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    const response = await fetch(url);
    const data = await handleResponse<DisturbanceEvent[]>(response);
    return validationService.validateEvents(data);
  },

  async getDisturbanceEventsSummaryByRegion(params: any): Promise<RegionSummary> {
    let url = `${API_BASE_URL}/regions/summary/`;
    const queryParams = new URLSearchParams();
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    if (params.offset) queryParams.append('offset', String(params.offset));
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.unit) queryParams.append('unit', params.unit || 's');

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    const response = await fetch(url);
    return handleResponse<RegionSummary>(response);
  },
};