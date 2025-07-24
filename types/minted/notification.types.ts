export interface NotificationBase {
    id: number;
    data: string;
    is_read: boolean;
    heading: string;
    content: string;
    user_id: number;
}

export interface NotificationCreate extends NotificationBase {}

export interface NotificationUpdate {
    is_read?: boolean;
}

export interface NotificationRead extends NotificationBase {

}
