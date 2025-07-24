import apiRequest from './main';
import { PromotionRead, PromotionCreate } from '@/types';
import { AxiosResponse } from 'axios';

// Récupérer les promotions d'un restaurant
export const get_restaurant_promotions = async (restaurant_id: Number): Promise<AxiosResponse<PromotionRead[]>> => {
    return await apiRequest('GET', `/restaurants/${restaurant_id}/promotions`, null, null, true);
};

export const get_restaurant_promotions_for_me = async (restaurant_id: Number): Promise<AxiosResponse<PromotionRead[]>> => {
    return await apiRequest('GET', `/restaurants/${restaurant_id}/promotions/me`, null, null, true);
};

export const getTokenPromotion = async (promotionId: number): Promise<AxiosResponse<string>> => {
    return await apiRequest('GET', `/promotions/${promotionId}/token`, null, null, true);
};

export const useTokenPromotion = async (token: string): Promise<AxiosResponse<PromotionRead>> => {
    return await apiRequest('POST', `/promotions/token/use`, { token }, null, true);
};

// Créer une promotion pour tous le monde
export const create_promotion_for_everyone = async (rewardData: PromotionCreate): Promise<AxiosResponse<PromotionRead>> => {
    rewardData.forEveryone = true
    return await apiRequest('POST', `/restaurants/me/promotions`, rewardData, null, true);
};

// Créer une promotion pour un client spécifique.e
export const create_promotion_for_specific_customer = async (customer_id: Number, rewardData: PromotionCreate): Promise<AxiosResponse<PromotionRead>> => {
    rewardData.forEveryone = false
    return await apiRequest('POST', `/restaurants/me/promotions/customers/${customer_id}`, rewardData, null, true);
};

// Créer une promotion pour un client spécifique.e
export const create_promotion_for_inactive_customers = async (rewardData: PromotionCreate): Promise<AxiosResponse<PromotionRead>> => {
    rewardData.forEveryone = false
    return await apiRequest('POST', `/restaurants/me/promotions/inactive-customers`, rewardData, null, true);
};

export const get_all_promotions_user = async (page): Promise<AxiosResponse<PromotionRead[]>> => { 
    return await apiRequest('GET', `/promotions`, null, {page}, true);
};

export const get_all_promotions_for_user = async (page): Promise<AxiosResponse<PromotionRead[]>> => { 
    return await apiRequest('GET', `/promotions/me`, null, {page}, true);
};

