export interface Identity {
    created_at: string;
    date_of_birth: string | null;
    email: string;
    first_name: string;
    gender: string | null;
    id: number;
    last_name: string;
}


export interface Subscription {
    status: string;
    current_period_end: number;
    cancel_at_period_end: Boolean;
}


export interface User {
    id: number;
    picture: string;
    link_code: string;
    language: string;
    lastDeliveryId: number|null;
    role: 'admin' | 'user'
    created_at: string;
    identity: Identity;
    subscription: Subscription;
}