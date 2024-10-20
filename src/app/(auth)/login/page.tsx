// import auth3Dark from "@public/images/auth/auth3-dark.png";
// import auth3Light from "@public/images/auth/auth3-light.png";
import { AuthPage } from "@components/auth-page";
import { authProviderServer } from "@providers/auth-provider";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Login() {
  const data = await getData();

  if (data.authenticated) {
    redirect(data?.redirectTo || "/");
  }

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden">
      <Image
        src={"/images/auth/auth3-dark.png"}
        width={1000}
        height={1000}
        alt="background image"
        className="light:hidden absolute left-0 top-0 h-full w-full"
      />
      <Image
        src={"/images/auth/auth3-light.png"}
        width={1000}
        height={1000}
        alt="background image"
        className="absolute left-0 top-0 h-full w-full dark:hidden"
      />
      <div className="relative z-10 m-auto">
        <AuthPage type="login" />
      </div>
    </div>
  );
}

async function getData() {
  const { authenticated, redirectTo, error } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
    error,
  };
}
