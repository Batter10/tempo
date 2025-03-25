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
  Bot,
  BriefcaseBusiness,
  Calculator,
  Edit,
  PlayCircle,
  ShoppingCart,
  Trash2,
  Users,
} from "lucide-react";

interface ChosenTemplate {
  id: string;
  title: string;
  department: string;
  icon: React.ReactNode;
  status: "draft" | "configured" | "active";
  dataSource: string;
  dateAdded: string;
}

const chosenTemplates: ChosenTemplate[] = [
  {
    id: "hr-personnel-guide-1",
    title: "Personeelsgids Q&A",
    department: "HR",
    icon: <Users size={24} className="text-blue-500" />,
    status: "active",
    dataSource: "Personeelsdocumenten",
    dateAdded: "2023-10-15",
  },
  {
    id: "logistics-cmr-1",
    title: "CMR Generator",
    department: "Logistiek",
    icon: <BriefcaseBusiness size={24} className="text-green-500" />,
    status: "configured",
    dataSource: "Transportdocumenten",
    dateAdded: "2023-10-18",
  },
  {
    id: "finance-invoice-1",
    title: "Bon-naar-Factuur",
    department: "Financiën",
    icon: <Calculator size={24} className="text-purple-500" />,
    status: "draft",
    dataSource: "Facturen",
    dateAdded: "2023-10-20",
  },
  {
    id: "sales-quote-1",
    title: "Offerte Maker",
    department: "Sales",
    icon: <ShoppingCart size={24} className="text-orange-500" />,
    status: "active",
    dataSource: "Klantgegevens, Productcatalogus",
    dateAdded: "2023-10-22",
  },
];

export default function ChosenTemplates() {
  const getStatusBadge = (status: ChosenTemplate["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Actief
          </span>
        );
      case "configured":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            Geconfigureerd
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            Concept
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Gekozen Templates</h2>
        <p className="text-gray-600">
          Bekijk en beheer de templates die u heeft geselecteerd. Configureer ze
          met uw data en activeer ze als AI-assistenten.
        </p>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {chosenTemplates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Bot size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">
              Geen templates geselecteerd
            </h3>
            <p className="text-sm text-gray-500 mt-2 mb-4">
              Ga naar Agent Templates om templates toe te voegen
            </p>
            <Button variant="outline">Bekijk Templates</Button>
          </div>
        ) : (
          chosenTemplates.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:w-2/3">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">
                          {template.title}
                        </h3>
                        {getStatusBadge(template.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {template.department}
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Data bron:</span>
                          <span>{template.dataSource}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Toegevoegd op:</span>
                          <span>
                            {new Date(template.dateAdded).toLocaleDateString(
                              "nl-NL",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 flex flex-row md:flex-col justify-end gap-2 md:w-1/3">
                  {template.status === "draft" && (
                    <Button className="flex items-center gap-2 w-full">
                      <Edit size={16} />
                      <span>Configureren</span>
                    </Button>
                  )}
                  {template.status === "configured" && (
                    <Button className="flex items-center gap-2 w-full">
                      <PlayCircle size={16} />
                      <span>Activeren</span>
                    </Button>
                  )}
                  {template.status === "active" && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 w-full"
                    >
                      <Edit size={16} />
                      <span>Bewerken</span>
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2 w-full"
                  >
                    <Trash2 size={16} />
                    <span>Verwijderen</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
