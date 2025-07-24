export interface Filter {
    id: Number
    name_article: string
    amountArticleFind: number
    is_active: boolean
    price_min: number
    price_max: number
    categories: Array<number>
    sizes: Array<number>
    brands: Array<number>
    states: Array<number>
    colors: Array<number>
    forbidden_words: Array<string>
    account_vinted_actived: Array<number>
    notification: Boolean
    autocop: Boolean
}