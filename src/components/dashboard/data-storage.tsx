"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BriefcaseBusiness,
  Calculator,
  FileText,
  FolderPlus,
  ShoppingCart,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";

type Department = "hr" | "logistics" | "finance" | "sales";

interface DataFolder {
  id: string;
  name: string;
  department: Department;
  icon: React.ReactNode;
  fileCount: number;
  lastUpdated: string;
}

const dataFolders: DataFolder[] = [
  {
    id: "hr-docs",
    name: "Personeelsdocumenten",
    department: "hr",
    icon: <Users size={24} className="text-blue-500" />,
    fileCount: 12,
    lastUpdated: "2023-10-15",
  },
  {
    id: "hr-policies",
    name: "Bedrijfsbeleid",
    department: "hr",
    icon: <Users size={24} className="text-blue-500" />,
    fileCount: 5,
    lastUpdated: "2023-09-28",
  },
  {
    id: "logistics-inventory",
    name: "Voorraadgegevens",
    department: "logistics",
    icon: <BriefcaseBusiness size={24} className="text-green-500" />,
    fileCount: 8,
    lastUpdated: "2023-10-20",
  },
  {
    id: "logistics-shipping",
    name: "Transportdocumenten",
    department: "logistics",
    icon: <BriefcaseBusiness size={24} className="text-green-500" />,
    fileCount: 15,
    lastUpdated: "2023-10-22",
  },
  {
    id: "finance-invoices",
    name: "Facturen",
    department: "finance",
    icon: <Calculator size={24} className="text-purple-500" />,
    fileCount: 32,
    lastUpdated: "2023-10-25",
  },
  {
    id: "finance-expenses",
    name: "Uitgaven",
    department: "finance",
    icon: <Calculator size={24} className="text-purple-500" />,
    fileCount: 18,
    lastUpdated: "2023-10-18",
  },
  {
    id: "sales-customers",
    name: "Klantgegevens",
    department: "sales",
    icon: <ShoppingCart size={24} className="text-orange-500" />,
    fileCount: 24,
    lastUpdated: "2023-10-21",
  },
  {
    id: "sales-products",
    name: "Productcatalogus",
    department: "sales",
    icon: <ShoppingCart size={24} className="text-orange-500" />,
    fileCount: 7,
    lastUpdated: "2023-09-30",
  },
];

export default function DataStorage() {
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | "all"
  >("all");

  const filteredFolders =
    selectedDepartment === "all"
      ? dataFolders
      : dataFolders.filter(
          (folder) => folder.department === selectedDepartment,
        );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Data Storage</h2>
        <p className="text-gray-600">
          Upload en beheer uw bedrijfsgegevens per afdeling. Ondersteunde
          bestandsformaten: PDF, Excel, en afbeeldingen.
        </p>
      </div>

      {/* Upload Button */}
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedDepartment === "all" ? "default" : "outline"}
            onClick={() => setSelectedDepartment("all")}
            className="flex items-center gap-2"
          >
            <FileText size={16} />
            <span>Alle</span>
          </Button>
          <Button
            variant={selectedDepartment === "hr" ? "default" : "outline"}
            onClick={() => setSelectedDepartment("hr")}
            className="flex items-center gap-2"
          >
            <Users size={16} />
            <span>HR</span>
          </Button>
          <Button
            variant={selectedDepartment === "logistics" ? "default" : "outline"}
            onClick={() => setSelectedDepartment("logistics")}
            className="flex items-center gap-2"
          >
            <BriefcaseBusiness size={16} />
            <span>Logistiek</span>
          </Button>
          <Button
            variant={selectedDepartment === "finance" ? "default" : "outline"}
            onClick={() => setSelectedDepartment("finance")}
            className="flex items-center gap-2"
          >
            <Calculator size={16} />
            <span>Financiën</span>
          </Button>
          <Button
            variant={selectedDepartment === "sales" ? "default" : "outline"}
            onClick={() => setSelectedDepartment("sales")}
            className="flex items-center gap-2"
          >
            <ShoppingCart size={16} />
            <span>Sales</span>
          </Button>
        </div>

        <Button className="flex items-center gap-2">
          <Upload size={16} />
          <span>Bestanden Uploaden</span>
        </Button>
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* New Folder Card */}
        <Card className="border-dashed hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-center items-center p-6">
          <FolderPlus size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            Nieuwe Map Aanmaken
          </h3>
          <p className="text-sm text-gray-500 text-center mt-2">
            Klik om een nieuwe map voor uw data aan te maken
          </p>
        </Card>

        {/* Data Folders */}
        {filteredFolders.map((folder) => (
          <Card
            key={folder.id}
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-gray-100">{folder.icon}</div>
                <div className="text-sm text-gray-500">
                  {folder.fileCount} bestanden
                </div>
              </div>
              <CardTitle className="mt-2">{folder.name}</CardTitle>
              <CardDescription>
                Laatst bijgewerkt:{" "}
                {new Date(folder.lastUpdated).toLocaleDateString("nl-NL")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(folder.fileCount * 3, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
