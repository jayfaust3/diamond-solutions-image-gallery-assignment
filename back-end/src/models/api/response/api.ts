export interface APIResponse<TData = never> {
    data?: TData
}

export interface PaginatedAPIResponse<TData> extends APIResponse<TData[]> {
    previous: string | null
    next: string | null
}