export type LoginResponse = {
  data: UserResource;
  message: string;
  status: string;
  token: string;
};

export type RegisterParams = {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
};
