"use client";

import { Provider as ProviderJotai } from "jotai";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ProviderJotai>
      <NuqsAdapter>{children}</NuqsAdapter>
    </ProviderJotai>
  );
}
