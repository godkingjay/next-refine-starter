"use client";

import { RefineKbarProvider } from "@refinedev/kbar";
import React from "react";
import { DevtoolsProvider } from "./devtools";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@components/ui/tooltip";
import { Toaster } from "@components/ui/toaster";
import { AppProgressBar } from "next-nprogress-bar";
import { SonnToaster } from "@components/ui/sonner";

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers = (props: ProvidersProps) => {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <RefineKbarProvider>
        <DevtoolsProvider>
          <TooltipProvider>{props.children}</TooltipProvider>
          <Toaster />
          <SonnToaster />
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
