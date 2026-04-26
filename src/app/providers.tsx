"use client";

import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "@/app/lib/mui-theme";
import { AuthProvider } from "@/components/AuthProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
    </AuthProvider>
  );
}
