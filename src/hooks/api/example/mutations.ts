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

export const useExampleCreate = () => {
  return useCustomCreate<
    CreateExamplePayload,
    CreateExampleResponse,
    BaseApiErrorResponse
  >("/api/examples");
};

export const useExampleUpdate = () => {
  return useCustomUpdate<
    UpdateExamplePayload,
    UpdateExampleResponse,
    BaseApiErrorResponse
  >("/api/examples");
};

export const useExampleDelete = () => {
  return useCustomDelete<DeleteExampleResponse, DeleteExampleError>(
    "/api/examples",
  );
};
