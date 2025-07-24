import apiRequest from './main';
import { AxiosResponse } from 'axios';
import { PointHistoryRead } from '@/types';

// Récupérer l'historique des points d'un utilisateur dans un restaurant
export const get_point_history = async (
    restaurant_id: number,
    limit: number = 10,
    page: number = 0
): Promise<AxiosResponse<PointHistoryRead[]>> => {
    return await apiRequest('GET',
        `/restaurants/${restaurant_id}/point-history?limit=${limit}&page=${page}`,
        null,
        null,
        true
    );
};