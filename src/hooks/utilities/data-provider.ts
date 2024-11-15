import {
  BaseApiDataResponse,
  BaseApiErrorResponse,
  HandleMutate,
  HandleMutateDelete,
  HandleMutateUpdate,
} from "@hooks/types";
import { HandleError } from "@hooks/types/errors";
import { concatenate } from "@lib";
import { CustomPaginator } from "@lib/types";
import { LoginResponse } from "@providers/auth-provider/types";
import {
  BaseRecord,
  CrudFilter,
  HttpError,
  LogicalFilter,
  useCreate,
  UseCreateProps,
  useDelete,
  UseDeleteProps,
  useGetIdentity,
  useList,
  UseListProps,
  useOne,
  UseOneProps,
  useUpdate,
  UseUpdateProps,
} from "@refinedev/core";
import { useState } from "react";

type UseCustomCreateProps<
  TVariables extends BaseRecord = BaseRecord,
  TData extends BaseRecord = TVariables,
  TError extends HttpError = BaseApiErrorResponse,
> = UseCreateProps<TData, TError, TVariables> & {
  params?: LogicalFilter[];
};

export const useCustomCreate = <
  TVariables extends BaseRecord = BaseRecord,
  TData extends BaseRecord = TVariables,
  TError extends HttpError = HttpError,
>({
  resource,
  params = [],
  ...props
}: UseCustomCreateProps<TVariables, TData, TError>) => {
  const { mutate, ...others } = useCreate<TData, HandleError<TError>>({
    resource,
  });

  const handleMutate: HandleMutate<
    TVariables,
    TData,
    HandleError<TError>
  > = async (payload, options) => {
    mutate(
      {
        resource: concatenate(
          "?",
          resource,
          concatenate(
            "&",
            "method=POST",
            ...params.map((param) => `${param.field}=${param.value}`),
          ),
        ),
        values: payload,
      },
      {
        ...props,
        ...options,
      },
    );
  };

  return { handleMutate, ...others };
};

type UseCustomUpdateProps<
  TVariables extends BaseRecord = BaseRecord,
  TData extends BaseRecord = TVariables,
  TError extends HttpError = BaseApiErrorResponse,
> = UseUpdateProps<TData, TError, TVariables> & {
  params?: LogicalFilter[];
};

export const useCustomUpdate = <
  TVariables extends BaseRecord = BaseRecord,
  TData extends BaseRecord = TVariables,
  TError extends HttpError = HttpError,
>({
  resource,
  params = [],
  ...props
}: UseCustomUpdateProps<TVariables, TData, TError>) => {
  const { mutate, ...others } = useUpdate<TData, HandleError<TError>>();

  const handleMutate: HandleMutateUpdate<
    TVariables,
    TData,
    HandleError<TError>
  > = async (id, payload, options) => {
    mutate(
      {
        resource: concatenate(
          "?",
          resource,
          concatenate(
            "&",
            "method=PUT",
            ...params.map((param) => `${param.field}=${param.value}`),
          ),
        ),
        values: payload,
        id: id ?? "",
      },
      {
        ...props,
        ...options,
      },
    );
  };

  return { handleMutate, ...others };
};

type UseCustomPatchProps<
  TVariables extends BaseRecord = BaseRecord,
  TData extends BaseRecord = TVariables,
  TError extends HttpError = BaseApiErrorResponse,
> = UseUpdateProps<TData, TError, TVariables> & {
  params?: LogicalFilter[];
};

export const useCustomPatch = <
  TVariables extends BaseRecord = BaseRecord,
  TData extends BaseRecord = TVariables,
  TError extends HttpError = HttpError,
>({
  resource,
  params = [],
  ...props
}: UseCustomPatchProps<TVariables, TData, TError>) => {
  const { mutate, ...others } = useUpdate<TData, HandleError<TError>>();

  const handleMutate: HandleMutateUpdate<
    TVariables,
    TData,
    HandleError<TError>
  > = async (id, payload, options) => {
    mutate(
      {
        resource: concatenate(
          "?",
          resource,
          concatenate(
            "&",
            "method=PATCH",
            ...params.map((param) => `${param.field}=${param.value}`),
          ),
        ),
        values: payload,
        id: id ?? "",
      },
      {
        ...props,
        ...options,
      },
    );
  };

  return { handleMutate, ...others };
};

type UseCustomDeleteProps<
  TVariables extends BaseRecord = BaseRecord,
  TError extends HttpError = BaseApiErrorResponse,
> = UseDeleteProps<TVariables, TError, TVariables> & {
  id?: string | number;
  resource: string;
  params?: LogicalFilter[];
};

export const useCustomDelete = <
  TVariables extends BaseRecord = BaseRecord,
  TError extends HttpError = BaseApiErrorResponse,
>({
  id: _id = "",
  resource,
  params = [],
  ...props
}: UseCustomDeleteProps<TVariables, TError>) => {
  const { mutate, ...others } = useDelete<TVariables, HandleError<TError>>();

  const handleMutate: HandleMutateDelete<
    TVariables,
    HandleError<TError>
  > = async (id, options) => {
    mutate(
      {
        id: id || _id,
        resource: concatenate(
          "?",
          resource,
          concatenate(
            "&",
            "method=DELETE",
            ...params.map((param) => `${param.field}=${param.value}`),
          ),
        ),
        ...props,
      },
      {
        ...props,
        ...options,
      },
    );
  };

  return { handleMutate, ...others };
};

export type UseCustomListProps<
  TQueryFnData,
  TError = HttpError,
  TData = TQueryFnData,
> = UseListProps<TQueryFnData, TError, TData>;

export const useCustomList = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
>({
  resource,
  pagination,
  ...props
}: UseCustomListProps<TQueryFnData, TError, TData> = {}) => {
  const [currentPage, setCurrentPage] = useState(pagination?.current || 1);
  const [perPage, setPerPage] = useState(pagination?.pageSize || 10);
  const [filterOptions, setFilterOptions] = useState<CrudFilter[] | undefined>(
    [],
  );
  const { data, ...dataProps } = useList<TQueryFnData, TError, TData>({
    resource,
    pagination: {
      ...pagination,
      pageSize: perPage,
      current: currentPage,
    },
    ...props,
  });

  const customData: CustomPaginator<TData> | undefined = data;

  return {
    customData,
    perPage,
    currentPage,
    params: filterOptions,
    setPerPage,
    setCurrentPage,
    setFilters: setFilterOptions,
    ...dataProps,
  };
};

export type UseCustomOneProps<
  TQueryFnData,
  TError = HttpError,
  TData = TQueryFnData,
> = UseOneProps<TQueryFnData, TError, TData>;

export const useCustomOne = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
>({
  resource,
  ...props
}: UseCustomOneProps<TQueryFnData, TError, TData> = {}) => {
  const { data, ...dataProps } = useOne<TQueryFnData, TError, TData>({
    resource,
    ...props,
  });

  const customData = data?.data as unknown as BaseApiDataResponse<TData>;

  return { customData, ...dataProps };
};

export const useCustomGetIdentity = () => {
  const { data: customData, ...dataProps } = useGetIdentity<LoginResponse>();

  return { customData, ...dataProps };
};
