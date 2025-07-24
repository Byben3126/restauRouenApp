
import { currentUser } from "../vinted";

enum Status {
    Deconnected = "deconnected",
    Active = "active",
    Inactive = "inactive"
}

export interface VintedAccount {
    id: number;
    status: Status;
    email: string;
    access_token?: string;
    refresh_token?: string;
    XAnonId?: string;
    XDeviceUUID?: string;
    userAgent?: string;
    currentUser?: currentUser;
}
