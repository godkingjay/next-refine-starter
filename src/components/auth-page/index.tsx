"use client";
import type { AuthPageProps } from "@refinedev/core";
import { AuthPage as AuthPageBase } from "@refinedev/core";
import AuthForgotPassword from "./auth-forgot-password";
import AuthLogin from "./auth-login";
import AuthRegister from "./auth-register";
import AuthUpdatePassword from "./auth-update-password";

export type CustomAuthPageProps = (
  | {
      type: "login";
      onSignIn?: () => void;
    }
  | {
      type: "register";
      onSignUp?: () => void;
    }
  | {
      type: "forgotPassword";
      onForgotPassword?: () => void;
    }
  | {
      type: "updatePassword";
      onUpdatePassword?: () => void;
    }
) &
  AuthPageProps;

export const AuthPage = (props: AuthPageProps) => {
  const renderContent = (authType: AuthPageProps["type"]) => {
    switch (authType) {
      case "login":
        return <AuthLogin {...props} type="login" />;
      case "register":
        return <AuthRegister {...props} type="register" />;
      case "forgotPassword":
        return <AuthForgotPassword {...props} type="forgotPassword" />;
      case "updatePassword":
        return <AuthUpdatePassword {...props} type="updatePassword" />;
    }
  };

  return (
    <AuthPageBase {...props} renderContent={() => renderContent(props.type)} />
  );
};
