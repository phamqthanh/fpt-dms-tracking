"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export const queryClient = new QueryClient();
export function RootLayoutClient(props: PropsWithChildren) {
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}
