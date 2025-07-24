export interface RewardBase {
    name: string;
    point_required: number;
}

export interface RewardCreate extends RewardBase {}

export interface RewardUpdate {
    name?: string;
    point_required?: number;
}

export interface RewardRead extends RewardBase {
    id: number;
    restaurant_id: number;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
}