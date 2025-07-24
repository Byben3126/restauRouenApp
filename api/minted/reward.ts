import apiRequest from './main';
import { RewardRead, RewardUpdate, RewardCreate } from '@/types';
import { AxiosResponse } from 'axios';

// Récupérer toutes les récompenses d'un restaurant
export const getRewards = async (restaurantId: number): Promise<AxiosResponse<RewardRead[]>> => {
    return await apiRequest('GET', `/restaurants/${restaurantId}/rewards`, null, null, true);
};

export const getTokenReward = async (rewardId: number): Promise<AxiosResponse<string>> => {
    return await apiRequest('GET', `/rewards/${rewardId}/token`, null, null, true);
};

export const useTokenReward = async (token: string): Promise<AxiosResponse<RewardRead>> => {
    return await apiRequest('POST', `/rewards/token/use`, { token }, null, true);
};
// Créer une récompense pour un restaurant
export const createReward = async (rewardData: RewardCreate): Promise<AxiosResponse<RewardRead>> => {
    return await apiRequest('POST', `/users/me/restaurant/rewards`, rewardData, null, true);
};

// Mettre à jour une récompense spécifique
export const updateReward = async (rewardId: number, rewardData: RewardUpdate): Promise<AxiosResponse<RewardRead>> => {
    return await apiRequest('PATCH', `/rewards/${rewardId}`, rewardData, null, true);
};

// Supprimer une récompense spécifique
export const deleteReward = async (rewardId: number): Promise<AxiosResponse<{ ok: boolean }>> => {
    return await apiRequest('DELETE', `/rewards/${rewardId}`, null, null, true);
};
