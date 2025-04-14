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
import { useDashboard } from "@/lib/context";
import { Department, Template } from "@/types";

export default function AgentTemplates() {
  const { templates, addTemplate } = useDashboard();
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | "all"
  >("all");

  const filteredTemplates =
    selectedDepartment === "all"
      ? templates
      : templates.filter(
          (template) => template.department === selectedDepartment,
        );

  const handleAddTemplate = (template: Template) => {
    addTemplate(template);
  };

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
              <Button 
                className="w-full flex items-center gap-2"
                onClick={() => handleAddTemplate(template)}
              >
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
