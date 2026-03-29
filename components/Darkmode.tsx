"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "@/context/Theme";

export default function Darkmode({ tamanho }: { tamanho?: number }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <Toggle
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="group size-9 data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted max-md:size-10 cursor-pointer"
        onPressedChange={toggleTheme}
        pressed={theme === "dark"}
        variant="outline"
      >
        <MoonIcon
          aria-hidden="true"
          className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
          size={tamanho ?? 16}
        />
        <SunIcon
          aria-hidden="true"
          className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          size={tamanho ?? 16} 
        />
      </Toggle>
    </div>
  );
}