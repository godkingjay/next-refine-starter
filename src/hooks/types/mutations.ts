import { CreateResponse } from "@refinedev/core";

export type MutationOptions<T, U> = {
  onSuccess?: (data: CreateResponse<T>) => void;
  onError?: (error: U) => void;
};

export type HandleMutate<T, U, V> = (
  payload: T,
  options?: MutationOptions<U, V>,
) => void;

export type HandleMutateUpdate<T, U, V> = (
  id: string | number,
  payload: T,
  options?: MutationOptions<U, V>,
) => void;

export type HandleMutateDelete<R, E> = (
  id: string | number,
  options?: MutationOptions<R, E>,
) => void;

export type BaseApiErrorResponse = {
  statusCode: number;
  message: string;
};

export type BaseApiResponse = {
  status: string;
  message: string;
};

export type BaseApiDataResponse<T> = {
  status: string;
  message: string;
  data: T;
};
