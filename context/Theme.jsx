"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children, storageKey = "theme-default" }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setTheme(saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, [storageKey]);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(storageKey, theme);

    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme, mounted, storageKey]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => { } }}>
        <div className="min-h-screen bg-(--bg) text-(--text) transition-colors duration-300 w-full flex flex-col">
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen bg-(--bg) text-(--text) transition-colors duration-300 w-full flex flex-col">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}