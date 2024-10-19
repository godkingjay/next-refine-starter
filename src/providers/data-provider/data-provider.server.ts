import { ApiService } from "@lib";
import { LoginResponse } from "@providers/auth-provider/types";
import { DataProvider } from "@refinedev/core";
import { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export const dataProviderServer: Pick<
    DataProvider,
    "getOne" | "getList" | "getApiUrl"
> = {
    getOne: async ({ resource, id, meta }) => {
        const cookieStore = cookies();
        const auth = cookieStore.get("auth");
        if (auth) {
            let parsedAuth = JSON.parse(auth.value) as LoginResponse;

            const searchParams = meta
                ? `?${new URLSearchParams(meta).toString()}`
                : "";

            const res = await ApiService.get(
                `${resource}/${id}${searchParams}`,
                {
                    headers: {
                        Authorization: "Bearer " + parsedAuth.token,
                    },
                } as AxiosRequestConfig
            ).catch((e) => {
                return Promise.reject(e);
            });

            if (res.data) {
                return {
                    data: res.data,
                };
            }
        }
        return {
            data: null,
        };
    },
    getApiUrl: () => API_URL,
    getList: async ({ resource, filters, sorters, pagination, meta }) => {
        const cookieStore = cookies();
        const auth = cookieStore.get("auth");
        if (auth) {
            let parsedAuth = JSON.parse(auth.value) as LoginResponse;
            const res = await ApiService.get(resource, {
                headers: {
                    Authorization: "Bearer " + parsedAuth.token,
                },
            } as AxiosRequestConfig).catch((e) => {
                return Promise.reject(e);
            });

            if (res.data) {
                return {
                    data: res.data.data,
                    total: res.data.data.length,
                };
            }
        }
        return {
            data: [],
            total: 0,
        };
    },
};
