import {
  useCustomList,
  UseCustomListProps,
  useCustomOne,
  UseCustomOneProps,
} from "@hooks/utilities";

export const useExampleList = <T extends ExampleResource>(
  props?: UseCustomListProps<T>,
) => {
  return useCustomList<T>({
    resource: "/api/examples",
    pagination: {
      current: 1,
      pageSize: 10,
    },
    ...props,
  });
};

export const useExampleData = <T extends ExampleResource>(
  id: string,
  props?: UseCustomOneProps<T>,
) => {
  return useCustomOne<T>({
    resource: `/api/examples/${id}`,
    id: id,
    ...props,
  });
};
