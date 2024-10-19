'use client';
import ApiService from '@lib/api-service';
import { LoginResponse } from '@providers/auth-provider/types';
import { DataProvider, LogicalFilter } from '@refinedev/core';
import { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export const dataProvider: DataProvider = {
	getOne: async ({ resource, id, meta }) => {
		const auth = Cookies.get('auth');
		if (auth) {
			let parsedAuth = JSON.parse(auth) as LoginResponse;

			const searchParams = meta ? `?${new URLSearchParams(meta).toString()}` : '';

			const res = await ApiService.get(`${resource}/${id}${searchParams}`, {
				headers: {
					Authorization: 'Bearer ' + parsedAuth.token,
				},
			} as AxiosRequestConfig).catch((e) => {
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
	update: async ({ resource, id, variables }) => {
		const auth = Cookies.get('auth');
		if (auth) {
			let parsedAuth = JSON.parse(auth) as LoginResponse;
			const res = await ApiService.put(`${resource}/${id}`, variables, {
				headers: {
					Authorization: 'Bearer ' + parsedAuth.token,
				},
			} as AxiosRequestConfig).catch((e) => {
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
	getList: async ({ resource, filters, sorters, pagination, meta }) => {
		const auth = Cookies.get('auth');
		if (auth) {
			let parsedAuth = JSON.parse(auth) as LoginResponse;

			let extraQueries: {
				per_page: string;
				page: string;
				mode: 'paginate' | 'off';
				[p: string]: string;
			} = {
				per_page: '10',
				page: '1',
				mode: 'paginate',
			};

			if (pagination) {
				const { mode, pageSize, current } = pagination;
				extraQueries.per_page = pageSize?.toString() ?? '10';
				extraQueries.page = current?.toString() ?? '1';
				extraQueries.mode = mode == 'off' ? 'off' : 'paginate';
			}

			if (filters && filters.length) {
				filters.forEach((filter) => {
					let logicalFilter = filter as LogicalFilter;
					if (logicalFilter.field) {
						extraQueries[logicalFilter.field] = filter.value;
					}
				});
			}

			let extraQueryUrl = new URLSearchParams({
				...extraQueries,
			});

			const res = await ApiService.get(`${resource}?${extraQueryUrl.toString()}`, {
				headers: {
					Authorization: 'Bearer ' + parsedAuth.token,
				},
			} as AxiosRequestConfig).catch((e) => {
				return Promise.reject(e);
			});

			if (res.data && res.data.data) {
				return {
					data: res.data.data,
					total: res.data.data.length,
					links: res.data.links,
					meta: res.data.meta,
				};
			} else {
				return {
					data: res.data,
					total: res.data.length,
				};
			}
		}
		return {
			data: [],
			total: 0,
		};
	},
	create: async ({ resource, variables, meta }) => {
		const auth = Cookies.get('auth');
		if (auth) {
			let parsedAuth = JSON.parse(auth) as LoginResponse;
			const res = await ApiService.post(resource, variables, {
				headers: {
					Authorization: 'Bearer ' + parsedAuth.token,
					'Content-Type': meta?.isMultipart ? 'multipart/form-data' : undefined,
				},
				...(meta?.isMultipart
					? {
							onUploadProgress: meta?.onUploadProgress,
					  }
					: undefined),
			} as AxiosRequestConfig).catch((e) => {
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
	deleteOne: async ({ resource, id, variables }) => {
		const auth = Cookies.get('auth');
		if (auth) {
			let parsedAuth = JSON.parse(auth) as LoginResponse;
			const res = await ApiService.delete(`${resource}/${id}`, {
				data: variables,
				headers: {
					Authorization: 'Bearer ' + parsedAuth.token,
				},
			} as AxiosRequestConfig).catch((e) => {
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
};
