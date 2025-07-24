import { RestaurantData } from "./restaurant.types";

export interface PromotionBase {
    forEveryone?: boolean;
    name: string;
}

export interface PromotionCreate extends PromotionBase {
    expires_at?: string // ISO date string
}

export interface PromotionUpdate {
}

export interface PromotionRead extends PromotionBase {
    id: number;
    restaurant_id: number;
    restaurant?: RestaurantData;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    expires_at: string; // ISO date string

}