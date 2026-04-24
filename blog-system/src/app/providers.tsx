"use client";

import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "@/app/lib/mui-theme";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <ThemeProvider theme={appTheme}>{children}</ThemeProvider>;
}
