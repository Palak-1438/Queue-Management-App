"use client";

import { Bell, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function TopNavbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40 w-full md:pl-72">
      <div className="flex-1 flex items-center max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search queues, tokens, or people..."
            className="w-full bg-muted/50 border-none rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
        </button>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}

        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium leading-none">{session?.user?.name || "Manager"}</span>
            <span className="text-xs text-muted-foreground mt-1">{session?.user?.email || "admin@queueflow.com"}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-sm">
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "M"}
          </div>
        </div>
      </div>
    </header>
  );
}
