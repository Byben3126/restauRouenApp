import apiRequest from './main';
import { CustomerProgress, PointHistoryRead } from '@/types';
import { AxiosResponse } from 'axios';

// Récupérer la progression d'un client pour un restaurant

export const getCustomerProgress = async (restaurantId: number): Promise<AxiosResponse<CustomerProgress>> => {
    return await apiRequest('GET', `/customer/me/my-progress`, null, { restaurant_id: restaurantId }, true);
};

export const searchCustomers = async (query?: string, page?:number, status?: 'default'|'inactive'|'top', limit?:number): Promise<AxiosResponse<any>> => {
    return await apiRequest('GET', `/restaurants/me/customers/search`, null,  { q:query, page, status, limit }, true);
}

export const givePoints = async (customer_id:string|number, points:number): Promise<AxiosResponse<PointHistoryRead>> => {
    return await apiRequest('POST', `/restaurants/me/customers/${customer_id}/points/give`, { points },  null, true);
}

export const createCustomer = async (customerData: any): Promise<AxiosResponse<any>> => {
    return await apiRequest('POST', `/restaurants/me/customers`, customerData, null, true);
}