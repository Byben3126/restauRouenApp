import { RestaurantData } from './restaurant.types';

export interface PointHistoryRead {
    id: number;
    restaurant_id: number;
    user_id: number;
    points: number;
    action: 'gain' | 'loss';
    created_at: string; // Date au format ISO
    updated_at: string; // Date au format ISO
    restaurant: RestaurantData
}