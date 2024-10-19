import { GetListResponse } from "@refinedev/core";

export interface CustomPaginator<T> extends GetListResponse<T> {
    links?: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta?: {
        current_page: number;
        from: number | null;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        path: string | null;
        per_page: number;
        to: number | null;
        total: number;
    };
}

export type Paginator<T> = {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        path: string | null;
        per_page: number;
        to: number | null;
        total: number;
    };
};
