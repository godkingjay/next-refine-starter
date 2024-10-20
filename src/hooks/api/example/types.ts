export type CreateExamplePayload = {
  name: string;
  description: string;
};

export type CreateExampleResponse = {
  status: string;
  message: string;
  data: {
    id: number;
    name: string;
    description: string;
  };
};

export type UpdateExamplePayload = {
  id: number;
  name: string;
  description: string;
};

export type UpdateExampleResponse = {
  status: string;
  message: string;
  data: {
    id: number;
    name: string;
    description: string;
  };
};

export type DeleteExampleResponse = {
  status: string;
  message: string;
};

export type DeleteExampleError = {
  status: string;
  message: string;
};
