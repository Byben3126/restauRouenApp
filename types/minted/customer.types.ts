import { RewardRead } from "./reward.types"
import { RestaurantData } from "./restaurant.types";
import { PointHistoryRead } from "./pointHistory.types";
import {User} from "./user.types";
export interface Customer {
    id: number;
    points: number;
    last_visit_date: string;
    total_points_gained: number;
    restaurant?: RestaurantData;
    user?: User
}

export interface CustomerProgress {
    points: number; 
    closest_reward: RewardRead | null 
    reward_available_count?: number,
}

export interface CustomerWithPregress extends Customer {
    progress: CustomerProgress
}

export interface CustomerCardAdmin extends Customer {
    progress: CustomerProgress
    last_points_gained: PointHistoryRead
    isInactive: boolean
}