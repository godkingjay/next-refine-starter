import { BaseApiErrorResponse } from "@hooks/types";
import {
  useCustomCreate,
  useCustomDelete,
  useCustomUpdate,
} from "@hooks/utilities";
import {
  CreateExamplePayload,
  CreateExampleResponse,
  DeleteExampleError,
  DeleteExampleResponse,
  UpdateExamplePayload,
  UpdateExampleResponse,
} from "./types";

export const useExampleCreate = <
  Payload extends CreateExamplePayload,
  Response extends CreateExampleResponse,
  Error extends BaseApiErrorResponse,
>() => {
  return useCustomCreate<Payload, Response, Error>({
    resource: "/api/examples",
  });
};

export const useExampleUpdate = <
  Payload extends UpdateExamplePayload,
  Response extends UpdateExampleResponse,
  Error extends BaseApiErrorResponse,
>() => {
  return useCustomUpdate<Payload, Response, Error>({
    resource: "/api/examples",
  });
};

export const useExampleDelete = () => {
  return useCustomDelete<DeleteExampleResponse, DeleteExampleError>({
    resource: "/api/examples",
  });
};
