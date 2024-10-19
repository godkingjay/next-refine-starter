"use client";

import { SonnToaster } from "@components/ui/sonner";
import { Toaster } from "@components/ui/toaster";
import { TooltipProvider } from "@components/ui/tooltip";
import { RefineKbarProvider } from "@refinedev/kbar";
import { AppProgressBar } from "next-nprogress-bar";
import { ThemeProvider } from "next-themes";
import React from "react";
import { DevtoolsProvider } from "./devtools";
import { HotToastProvider } from "./hot-toast-provider";

type ProvidersProps = {
    children: React.ReactNode;
};

const Providers = (props: ProvidersProps) => {
    return (
        <ThemeProvider
            attribute="class"
            enableSystem={false}
            defaultTheme="light"
        >
            <RefineKbarProvider>
                <DevtoolsProvider>
                    <TooltipProvider>{props.children}</TooltipProvider>
                    <Toaster />
                    <SonnToaster />
                    <HotToastProvider />
                </DevtoolsProvider>
            </RefineKbarProvider>
            <AppProgressBar
                height="4px"
                color="#e11d48"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </ThemeProvider>
    );
};

export default Providers;
