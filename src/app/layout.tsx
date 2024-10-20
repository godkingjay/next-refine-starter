import { Refine } from "@refinedev/core";
import { RefineKbar } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import React, { Suspense } from "react";

import { cn } from "@lib";
import { authProvider } from "@providers/auth-provider";
import { dataProvider } from "@providers/data-provider";
import Providers from "@providers/providers";
import "@styles/index.scss";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";

const font = Poppins({
    preload: false,
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "Refine",
    description: "Generated by create refine app",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(font.className, "theme-blue")}>
                <Suspense>
                    {/* <GitHubBanner /> */}
                    <Providers>
                        <Refine
                            routerProvider={routerProvider}
                            dataProvider={dataProvider}
                            authProvider={authProvider}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                useNewQueryKeys: true,
                                projectId: "0KcuBh-Dupr51-4BbOf9",
                            }}
                        >
                            <div className="flex h-screen flex-col">
                                {children}
                            </div>
                            <RefineKbar />
                        </Refine>
                    </Providers>
                </Suspense>
            </body>
        </html>
    );
}
