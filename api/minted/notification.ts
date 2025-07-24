import apiRequest from './main';
import { NotificationRead } from '@/types';
import { AxiosResponse } from 'axios';

export const get_notifications = async (page): Promise<AxiosResponse<NotificationRead[]>> => { 
    return await apiRequest('GET', `/notifications/me`, null, {page}, true);
};