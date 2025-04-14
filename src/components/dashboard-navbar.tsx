"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Bot, Home } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";

export default function DashboardNavbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            prefetch
            className="text-xl font-bold flex items-center gap-2"
          >
            <Bot className="h-6 w-6 text-blue-600" />
            <span>Slimme Assistent</span>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            <Home className="h-5 w-5" />
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
