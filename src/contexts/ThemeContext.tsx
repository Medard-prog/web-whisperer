
import React, { createContext, useState, useContext, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
};

const ThemeContext = createContext<{
  theme: string;
  setTheme: (theme: string) => void;
}>({
  theme: "light",
  setTheme: () => null,
});

export const ThemeProvider = ({ children, defaultTheme = "light" }: ThemeProviderProps) => {
  console.log("ThemeProvider rendering, default theme:", defaultTheme);

  return (
    <NextThemesProvider attribute="class" defaultTheme={defaultTheme}>
      {children}
    </NextThemesProvider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
