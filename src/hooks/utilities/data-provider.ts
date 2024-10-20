import {
  BaseApiDataResponse,
  HandleMutate,
  HandleMutateDelete,
  HandleMutateUpdate,
} from "@hooks/types";
import { HandleError } from "@hooks/types/errors";
import { CustomPaginator } from "@lib/types";
import { LoginResponse } from "@providers/auth-provider/types";
import {
  BaseRecord,
  CrudFilter,
  HttpError,
  useCreate,
  useDelete,
  useGetIdentity,
  useList,
  UseListProps,
  useOne,
  UseOneProps,
  useUpdate,
} from "@refinedev/core";
import { useState } from "react";

export const useCustomCreate = <P extends {}, R extends BaseRecord, E>(
  resource: string,
) => {
  const { mutate, ...others } = useCreate<R, HandleError<E>>();

  const handleMutate: HandleMutate<P, R, HandleError<E>> = async (
    payload,
    options,
  ) => {
    mutate(
      {
        resource: resource,
        values: payload,
      },
      {
        ...options,
      },
    );
  };

  return { handleMutate, ...others };
};

export const useCustomUpdate = <P extends {}, R extends BaseRecord, E>(
  resource: string,
) => {
  const { mutate, ...others } = useUpdate<R, HandleError<E>>();

  const handleMutate: HandleMutateUpdate<P, R, HandleError<E>> = async (
    id,
    payload,
    options,
  ) => {
    mutate(
      {
        resource: resource,
        values: payload,
        id: id ?? "",
      },
      {
        ...options,
      },
    );
  };

  return { handleMutate, ...others };
};

export const useCustomDelete = <R extends BaseRecord, E>(resource: string) => {
  const { mutate, ...others } = useDelete<R, HandleError<E>>();

  const handleMutate: HandleMutateDelete<R, HandleError<E>> = async (
    id,
    options,
  ) => {
    mutate(
      {
        resource: resource,
        id: id ?? "",
      },
      {
        ...options,
      },
    );
  };

  return { handleMutate, ...others };
};

export const useCustomList = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
>({
  resource,
  pagination,
  ...props
}: UseListProps<TQueryFnData, TError, TData> = {}) => {
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
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
    filters: [
      ...(filterOptions ?? []),
      {
        field: "items",
        operator: "eq",
        value: perPage.toString(),
      },
      {
        field: "page",
        operator: "eq",
        value: currentPage.toString(),
      },
    ],
    ...props,
  });

  const customData: CustomPaginator<TData> | undefined = data;

  return {
    customData,
    perPage,
    currentPage,
    filters: filterOptions,
    setPerPage,
    setCurrentPage,
    setFilters: setFilterOptions,
    ...dataProps,
  };
};

export const useCustomOne = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
>({ resource, ...props }: UseOneProps<TQueryFnData, TError, TData> = {}) => {
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
