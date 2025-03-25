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
  FileText,
  PlusCircle,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useState } from "react";

type Department = "hr" | "logistics" | "finance" | "sales";

interface Template {
  id: string;
  title: string;
  description: string;
  department: Department;
  icon: React.ReactNode;
  useCases: string[];
}

const templates: Template[] = [
  {
    id: "hr-personnel-guide",
    title: "Personeelsgids Q&A",
    description:
      "Beantwoord vragen van medewerkers over het personeelshandboek en beleid.",
    department: "hr",
    icon: <Users size={24} className="text-blue-500" />,
    useCases: ["Verlofaanvragen", "Ziekmeldingen", "Arbeidsvoorwaarden"],
  },
  {
    id: "hr-onboarding",
    title: "Onboarding Assistent",
    description:
      "Begeleid nieuwe medewerkers door het onboardingproces met gepersonaliseerde instructies.",
    department: "hr",
    icon: <Users size={24} className="text-blue-500" />,
    useCases: ["Introductie", "Documentatie", "Training"],
  },
  {
    id: "logistics-inventory",
    title: "Voorraad Assistent",
    description:
      "Houd voorraden bij en genereer automatisch bestellingen wanneer nodig.",
    department: "logistics",
    icon: <BriefcaseBusiness size={24} className="text-green-500" />,
    useCases: ["Voorraadniveaus", "Bestellingen", "Leveranciersbeheer"],
  },
  {
    id: "logistics-cmr",
    title: "CMR Generator",
    description:
      "Genereer automatisch transportdocumenten op basis van ordergegevens.",
    department: "logistics",
    icon: <BriefcaseBusiness size={24} className="text-green-500" />,
    useCases: ["Vrachtbrieven", "Transportplanning", "Documentatie"],
  },
  {
    id: "finance-invoice",
    title: "Bon-naar-Factuur",
    description:
      "Converteer bonnetjes en kwitanties automatisch naar facturen voor de boekhouding.",
    department: "finance",
    icon: <Calculator size={24} className="text-purple-500" />,
    useCases: ["Bonverwerking", "Factuurcreatie", "Boekhouding"],
  },
  {
    id: "finance-expense",
    title: "Uitgavenanalyse",
    description:
      "Analyseer uitgavenpatronen en identificeer besparingsmogelijkheden.",
    department: "finance",
    icon: <Calculator size={24} className="text-purple-500" />,
    useCases: ["Kostenanalyse", "Budgettering", "Rapportage"],
  },
  {
    id: "sales-quote",
    title: "Offerte Maker",
    description:
      "Genereer professionele offertes op basis van klantgegevens en productcatalogus.",
    department: "sales",
    icon: <ShoppingCart size={24} className="text-orange-500" />,
    useCases: ["Prijsberekening", "Klantvoorstellen", "Verkoopbegeleiding"],
  },
  {
    id: "sales-crm",
    title: "CRM Generator",
    description:
      "Houd klantinteracties bij en genereer gepersonaliseerde follow-ups.",
    department: "sales",
    icon: <ShoppingCart size={24} className="text-orange-500" />,
    useCases: ["Klantbeheer", "Verkoopkansen", "Follow-up"],
  },
];

export default function AgentTemplates() {
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | "all"
  >("all");

  const filteredTemplates =
    selectedDepartment === "all"
      ? templates
      : templates.filter(
          (template) => template.department === selectedDepartment,
        );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Agent Templates</h2>
        <p className="text-gray-600">
          Kies uit onze vooraf gebouwde templates per afdeling om snel aan de
          slag te gaan met AI-assistenten voor uw bedrijf.
        </p>
      </div>

      {/* Department Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedDepartment === "all" ? "default" : "outline"}
          onClick={() => setSelectedDepartment("all")}
          className="flex items-center gap-2"
        >
          <Bot size={16} />
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

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-gray-100">
                  {template.icon}
                </div>
              </div>
              <CardTitle className="mt-2">{template.title}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Use Cases:</h4>
                <ul className="text-sm space-y-1">
                  {template.useCases.map((useCase, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full flex items-center gap-2">
                <PlusCircle size={16} />
                <span>Template Toevoegen</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
