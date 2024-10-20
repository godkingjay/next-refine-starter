import { useCustomList, useCustomOne } from "@hooks/utilities";
import { HttpError, UseListProps } from "@refinedev/core";

type UseExampleListProps<T> = UseListProps<T, HttpError, T>;

export const useExampleList = (
  props?: UseExampleListProps<ExampleResource>,
) => {
  return useCustomList<ExampleResource>({
    resource: "/api/examples",
    pagination: {
      current: 1,
      pageSize: 10,
    },
    ...props,
  });
};

export const useExampleData = (id: string) => {
  return useCustomOne<ExampleResource>({
    resource: `/api/examples/${id}`,
    id: id,
  });
};
