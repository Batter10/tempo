import { DashboardProvider } from "@/lib/context";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
} 