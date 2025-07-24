import { Item } from "../vinted";

enum Status {
    Available = "available",
    Unavailable = "unavailable",
    Buyed = "buyed"
}

export interface Article {
    created_at: string
    buyed_at: string | null
    filter_id: number
    id: number
    id_article_vinted: number
    id_vinted_account: number | null
    status: Status
    user_id: number
    brand?: string
    size?: string
    title?: string
    data: string | Item | null
}