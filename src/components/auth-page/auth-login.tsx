import { ActionLoadingText } from "@components/texts";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { useMediaQuery } from "@hooks/utilities";
import { Icon } from "@iconify/react";
import { cn } from "@lib";
import { useLogin } from "@refinedev/core";
import Link from "next/link";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { CustomAuthPageProps } from ".";

type AuthLoginProps = CustomAuthPageProps & {
  type: "login";
};

const AuthLogin = (props: AuthLoginProps) => {
  const { mutate: login, isLoading } = useLogin();
  const [passwordType, setPasswordType] = useState("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");

  const togglePasswordType = () => {
    setPasswordType((prevType) => (prevType === "text" ? "password" : "text"));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    );

    toast.loading("Signing in...", {
      id: "login",
    });

    login(formData, {
      onSuccess: (e) => {
        if (e.success) {
          toast.success("Login Successful", {
            id: "login",
          });
          if (props?.onSignIn) {
            props?.onSignIn();
          } else {
            window.location.assign(e.redirectTo || "/dashboard");
          }
        } else {
          toast.error("Invalid email or password", {
            id: "login",
          });
        }
      },
      onError: () => {
        toast.error("An unexpected error occurred.");
      },
    });
  };

  return (
    <Card className="border">
      <CardContent className="m-4">
        <div className="flex w-full flex-col">
          <div className="mt-6 text-2xl font-bold text-default-900 2xl:mt-8 2xl:text-3xl">
            Hey, Hello 👋
          </div>
          <div className="mt-2 text-base leading-6 text-default-600 2xl:text-lg">
            Enter the information you entered while registering.
          </div>
          <form onSubmit={onSubmit} className="mt-8 2xl:mt-7">
            <div className="relative">
              <Input
                removeWrapper
                type="email"
                id="email"
                name="email"
                size={!isDesktop2xl ? "xl" : "lg"}
                placeholder="admin@admin.com"
                disabled={isLoading}
              />
              <Label
                htmlFor="email"
                className={cn(
                  "absolute start-1 top-2 z-10 origin-[0] -translate-y-5 scale-75 transform rounded-t bg-background px-2 text-base text-default-600 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
                  {
                    "text-sm": isDesktop2xl,
                  },
                )}
              >
                Email
              </Label>
            </div>

            <div className="relative mt-6">
              <Input
                removeWrapper
                type={passwordType === "password" ? "password" : "text"}
                id="password"
                name="password"
                size={!isDesktop2xl ? "xl" : "lg"}
                placeholder="Password"
                disabled={isLoading}
              />
              <Label
                htmlFor="password"
                className={cn(
                  "absolute start-1 top-2 z-10 origin-[0] -translate-y-5 scale-75 transform rounded-t bg-background px-2 text-base text-default-600 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
                  {
                    "text-sm": isDesktop2xl,
                  },
                )}
              >
                Password
              </Label>
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer ltr:right-4 rtl:left-4"
                onClick={togglePasswordType}
              >
                {passwordType === "password" ? (
                  <Icon
                    icon="heroicons:eye"
                    className="h-4 w-4 text-default-400"
                  />
                ) : (
                  <Icon
                    icon="heroicons:eye-slash"
                    className="h-4 w-4 text-default-400"
                  />
                )}
              </div>
            </div>

            <div className="mb-6 mt-5 flex flex-wrap gap-2">
              <div className="flex flex-1 items-center gap-1.5">
                <Checkbox
                  className="mt-[1px] border-default-300"
                  id="isRemembered"
                />
                <Label
                  htmlFor="isRemembered"
                  className="cursor-pointer whitespace-nowrap text-sm text-default-600"
                >
                  Remember me
                </Label>
              </div>
              <Link href="#" className="flex-none text-sm text-primary">
                Forgot Password?
              </Link>
            </div>
            <Button className="mt-5 w-full" disabled={isLoading}>
              <ActionLoadingText
                hideLoadIcon
                isLoading={isLoading}
                labels={{
                  load: "Sign In",
                  loading: "Signing In...",
                }}
              />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthLogin;
