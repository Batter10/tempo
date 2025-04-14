export type Department = "hr" | "logistics" | "finance" | "sales";

export interface Template {
  id: string;
  title: string;
  description: string;
  department: Department;
  icon: React.ReactNode;
  useCases: string[];
}

export interface ChosenTemplate {
  id: string;
  title: string;
  department: string;
  icon: React.ReactNode;
  status: "draft" | "configured" | "active";
  dataSource: string;
  dateAdded: string;
}

export interface ActiveAgent {
  id: string;
  title: string;
  department: string;
  icon: React.ReactNode;
  status: "online" | "paused";
  interactions: number;
  lastActive: string;
  successRate: number;
}

export interface DataFolder {
  id: string;
  name: string;
  department: Department;
  icon: React.ReactNode;
  fileCount: number;
  lastUpdated: string;
} 