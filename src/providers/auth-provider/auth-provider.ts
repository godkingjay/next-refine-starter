"use client";

import { ApiService, wait } from "@lib";
import { AuthBindings } from "@refinedev/core";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { LoginResponse, RegisterParams } from "./types";

const SampleUser = {
  status: "success",
  message: "Login successful",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  data: {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    role: "admin",
    phone_number: "1234567890",
    email: "admin@admin.com",
  },
};

export const getAuthToken = () => {
  const auth = Cookies.get("auth");
  if (auth) {
    let parsedAuth = JSON.parse(auth) as LoginResponse;
    return parsedAuth.token;
  }

  return "";
};

export const authProvider: AuthBindings = {
  register: async (params: RegisterParams) => {
    const res = await ApiService.post<LoginResponse>("/api/v1/signup", params)
      .then(() => {
        return {
          success: true,
        };
      })
      .catch((e) => {
        return {
          success: false,
          error: e?.response?.data,
        };
      });

    console.log(res);

    return res;
  },
  login: async ({ email, password, remember }) => {
    // const res = await ApiService.post<any, AxiosResponse<LoginResponse>>(
    //     "/api/login",
    //     {
    //         email,
    //         password,
    //     }
    // ).catch((e) => {
    //     return e;
    // });

    return wait(1000, () => {
      if (email === "" || password === "") {
        return {
          success: false,
          message: "Please enter email and password",
          error: {
            name: "Login Error",
            message: "Invalid credentials",
          },
        };
      } else if (email !== SampleUser.data.email || password !== "password") {
        return {
          success: false,
          message: "Invalid email or password",
          error: {
            name: "Login Error",
            message: "Invalid credentials",
          },
        };
      }

      const user = SampleUser;

      if (user) {
        Cookies.set("auth", JSON.stringify(user), {
          expires: 2,
          path: "/",
        });

        let redirectTo = "/";

        // TODO redirect based on roles
        // if (
        //   (user as LoginResponse).roles.includes("admin") ||
        //   (user as LoginResponse).roles.includes("super-admin")
        // ) {
        //   redirectTo = "/admin";
        // }
        return {
          success: true,
          redirectTo,
        };
      }

      return {
        success: false,
        error: {
          name: "Login Error",
          message: "Invalid credentials",
        },
      };
    });
  },
  logout: async ({ redirectPath }: { redirectPath: string }) => {
    const auth = Cookies.get("auth");
    if (auth) {
      let parsedAuth = JSON.parse(auth) as LoginResponse;
      const res = await ApiService.post("/api/logout", {}, {
        headers: {
          Authorization: "Bearer " + parsedAuth.token,
        },
      } as AxiosRequestConfig).catch((e) => {
        if (e.status === 401) {
          Cookies.remove("auth", { path: "/" });
        }
        return e;
      });

      if (res.status == 200) {
        Cookies.remove("auth", { path: "/" });
        return {
          success: true,
          redirectTo: redirectPath ?? "/",
        };
      }
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const parsedUser = JSON.parse(auth) as LoginResponse;
      return {
        role: [], //parsedUser.roles,
        permissions: [], // parsedUser.permissions,
      };
    }
    return null;
  },
  getIdentity: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      return JSON.parse(auth) as LoginResponse;
    }
    return null;
  },
  onError: async (error) => {
    console.log("on error", error);
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
