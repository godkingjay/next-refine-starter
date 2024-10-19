import { HttpError } from '@refinedev/core';
import { AxiosError } from 'axios';

type GeneralError<E> = AxiosError<E> & HttpError;

export interface HandleError<E> extends GeneralError<E> {}

export interface ApiError {
	message: string;
}
